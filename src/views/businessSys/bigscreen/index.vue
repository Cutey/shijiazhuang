<template>
  <el-container
    style="height:100%;flex-direction: column;height: 100%;display: flex;flex-direction: column; min-width: 1366px;overflow-x: auto;"
    id="bigcontainer"
  >
    <el-header style="height:10%" class="navbar">
      <BigscreenHeaderright />
      <BigscreenHeaderleft />
      <Headeruser class="headeruser" />
    </el-header>
    <el-container style="widht:height:90%;width:100%;overflow: hidden;" class="containers">
      <!-- 左侧菜单栏 -->
      <el-aside class="treeaside backgret">
        <BigscreenMenu style @treeClick="treeClick" ref="BigscreenMenu" />
      </el-aside>
      <!-- 网格热点统计数据 -->
      <el-aside class="conentaside" v-if="ruse.hotspot">
        <HotspotTj ref="HotspotTj" :hottime=" hottime" @closeClick="closeClick" />
      </el-aside>
      <!-- 测量工具 -->
          <ul class="cepositon" v-if="ruse.hotspot">
             <li >
                <i class="el-icon-s-help" @click="addPoint" :class="iconactive ? 'isactivericon' : ''" title="创建测量工具"></i>
              </li>
              <li>
                <i class="el-icon-delete-solid" @click="deleteOverlay" title="清除测量工具"></i>
              </li>
             
          </ul>
      <!-- pm2.5统计数据 -->
      <el-aside class="conentaside" v-if="ruse.pm25">
        <PmtwoTj ref="PmtwoTj" @closeClick="closeClick" :pretime='pretime'/>
      </el-aside>
      <!-- pm10统计数据 -->
      <el-aside class="conentaside" v-if="ruse.PM10">
        <PmtenTj ref="PmtenTj" @closeClick="closeClick"  :pretime='pretime' />
      </el-aside>

      <!-- 火点统计数据 -->
      <el-aside class="conentaside" v-if="ruse.fire">
        <FireTj ref="FireTj" @closeClick="closeClick" />
      </el-aside>

      <!-- 地面站点统计数据 -->
      <el-aside class="conentaside" v-if="ruse.floor">
        <FloorTj
          ref="FloorTj"
          :first="first"
          :list="list"
          @getmap="getmap"
          @closeClick="closeClick"
        />
      </el-aside>

      <!-- 裸地统计数据 -->
      <el-aside class="conentaside" v-if="ruse.bare">
        <BareTj ref="BareTj" :baredata="baredata" @getmap="getmap" @closeClick="closeClick" />
      </el-aside>

      <el-aside
        style="top: 11%"
        width="auto"
        class="timeaside"
        :class="[ruse.hotspot || ruse.pm25 || ruse.PM10 || ruse.fire || ruse.floor || ruse.bare ? 'istiemside' : 'notiemside']"
      >
        <div class="timesideconde">
          <div class="timelist"></div>当前数据时间：
          <span style="padding-right:10px">{{pretime}}</span>
        </div>
      </el-aside>
      <el-main>
        <mapView :container="mapContainer" :baseMapName="mapBaseName" ref="mapview" />
        <div id="popupes" :class="ispop ? 'ol-popupered' : 'ol-popupers'" v-show="popupshow">
          <div
            style="height:40px;width:100%;background: rgba(3, 38, 66, 0.9);border-top-left-radius: 10px;border-top-right-radius: 10px;line-height:30px;display:flex;justify-content: space-between;align-items: center;"
          >
            <span style="font-size:18px;margin-left:10px;color:#fff">{{headername}}</span>

            <i class="el-icon-close close-btn ol-popup-closers headclose" id="popup-closers"></i>
          </div>
          <div id="popup-contentding" class="popup-content" v-show="ispop"></div>
          <div class="popup-contented" id="popup-contentded" v-show="!ispop"></div>
        </div>
        <mapBar />
        <div
          id="serverLegend"
          style="width:30%;height:46px"
          :class="[ruse.pm25 || ruse.PM10 || ruse.fire || ruse.floor  ? 'istiemside' : 'notiemside']"
        >
          <ul style="height:100%;width:100%">
            <li style="height:100%;width:100%" v-if="lastrow=='pm25'">
              <div class="backypm"></div>
              <table class="backtable" style="width: 100%;">
                <tbody>
                  <tr style="white-space: nowrap；display:flex">
                    <td class="backtabletd" v-for="(item,index) in listtable" :key="index">{{item}}</td>
                  </tr>
                </tbody>
              </table>
            </li>
            <li style="height:100%;width:100%" v-if="lastrow=='PM10'">
              <div class="backypm"></div>
              <table class="backtable" style="width: 100%;">
                <tbody>
                  <tr style="white-space: nowrap；display:flex">
                    <td class="backtabletd" v-for="(item,index) in listtable" :key="index">{{item}}</td>
                  </tr>
                </tbody>
              </table>
            </li>
            <li style="height:100%;width:100%" v-if="lastrow=='floor'">
              <div class="backypm"></div>
              <table class="backtable" style="width: 100%;">
                <tbody>
                  <tr style="white-space: nowrap；display:flex">
                    <td class="backtabletd" v-for="(item,index) in listtable" :key="index">{{item}}</td>
                  </tr>
                </tbody>
              </table>
            </li>
          </ul>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import mapView from "@/components/map/mapInstance";
import mapBar from "@/components/map/mapToolBar";
import mapUtil from "@/utils/map";
import BigscreenMenu from "./commend/BigscreenMenu";
import BigscreenHeaderleft from "./commend/BigscreenHeaderleft";
import BigscreenHeaderright from "./commend/BigscreenHeaderright";
import Headeruser from "./commend/Headeruser";
import HotspotTj from "./commend/HotspotTj";
import PmtwoTj from "./commend/PmtwoTj";
import FireTj from "./commend/FireTj";
import FloorTj from "./commend/FloorTj";
import PmtenTj from "./commend/PmtenTj";
import BareTj from "./commend/BareTj";
import "ol/ol.css";
import { Map, View, Feature } from "ol";
import TileLayer from "ol/layer/Tile";
import Vector from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import TileWMS from "ol/source/TileWMS";
import VectorSource from "ol/source/Vector";
import ImageWMS from "ol/source/ImageWMS";
import { Projection, fromLonLat, transform, get } from "ol/proj";
import Zoom from "ol/control/Zoom";
import Circle from "ol/geom/Circle";
import { Style, Fill, Stroke, Icon } from "ol/style";
import { Point, Polygon, LineString } from "ol/geom";
import Overlay from "ol/Overlay";
import axios from "axios";
import { toStringHDMS } from "ol/coordinate";
import { toLonLat } from "ol/proj";
import Measure from "@/utils/Measure";
import geojson from '../../../../public/data/geo.json'

import {
  getpie,
  gethotspotMap,
  getgridTypeList,
  getcounty,
  getStatistic,
  getselectPoint,
  getselectPm,
  getbareDate,

} from "@/api/bigscreen/bigscreen.js";
export default {
  name: "bigscreen",
  data() {
    return {
      listtable: ["优", "良", "轻度", "中度", "重度", "严重"],
      activefeact:null,
      //地图初始化id
      mapContainer: "bigScreen",
      //地图底图
      mapBaseName: "img",
      isshow: false,
      ruse: {
        hotspot: true,
        pm25: false,
        PM10: false,
        fire: false,
        floor: false,
        bare: false
      },
      iconactive:false,
      rowtextI: "",
      lastrow: "",
      pretime: "",
      first: [],
      list: [],
      currentCoordinate: null,
      overlay: null,
      mapEventKey: null,
      headername: "",
      featurename: "",
      popupshow: false,
      lastfeature: null,
      baredata: [],
      hottime: "",
      ispop: true
    };
  },
  components: {
    mapView,
    mapBar,
    BigscreenMenu,
    BigscreenHeaderleft,
    BigscreenHeaderright,
    Headeruser,
    HotspotTj,
    PmtwoTj,
    FireTj,
    FloorTj,
    PmtenTj,
    BareTj
  },
  watch: {
    lastrow: function(val, oldval) {
      mapUtil.clearLayer(oldval); //清除地图数据
    }
  },
  mounted() {
    let obj = {
      text: "hotspot",
      type: "",
      resourcesTypeID: "1",
      tes: "HOTPOINT"
    };

    //获取最新数据时间
    this.$nextTick(() => {
      //初始化地图容器高度
      this.mapContainerSize();
      //当浏览器改变时,改变地图容器高度
      window.addEventListener("resize", this.mapContainerSize);
      this.$refs.BigscreenMenu.addClass(obj);
      this.vectorPointerMove();
      // let jsons = require('')
      // mapUtil.createGeojson(geojson)
        // let a = mapUtil.createGeojson(geojson);
        // //  a[0].attribute= e
        //  let styleObj = {
        //       circle: "",
        //       fill: "rgba(245,220,8,0.7)",
        //       stroke: "rgba(255, 0, 0)",
        //       line: 1
        //     };
        //  a.name='bare'
        //  mapUtil.createLayer(a,'bare',10,styleObj,'Geojson');
    });
  },
  beforeDestroy() {
    // 页面一关闭，销毁监听事件
    window.removeEventListener("resize", this.mapContainerSize);
  },
  methods: {
    closeClick(str) {
      this.ruse[str] = !this.ruse[str];
    },
    //遍历裸地的点
    forbareData(item) {
      let poinarr = [];
      for (var i = 0; i < item.length; i++) {
        let poin = [String(item[i][0]), String(item[i][1])];
        poinarr.push(poin);
      }
      return poinarr;
    },
    //获取热点网格的最新数据时间
    getpreData(par, row) {
      this.pretime = "";
      let me = this;
      getpie(par).then(response => {
        if (response.msg == "success") {
          mapUtil.removeControl()
          // me.deleteOverlay()
          if (row.text == "hotspot") {
           
            me.pretime = response.data[0].HOTPOINT.substring(0,10);
            me.hottime = response.data[0].HOTPOINT;
            if (me.ruse.hotspot == true) {
              me.$refs.HotspotTj.getgridTypeListData(response.data[0].HOTPOINT);
              me.$refs.HotspotTj.getcountyData(response.data[0].HOTPOINT);
              me.$refs.HotspotTj.getpieData(response.data[0].HOTPOINT)
            }
            // me.addScaleLine()
            me.gethotspotMapData(response.data[0].HOTPOINT); //获取热点网格的地图数据
          } else if (row.text == "pm25") {
            me.pretime = response.data[0].PM25.substring(0,10)
            let par = {
              pmType: "B",
              areaId: "130100",
              level: "2",
              newTime: response.data[0].PM25
            };
            if (me.ruse.pm25 == true) {
              me.$refs.PmtwoTj.getselectPmData(par);
            }
          } else if (row.text == "PM10") {
            me.pretime = response.data[0].PM10.substring(0,10);
            let par = {
              pmType: "A",
              areaId: "130100",
              level: "2",
              newTime: response.data[0].PM25
            };
            if (me.ruse.PM10 == true) {
              me.$refs.PmtenTj.getselectPmData(par);
            }
          } else if (row.text == "fire") {
            me.pretime = response.data[0].FIREPOINT.substring(0,10);
            me.getStatisticData(response.data[0].FIREPOINT);
            me.$refs.FireTj.getFireTjdata(response.data[0].FIREPOINT);
          } else if (row.text == "floor") {
            me.pretime = response.data[0].POINT.substring(0,10);
            me.getgetselectPoint(response.data[0].POINT);
          // }
          } else if (row.text == "bare") {
            let mouthnum = Number(response.data[0].BARELAND.substring(5,7))
           
             me.pretime = this.getdatajidu(Number(mouthnum))
            me.getbare(response.data[0].BARELAND)
          }
        } else if (response.code == "500" || response.data == null) {
          me.pretime = "暂无获得最新数据时间";
        }
      });
    },
     getdatajidu(month){
       if(month  <= 3) {
            return '第一季度';
         }else if(month <= 6) {
           return '第二季度';
          }else if(month <= 9) {
             return '第三季度';
         }else if(month <= 12) {
             return '第四季度';
         }
    },
    // 获取裸地的数据
    getbare(data){
     let par = {
        newTime: data
      };
      let me = this
      getbareDate(par).then(res=>{
        if(res.msg=='操作成功'){
        for(var i = 0;i<res.data.q10.length;i++){
          res.data.q10[i].areaed=me.getPointNum(res.data.q10[i].area,2)
          res.data.q10[i].newname=res.data.q10[i].name
        }
        me.baredata=res.data.q10
        me.$refs.BareTj.getbarepietop(res.data.ks)
        me.$refs.BareTj.getPieData(res.data.mj)
        me.baremaprander(res.data.maps)
        }
     
      })
    },
    baremaprander(data){
      let me = this;
      var linearr = [];
      let voctor = null
       data.forEach(function(e, index) {
         let shape=JSON.parse(e.shape)
         if(shape.type == 'Polygon'){
              let parefe = mapUtil.createFeature("polygon","bare",shape.coordinates,'');
              parefe.attribute = e;
              linearr.push(parefe);
              }else{
                let geoJson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": shape.coordinates
                    }
                }
            ]
        };
           let styleObj = {
              circle: "",
              fill: "rgba(245,220,8,0.7)",
              stroke: "rgba(255, 0, 0)",
              line: 1
            };
         let a = mapUtil.createGeojson(geoJson);
         a[0].attribute= e
         a[0].name='bare'
         mapUtil.createLayer(a,'bare',10,styleObj,'Geojson');
              }
            });
            let obj = {
              circle: "",
              fill: "rgba(245,220,8,0.7)",
              stroke: "rgba(255, 0, 0)",
              line: 1
            };
            me.mapBindClick();
            mapUtil.createLayer(linearr, "bare", 100, obj);
           
    },
    addScaleLine(){
      mapUtil.addScaleLine()
    },
    // 获取热点网格的地图数据
    gethotspotMapData(pretime) {
      let par = {
        dataTime: pretime
      };
      let me = this;
      gethotspotMap(par).then(response => {
        if (response.msg == "success" && response.data.length > 0) {
          var newarr = [];
          var linearr = [];
          var resdata = response.data;
          resdata.forEach(function(e, index) {
            let lined = null;
            e.index = index;
            e.point = [e];
            newarr.push(e.point);
          });
          var arr = me.getlonloat(newarr);
          for (var i = 0; i < arr.length; i++) {
            let arrs = [];
            arrs.push(arr[i]["0"]);
            let line = mapUtil.createhoutFeature("polygon", "hotspot", arrs);
            line.attribute = arr[i][1];
            linearr.push(line);
          }
          let obj = {
            circle: "",
            fill: "rgba(255, 0, 0, 0.7)",
            stroke: "#ffffff",
            line: 1
          };
          this.mapBindClick();
          mapUtil.createLayer(linearr, "hotspot", 100, obj);
        }
      });
    },
    // 左侧菜单的切换，显示相对应的统计组件
    treeClick(row) {
      if (this.lastrow == row.text) {
        let red = row.text;
        this.ruse[red] = !this.ruse[red];
        this.lastrow = row.text;
        //  mapUtil.clearLayer(this.lastrow); //清除地图数据
      } else {
        this.isshow = true;
        let red = row.text;
        this.featurename = row.text;
        if (this.overlay !== null) {
          var popupCloser = document.getElementById("popup-closers");
          this.overlay.setPosition(undefined);
          popupCloser.blur();
          mapUtil.restoreView();
          this.overlay = null;
        }
        mapUtil.clearLayer(this.lastrow); //清除地图数据
        if(row.text == 'PM10' || row.text == 'pm25'){
          mapUtil.PmrestoreView(7);
        }else{
          mapUtil.restoreView();
        }
        this.ruse[red] = !this.ruse[red];
        for (var key in this.ruse) {
          if (this.ruse[key] == true) {
            this.ruse[key] = !this.ruse[key];
          }
          if (key == row.text) {
            this.ruse[key] = !this.ruse[key];
          }
        }
        this.lastrow = row.text;
      }
      let par = {
        areaId: "130100"
      };

      this.getpreData(par, row);
    },
    //容器尺寸
    mapContainerSize() {
      //获取导航高度
      mapUtil.setMapHeight(0);
    },
    //   获取火点数据
    getStatisticData(time) {
      let par = {
        areaId: "130100",
        newTime: time
      };
      let me = this;
      getStatistic(par).then(response => {
        let chartData = [];
        let poointarr = [];
        let pointarr = [];
        if (response.data["mapPoint"].length > 0) {
          var mapdata = response.data.mapPoint;
          mapdata.forEach(e => {
            e.point = [Number(e.LON), Number(e.LAT)];
            let point = mapUtil.createFeature("point", "fire", e.point);
            point.attribute = e;
            pointarr.push(point);
          });
          me.mapBindClick();
          mapUtil.createLayer(pointarr, "fire", 100);
        }
      });
    },
    //获取站点数据
    getgetselectPoint(time) {
      let ser = {
        areaId: "130100",
        newTime: time
      };
      let me = this;
      getselectPoint(ser).then(response => {
      
        let newarr = [];
        let pointarr = [];
        if (
          (response.msg == "操作成功" && response.data["first"].length > 0) ||
          response.data["last"].length > 0 ||
          response.data["mapPoint"].length > 0 ||
          response.data["pie"].length > 0
        ) {
          if (me.ruse.floor == true) {
            me.$refs.FloorTj.getPieData(response.data["pie"]);
          }

          me.first = response.data["first"];
          me.list = response.data["last"];
          var resdata = response.data["mapPoint"];
          resdata.forEach(e => {
            let colorstyle = "";
            colorstyle = me.aqiColor(e.AQI);
            e.point = [[Number(e.LON), Number(e.LAT)]];
            let point = mapUtil.createFeature("point", "floor", e.point["0"]);
            point.attribute = e;
            let styleObj = {
              circle: colorstyle,
              stroke: "",
              fill: ""
            };
            point.setStyle(mapUtil.setStyle(styleObj));
            newarr.push(point);
          });
          mapUtil.createLayer(newarr, "floor", 100);
          me.mapBindClick();
        }
      });
    },
    // 生成坐标算法
    getlonloat(data) {
      var recoArr = [];
      var arrall = data;
      for (var i = 0; i < arrall.length; i++) {
        if (
          arrall[i][0].rtPoint != null ||
          arrall[i][0].ltPoint != null ||
          arrall[i][0].rbPoint != null ||
          arrall[i][0].lbPoint != null
        ) {
          let lt = arrall[i][0].ltPoint.split(",");
          let rt = arrall[i][0].rtPoint.split(",");
          let rb = arrall[i][0].rbPoint.split(",");
          let lb = arrall[i][0].lbPoint.split(",");
          let conarr = [lt, rt,  rb, lb,lt];
          var newArr = [conarr, data[i][0]];
          recoArr.push(newArr);
        }
      }
      return recoArr;
    },
    //AQI分段区间
    aqiColor: function(aqi) {
      if (aqi >= 0) {
        if (aqi >= 0 && aqi <= 50) {
          return "#00E400";
        } else if (aqi > 50 && aqi <= 100) {
          return "#FFFF00";
        } else if (aqi > 100 && aqi <= 150) {
          return "#FF7E00";
        } else if (aqi > 150 && aqi <= 200) {
          return "#FF0000";
        } else if (aqi > 200 && aqi <= 300) {
          return "#99004C";
        } else if (aqi > 300) {
          return "#7E0023";
        }
      }
    },
    //地图点击事件
    mapBindClick() {
      let me = this;
      let map = me.$refs.mapview.mapInstance;
      if (!me.mapEventKey) {
        me.mapEventKey = map.on("singleclick", function(evt) {
          let feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature;
          });
          if (feature) {
            me.activefeact = null
            me.activefeact =feature
            let name = feature.name;
            let attribute = feature.attribute;
            let coordinates = [];
            if (me.lastfeature != null) {
              let obj = {
                circle: "",
                fill: "rgba(255, 0, 0, 0.7)",
                stroke: "#ffffff",
                line: 1
              };
              me.lastfeature.setStyle(mapUtil.setStyle(obj));
              me.lastfeature = null;
            }
            if (name == "hotspot") {
              coordinates =  [attribute.longitude, attribute.latitude]
              let styleObj = {
                circle: "",
                stroke: "#00FFFF",
                fill: "rgba(97,166,156,0.8)"
              };
              feature.setStyle(mapUtil.setStyle(styleObj));
              me.lastfeature = feature;
            } else if (name == "bare") {
              coordinates = transform(
                [attribute.lon, attribute.lat],
                "EPSG:4326",
                "EPSG:3857"
              );
            } else if (name == "floor") {
              me.$refs.FloorTj.closeActive();
              coordinates = feature.getGeometry().getCoordinates();
            } else {
              coordinates = feature.getGeometry().getCoordinates();
            }
            if (
              feature.name == me.featurename &&
              feature.attribute != undefined
            ) {
              me.eventreSourcesEx(name, attribute, coordinates, feature);
            }
          }
        });
      }
    },
    //地图改变鼠标光标为小手
    vectorPointerMove() {
      let that = this;
      let map = that.$refs.mapview.mapInstance;
      map.on("pointermove", function(evt) {
        let feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
          return feature;
        });
        if (feature) {
          if (feature.name != "boundaryFeature") {
            map.getTargetElement().style.cursor = "pointer";
          } else {
            map.getTargetElement().style.cursor = "";
          }
        } else {
          map.getTargetElement().style.cursor = "";
        }
      });
    },
    // 弹出框的内容模板
    eventreSourcesEx(name, data, coodinate, feature) {
      let that = this;
      let loc = [];
       let contentpanel = null;
      if (name == "hotspot") {
        loc = [data.longitude, data.latitude]
      } else if (name == "bare") {
        loc = transform(
          [data.lon, data.lat],
          "EPSG:4326",
          "EPSG:3857"
        );
        data.area = that.getPointNum(data.area, 2);
      } else {
        loc = transform([data.LON, data.LAT], "EPSG:4326", "EPSG:3857"); //转化成3857墨卡托坐标
      }
      var container = document.getElementById("popupes");
     
      let popcontent = ``;
      var popupCloser = document.getElementById("popup-closers");
      if (name == "floor") {
        contentpanel = document.getElementById("popup-contentded");
        that.ispop = false;
      } else {
        contentpanel = document.getElementById("popup-contentding");
        that.ispop = true;
      }
      that.popupshow = true;
      if (name == "fire") {
        this.headername = "火点信息";
        popcontent =
          "<ul class='table-content' style='width:100%;border:1px solid  #2e8aaf;border-bottom:none'>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>地点</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.AREANAME +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>时间</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.FIREDATE +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>经度</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.LON +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>纬度</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.LAT +
          "</span>" +
          "</li>";
      } else if (name == "floor") {
        this.headername = "站点信息";
        popcontent =
          "<ul class='table-content' style='width:100%;border:1px solid  #2e8aaf;border-bottom:none;display: flex;flex-wrap: wrap;border-left:none'>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>站点区域</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.AREANAME +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>站点名称</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.POINTNAME +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>AQI</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.AQI +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>时间</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.MONITORTIME +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>PM2.5</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.PM25 +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>PM10</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.PM10 +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>经度</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.LON +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>纬度</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.LAT +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>NO2</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.NO2 +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>CO</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.CO +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>O3</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.O3 +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>SO2</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.SO2 +
          "</span>" +
          "</li>";
      } else if (name == "hotspot") {
        this.headername = data.num + "号热点网格信息";
        popcontent =
          "<ul class='table-content' style='width:100%;border:1px solid  #2e8aaf;border-bottom:none'>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>地点</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.areaName +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>企业数量</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.enterprseNum +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>经度</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.longitude +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>纬度</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.latitude +
          "</span>" +
          "</li>";
      } else if (name == "bare") {
        this.headername = "裸地信息";
        popcontent =
          "<ul class='table-content' style='width:100%;border:1px solid  #2e8aaf;border-bottom:none'>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>地点</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.name +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>裸地面积(m²)</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.area +
          "</span>" +
          "</li>";
      }
      popcontent += "</ul>";
      that.overlay = new Overlay({
        element: container, //绑定 Overlay 对象和 DOM 对象的
        autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
        autoPanAnimation: {
          duration: 250 //自动平移效果的动画时间 9毫秒）
        }
      });

      //设置弹出框内容，可以HTML自定义
      
      contentpanel.innerHTML = popcontent;
      //设置overlay的显示位置
      that.overlay.setPosition(coodinate);

      //显示overlay
      that.$refs.mapview.mapInstance.addOverlay(that.overlay);
      that.$refs.mapview.mapInstance.getView().animate({
        center: loc,
        minZoom: 4,
        maxZoom: 18,
        zoom: 10.5,
        duration: 1000
      });
      that.clearcloser(popupCloser, feature);
    },
    // 清除弹出框
    clearcloser(popupCloser, feature) {
      let that = this;
      if (popupCloser) {
        popupCloser.onclick = function() {
          if (feature.name == "hotspot") {
            let obj = {
              circle: "",
              fill: "rgba(255, 0, 0, 0.7)",
              stroke: "#ffffff",
              line: 1
            };
            feature.setStyle(mapUtil.setStyle(obj));
            that.overlay.setPosition(undefined);
            popupCloser.blur();
            mapUtil.restoreView();
            return false;
          } else if (feature.name == "bare") {
            that.overlay.setPosition(undefined);
            popupCloser.blur();
            mapUtil.restoreView();
            that.$refs.BareTj.closeActive();
            return false;
          } else if (feature.name == "floor") {
            that.overlay.setPosition(undefined);
            popupCloser.blur();
            mapUtil.restoreView();
            that.$refs.FloorTj.closeActive();
            return false;
          } else {
            that.overlay.setPosition(undefined);
            popupCloser.blur();
            mapUtil.restoreView();
            return false;
          }
        };
      }
    },
    getmap(data) {
      let loc = [];
      let that = this;
      let coordinates = [];
      let name = data.name;
      let contentpanel = null;
      var container = document.getElementById("popupes");
      if (name == "floor") {
        contentpanel = document.getElementById("popup-contentded");
        that.ispop = false;
      } else {
        contentpanel = document.getElementById("popup-contentding");
        that.ispop = true;
      }

      let popcontent = ``;
      var popupCloser = document.getElementById("popup-closers");
      if (that.overlay !== null) {
        that.overlay.setPosition(undefined);
        popupCloser.blur();
        that.overlay = null;
      }
      that.popupshow = true;
      if (name == "bare") {
        loc = transform(
          [data.lon, data.lat],
          "EPSG:4326",
          "EPSG:3857"
        );
        let area = that.getPointNum(data.area, 2);
        that.headername = "裸地信息";
        popcontent = popcontent =
          "<ul class='table-content' style='width:100%;border:1px solid  #2e8aaf;border-bottom:none'>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>地点</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.county +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>裸地面积(m²)</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          area +
          "</span>" +
          "</li>";
      } else if ((name = "floor")) {
        loc = transform([data.LON, data.LAT], "EPSG:4326", "EPSG:3857");
        this.headername = "站点信息";
        popcontent =
          "<ul class='table-content' style='width:100%;border:1px solid  #2e8aaf;border-bottom:none;display: flex;flex-wrap: wrap;border-left:none'>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>站点区域</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.AREANAME +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>站点名称</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.POINTNAME +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>AQI</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.AQI +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>时间</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.MONITORTIME +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>PM2.5</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.PM25 +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>PM10</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.PM10 +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>经度</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.LON +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>纬度</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.LAT +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>NO2</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.NO2 +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>CO</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.CO +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>O3</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.O3 +
          "</span>" +
          "</li>" +
          "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
          "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;'>SO2</span>" +
          "<span style='color:#ade909;font-size: 16px;width:70%'>" +
          data.SO2 +
          "</span>" +
          "</li>";
      }
      popcontent += "</ul>";
      that.overlay = new Overlay({
        element: container, //绑定 Overlay 对象和 DOM 对象的
        autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
        autoPanAnimation: {
          duration: 250 //自动平移效果的动画时间 9毫秒）
        }
      });
      //设置弹出框内容，可以HTML自定义
      contentpanel.innerHTML = popcontent;

      //设置overlay的显示位置
      that.overlay.setPosition(loc);
      that.$refs.mapview.mapInstance.addOverlay(that.overlay);
      that.$refs.mapview.mapInstance.getView().animate({
        center: loc,
        minZoom: 4,
        maxZoom: 18,
        zoom: 10.5,
        duration: 1000
      });
      that.listclearcloser(popupCloser, name);
    },
    listclearcloser(popupCloser, name) {
      let that = this;
      if (popupCloser) {
        popupCloser.onclick = function() {
          if (name == "bare") {
            that.overlay.setPosition(undefined);
            popupCloser.blur();
            that.$refs.BareTj.cleardata();
            that.$refs.BareTj.closeActive()
            return false;
          } else {
            that.overlay.setPosition(undefined);
            popupCloser.blur();
            mapUtil.restoreView();
            that.$refs.FloorTj.closeActive();
            return false;
          }
        };
      }
    },
    //保留小数点后几位的方法
    getPointNum(num, n) {
      let str = String(num);
      let index = str.indexOf(".");
      if (index == -1) {
        return num;
      } else {
        let str1 = str.substring(0, index + n + 1);
        str1 = Number(str1);
        return str1;
      }
    },
    addPoint(){
      this.iconactive = true
       let type = 'LineString'
        if(this.overlay){
           this.overlay.setPosition(undefined);
        }
        let obj = {
            circle: "",
            fill: "rgba(255, 0, 0, 0.7)",
            stroke: "#ffffff",
            line: 1
          };
        if(this.lastfeature){
          this.lastfeature.setStyle(mapUtil.setStyle(obj));
        }
        Measure.removrhelpTooltip(this.$refs.mapview.mapInstance)
        Measure.measure(this.$refs.mapview.mapInstance, type);
    },
      // 删除测量痕迹
    deleteOverlay(){
     if(this.overlay){
           this.overlay.setPosition(undefined);
        }
         let obj = {
            circle: "",
            fill: "rgba(255, 0, 0, 0.7)",
            stroke: "#ffffff",
            line: 1
          };
        if(this.lastfeature){
          this.lastfeature.setStyle(mapUtil.setStyle(obj));
        }
       
      this.iconactive = false
      Measure.removrhelpTooltip(this.$refs.mapview.mapInstance)
    }
  }
};
</script>

<style scoped>
.el-header {
  color: #333;
  text-align: center;
  background-image: url("../../../assets/bigscreen/bigheader.png");
  /* background-color: rgba(123, 12, 33, 0.4); */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 99;
  display: flex;
  justify-content: space-between;
  padding: 0;
}

.el-aside {
  text-align: center;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 10%;
  z-index: 99;
  overflow: hidden;
  border-radius: 0;
}
.treeaside {
  /* background-color: rgba(255,255,255, 0.95); */
  /* color: #333; */
  left: 0;
  height: 100%;
  width: 3% !important;
}

.backgret {
  background-image: url("../../../assets/bigscreen/left_bg.png");
  background-size: 100%;
}
.conentaside {
  left: 3%;
  border: 1px solid #047ba9;
  background: none;
  height: 100%;
  border-top: none;
  width: 20% !important;
}
.timeaside {
  height: 5%;
  background: none;
}
.istiemside {
  left: 23.5%;
}
.aside-slect {
  right: 5%;
  background: none;
  top: 11%;
}
.notiemside {
  left: 3.5%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
  padding: 0;
  overflow: hidden;
}

body > .el-container {
  margin-bottom: 40px;
  position: relative;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.containers {
  position: relative;
}
.headeruser {
  position: absolute;
  right: 0.8%;
  top: 20%;
}
.timesideconde {
  font-size: 20px;
  color: #fff;
  height: 100%;
  display: flex;
  align-items: center;
  background: rgba(6, 37, 65, 0.8);
  border-radius: 5px;
}
.cepositon{
  position: fixed;
  top: 12%;
  right: 20px;
  z-index: 99;
  display:flex;
  /* box-shadow: 0px 0px 20px rgb(11 99 160) inset; */
  padding: 5px 10px;
  /* background: rgba(4, 31, 51, 0.95); */
  justify-content: space-between;
}
.cepositon li{
  cursor: pointer;
  padding: 5px;
    width: 32px;
    height: 32px;
    background-color: rgba(202, 205, 201, 0.75);
    border: #cacdc9 1px solid;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 1px #888888;
    font-size: 24px;
    margin-right: 10px;
    color: #35596B;
}
.cepositon li:hover{
  color: #01AAF0;
}
.cepositon .isactivericon{
  color: #CB391E;
}
.timelist {
  height: 60%;
  width: 5px;
  background: #218fbd;
  margin-right: 10px;
}
.ol-popupers {
  position: absolute;
  background-color: rgba(16, 27, 38, 0.95) !important;
  border-radius: 10px;
  border: 0px;
  bottom: 20px;
  left: -245px;
}
.ol-popupered {
  position: absolute;
  background-color: rgba(16, 27, 38, 0.95) !important;
  border-radius: 10px;
  border: 0px;
  bottom: 20px;
  left: -195px;
}
.title-info {
  text-align: left;
  padding: 10px 15px;
  background: rgba(9, 69, 64, 0.9);
  color: #fff;
  height: auto;
}

.icon-title {
  width: 4px;
  height: 16px;
  display: inline-block;
  background: #20c8b3;
  float: left;
  margin: 3px 7px 0px 0px;
}
.ol-popupered >>> p {
  text-align: left;
  padding-bottom: 10px;
}
.ol-popupers >>> p {
  text-align: left;
  padding-bottom: 10px;
}
.ol-popupered :after,
.ol-popupered:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popupers:after,
.ol-popupers:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popupered:after {
  border-top-color: rgba(0, 0, 0, 0.4);
  border-width: 10px;
  left: 50%;
  margin-left: -10px;
}
.ol-popupers:after {
  border-top-color: rgba(0, 0, 0, 0.4);
  border-width: 10px;
  left: 50%;
  margin-left: -10px;
}
.ol-popupered:before {
  border-top-color: rgba(0, 0, 0, 0.4);
  border-width: 11px;
  left: 50%;
  margin-left: -11px;
}
.ol-popupers:before {
  border-top-color: rgba(0, 0, 0, 0.4);
  border-width: 11px;
  left: 50%;
  margin-left: -11px;
}

.ol-popup-closers {
  text-decoration: none;
  margin-right: 8px;
  font-size: 24px;
  cursor: pointer;
}

.popup-content {
  width: 390px;
  /* height: 322px; */
  overflow-y: auto;
  padding: 0 10px 10px 10px;
  margin-top: 10px;
}
.popup-contented {
  width: 490px;
  overflow-y: auto;
  padding: 0 10px 10px 10px;
  margin-top: 10px;
}
#serverLegend {
  z-index: 1;
  position: absolute;
  bottom: 1%;
  width: 35%;
}

#serverLegend ul li {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  line-height: 0;
}

#serverLegend >>> ul li div {
  /* float: left;
  width: 40px; */
  height: 20px;
  width: 100%;
  /* margin-right: 15px; */
}
.lendistiemside {
  left: 23%;
}
.lendnotiemside {
  left: 14%;
}
.headclose {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}
.headclose:hover {
  color: #f31a08;
  font-size: 22px;
  font-weight: bolder;
}
.backypm {
  display: inline-block;
  width: 100%;
  height: 8px;
  margin-bottom: -5px;
  background: -moz-linear-gradient(
    left,
    #43ce17 15%,
    #e1d72c 22%,
    #f72d0e 75%,
    #a7134c 90%
  );
  background: -webkit-gradient(
    linear,
    left,
    right,
    color-stop(15%, #43ce17),
    color-stop(22%, #e1d72c),
    color-stop(75%, #f72d0e),
    color-stop(90%, #a7134c)
  );
  background: -webkit-linear-gradient(
    left,
    #43ce17 15%,
    #e1d72c 22%,
    #f72d0e 75%,
    #a7134c 90%
  );
  background: -o-linear-gradient(
    left,
    #43ce17 15%,
    #e1d72c 22%,
    #f72d0e 75%,
    #a7134c 90%
  );
  background: -ms-linear-gradient(
    left,
    #43ce17 15%,
    #e1d72c 22%,
    #f72d0e 75%,
    #a7134c 90%
  );
  background: linear-gradient(
    to right,
    left,
    #43ce17 15%,
    #e1d72c 22%,
    #f72d0e 75%,
    #a7134c 90%
  );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#43ce17', endColorstr='#a7134',GradientType=0 );
}
:root .backypm {
  filter: none;
}
.backtable {
  color: #fff;
  font-size: 12px;
  border-collapse: collapse;
  border-spacing: 0;
  z-index: 1001;
  background: rgba(51, 51, 51, 0.55);
}
.backtabletd {
  display: inline-block;
  width: 16%;
  height: 24px;
  text-align: center;
  vertical-align: middle;
  line-height: 20px;
}
/* @media screen and (max-width: 1600px) {
  .sys-time {
    font-size: 28px;
  }
} */
@media screen and (max-width: 1366px) {
  .headerspan {
    font-size: 14px;
  }
  .el-header {
    width: 1920px;
  }
  .conentaside {
    left: 3.5%;
    width: 25% !important;
  }
  #bigcontainer {
    width: 1920px !important;
  }
  .treeaside {
    width: 3.5% !important;
  }
  .istiemside {
    left: 29.8%;
  }
}
@media screen and (max-width: 1680px) {
  .headerspan {
    font-size: 14px;
  }
  .el-header {
    width: 1920px;
  }
  .conentaside {
    left: 3.5%;
    width: 25% !important;
  }
  #bigcontainer {
    width: 1920px !important;
  }
  .treeaside {
    width: 3.5% !important;
  }
  .istiemside {
    left: 29.3%;
  }
}
</style>
<style>
.tooltip-static{
  height: 40px;
  background: rgba(0, 0, 0, 0.4);
  color: #20c8b3;
  padding:5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
}
</style>