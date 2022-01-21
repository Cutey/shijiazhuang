<template>
    <el-container class="newbigscreen-warp" id="bigcontainer">
        <!-- 头部 -->
        <el-header style="height: 10%" class="navbar">
            <BigscreenHeaderright />
            <BigscreenHeaderleft />
            <Headeruser class="headeruser" />
        </el-header>
        
        <!-- 指标项切换 -->
        <div class="navtrere">
            <el-menu :default-active="activeBtn" class="el-menu-demo" mode="horizontal" @select="btnclick">
                <el-submenu index="houstwg">
                    <template slot="title" style="color:#fff">{{hotpointtitle}}</template>
                    <el-menu-item  v-for="(item) in redianchilddata" :key="item.text" :index='item.text'>{{item.tex}}</el-menu-item>
                </el-submenu>
            </el-menu>
            <el-button v-for="(item,index) in treedata" :class="{'active-btn':activeBtn===item.text}" :key="index" class="elbutton" @click="btnclick(item.text)">
                <i></i>
                <span>{{item.tex}}</span>
            </el-button>
        </div>
        <!-- 时间类型切换 -->
        <div class="swichtype" v-if="activeBtn=='rdwgNO2' || activeBtn=='rdwgPM25'">
            <span style="color:#F87F1E;font-weight: bolder;font-size: 18px">{{timevalue}}</span>
            <el-switch
                v-model="timetype"
                active-color="#13ce66"
                @change='timetypechange'
                inactive-color="#ff4949">
            </el-switch>
        </div>

        <transition name='slide-fade'>
            <div class="newbigcreen-left" v-show="showleft">
                <floorTj  ref="FloorTj" :first="first" :list="list" @getmap="getmap" @closeClick="closeClick" v-if="activeBtn =='floor'" />
                <Baretj ref="BareTj" :baredata='baredata' v-if="activeBtn =='bare'" @getmap="getmap" @closeClick="closeClick"/>
                <Firetj ref="Firetj" @closeClick="closeClick" v-if="activeBtn =='fire'" />
                <Pmtj ref="Pmtj" v-if="activeBtn =='PM25' || activeBtn =='PM10'" :activetitle='activetitle' @closeClick="closeClick" :pretime='pretime' />
                <HotspotTjtwo ref="HotspotTjtwo" v-if="activeBtn =='rdwgNO2' || activeBtn =='rdwgHCHO'" @closeClick="closeClick"/>
                <HotspotTjsan ref="HotspotTjsan"  v-if="activeBtn =='rdwgPM25'"  @closeClick="closeClick"/>
            </div>

          
        </transition>

         <ul class="cepositon" v-if="showswitch">
             <li >
                <i class="el-icon-s-help" @click="addPoint" :class="iconactive ? 'isactivericon' : ''" title="创建测量工具"></i>
              </li>
              <li>
                <i class="el-icon-delete-solid" @click="deleteOverlay" title="清除测量工具"></i>
              </li>
             
          </ul>

        <!-- 左侧统计图的显示隐藏控制按钮 -->
        <div class="btnright" v-if="!showleft">
                <span class="icon-list" @click="showleftshow">
                    <i class="el-icon-s-unfold"></i>
                </span>
        </div>
      
      <el-aside
        style=""
        width="auto"
        class="timeaside"
        :class="[!showleft ? 'istiemsidedsd' : 'notiemside']"
      >
        <div class="timesideconde">
          <div class="timelist"></div>当前数据时间：
          <span style="padding-right:10px">{{pretime}}</span>
        </div>
      </el-aside>
        <!-- 图例 -->
        <div
          id="serverLegend"
          style="width:30%;height:46px"
          class="istiemside"
        >
          <ul style="height:100%;width:100%">
            <li style="height:100%;width:100%" v-if="activeBtn=='PM25' || activeBtn=='PM10' || activeBtn=='floor'">
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
 

        

        <!-- 地图组建 -->
        <el-container
            style="widht:height:90%;width:100%;overflow: hidden;"
            class="containers"
        >
            <el-main style="padding: 0">
                <mapView
                    :container="mapContainer"
                    :baseMapName="mapBaseName"
                    ref="mapview"
                />
            </el-main>
            <!-- 地图按钮组建 -->
            <mapBar />

        

        <!-- 弹出框模板 -->
        <div id="popupes" :class="ispop ? 'ol-popupered' : 'ol-popupers'" v-show="popupshow">
          <div
            style="height:40px;width:100%;background: rgba(3, 38, 66, 0.9);border-top-left-radius: 10px;border-top-right-radius: 10px;line-height:30px;display:flex;justify-content: space-between;align-items: center;padding-right: 10px;"
          >
            <span style="font-size:18px;margin-left:10px;color:#fff">{{headername}}</span>

            <i class="el-icon-close close-btn ol-popup-closers headclose" id="popup-closers"></i>
          </div>
          <div id="popup-contentding" class="popup-content" v-show="ispop"></div>
          <div class="popup-contented" id="popup-contentded" v-show="!ispop"></div>
        </div>
        </el-container>
    </el-container>
</template>

<script>
import mapUtil from "@/utils/map";
import {getpie,getselectPoint,getbareDate,getStatistic,getselectPm,gethotspotMap} from "@/api/bigscreen/bigscreen.js"
import Measure from "@/utils/Measure";
import Overlay from "ol/Overlay";
import { Projection, fromLonLat, transform, get } from "ol/proj";
import "ol/ol.css";
import BigscreenHeaderleft from "../bigscreen/commend/BigscreenHeaderleft";
import BigscreenHeaderright from "../bigscreen/commend/BigscreenHeaderright";
import Headeruser from "../bigscreen/commend/Headeruser";
import mapView from "@/components/map/mapInstance";
import mapBar from "@/components/map/mapToolBar";
import floorTj from './comend/floortj.vue'
import Baretj from './comend/BareTj.vue'
import Firetj from './comend/FireTj.vue'
import Pmtj from './comend/PmTj.vue'
import HotspotTjtwo from './comend/HotspotTjtwo.vue'
import HotspotTjsan from './comend/HotspotTjsan.vue'
export default {
    data() {
        return {
            //地图初始化id
            mapContainer: "bigScreen",
            //地图底图
            mapBaseName: "img",
            activeIndex:'',//选中的指标项
            activeBtn:'',
            rdactiveBtn:'',
            lastfeature:null,
            popupshow:false,
            showswitch:false,//是否显示时间类型切换
            listtable: ["优", "良", "轻度", "中度", "重度", "严重"],
            redianchilddata:[//热点网格选中项
                        {
                            text: "rdwgPM25",
                            type: "B",
                            resourcesTypeID: "",
                            tes: "PM2.5",
                            tex: "PM2.5热点",
                        },
                        {
                            text: "rdwgNO2",
                            type: "NO2",
                            resourcesTypeID: "",
                            tes: "NO2",
                            tex: "NO2热点",
                        },
                        {
                            text: "rdwgHCHO",
                            type: "HCHO",
                            resourcesTypeID: "",
                            tes: "HCHO",
                            tex: "HCHO热点",
                        },
                        // {
                        //     text: "rdwg甲醛",
                        //     type: "B",
                        //     resourcesTypeID: "",
                        //     tes: "甲醛",
                        //     tex: "甲醛",
                        // }
                    ],
            treedata: [//指标项数据
                {
                    text: "PM25",
                    type: "B",
                    resourcesTypeID: "",
                    tes: "PM25",
                    tex: "PM2.5",
                     hasdata:false,
                    childdata:[
                        
                    ]
                },
                {
                    text: "PM10",
                    type: "A",
                    resourcesTypeID: "",
                    tes: "PM10",
                    tex: "PM10",
                    hasdata:false,
                    childdata:[
                        
                    ]
                },
                {
                    text: "fire",
                    type: "",
                    resourcesTypeID: "17",
                    tes: "FIREPOINT",
                    tex: "火点",
                    hasdata:false,
                    childdata:[
                        
                    ]
                },
                {
                    text: "floor",
                    type: "",
                    resourcesTypeID: "2",
                    tes: "POINT",
                    tex: "站点",
                    hasdata:false,
                    childdata:[
                        
                    ]
                },
                {
                    text: "bare",
                    type: "",
                    resourcesTypeID: "19",
                    tes: "BARELAND",
                    tex: "裸地",
                    hasdata:false,
                    childdata:[
                        
                    ]
                },
            ],
            timetype:true,//天和小时的判断一句
            timevalue:'天',//展示当前时间类型的字段
            timedata:null,
            layers:'',
            ispop: true,
            feature:null,
            headername:'',
            showleft:true,
            first:[],
            list:[],
            baredata:[],
            firePoint:null,
            overlay:null,
            activetitle:'PM2.5',
            pretime:'',
            iconactive:false,
            exd:[110.000002136454,33.980001879856,120.02000191249,43.0000016782433],
            hotpointtitle:'热点网格',
            houtpointpar:{
               timeType:'',
               product:'',
               dataTime:''
            }
        };
    },
    components: {
        BigscreenHeaderleft,
        BigscreenHeaderright,
        Headeruser,
        mapView,
        mapBar,
        floorTj,
        Baretj,
        Firetj,
        Pmtj,
        HotspotTjtwo,
        HotspotTjsan,
    },
    watch: {
      layers: function(val, oldval) {
        mapUtil.clearLayer(oldval); //清除地图数据
      }
    },
    mounted() {
        let par = {
            areaId: "130100"
            };
        this.getdtatime(par)
        this.$nextTick(() => {
            this.mapContainerSize();
            //当浏览器改变时,改变地图容器高度
            window.addEventListener("resize", this.mapContainerSize);
            this.vectorPointerMove()
        });
    },
    methods: {
        getdtatime(par){
            getpie(par).then((res)=>{
                if (res.msg == "success") {
                    this.timedata = res.data[0]
                    this.btnclick('rdwgPM25')
           
                
              
                }
                
            })
        },
        //容器尺寸
        mapContainerSize() {
            //获取导航高度
            mapUtil.setMapHeight(0);
        },
        //指标项切换事件
        btnclick(rowkey){
            this.activeBtn = rowkey
            this.showleft = true
            this.showswitch = !rowkey.indexOf('rdwg')
            if(!rowkey.indexOf('PM')){
              mapUtil.PmrestoreView(7);
            }else{
              mapUtil.restoreView();
            }
            let par = {
                areaId: "130100",
                    };
            if(this.overlay){ //如果弹出框在就关闭弹出框
                var popupCloser = document.getElementById("popup-closers");
                this.overlay.setPosition(undefined);
                popupCloser.blur();
            }
            if(this.firePoint){ //如果火點在就关闭弹火電
               let olLyrs = mapUtil._mapInstance.getOverlays().getArray();
                let olLyrsLength = mapUtil._mapInstance.getOverlays().getArray().length;
                    for(let i = 0;i < olLyrsLength;i++){
                         olLyrs[i].setPosition(undefined);
                    }
            }
            this.overlay = null
            this.firePoint = null
            let me = this
            var myFirstPromise = new Promise(function(resolve, reject){
                resolve(mapUtil.clearLayer(me.layers)); //代码正常执行！
              });
            myFirstPromise.then(function(successMessage){
                if(me.showswitch){//热点网格指标项
                if(rowkey == 'rdwgHCHO'){
                    me.houtpointpar.timeType = 'W'
                }else{
                  if(me.timetype){
                    me.houtpointpar.timeType = 'B'
                   }else{
                    me.houtpointpar.timeType = 'A'
                   }
                }
                me.redianchilddata.forEach((item)=>{
                  if(item.text == rowkey){
                        me.houtpointpar.product = item.type
                        me.hotpointtitle = item.tex
                        me.swichhpunytype(rowkey,item)
                      }
                    })
                  }else{ //其它指标项
                      me.hotpointtitle = '热点网格'
                      if(rowkey == 'floor'){//指标项为站点
                          me.pretime = me.timedata.POINT.substring(0,10)
                          par.newTime = me.timedata.POINT
                          me.getfloorPoint(par)
                      }else if(rowkey == 'bare'){//指标项为裸地
                          me.pretime = me.timedata.BARELAND.substring(0,10)
                          me.getbare(me.timedata.BARELAND)
                      }else if(rowkey == 'fire'){//指标项为火点
                          me.pretime = me.timedata.FIREPOINT.substring(0,10)
                          par.newTime = me.timedata.FIREPOINT
                          me.getStatisticData(par)
                      }else if(rowkey == 'PM10'){//指标项为PM10
                          me.activetitle = 'PM10'
                          me.pretime = me.timedata.PM10.substring(0,10)
                          par.pmType= "A",
                          par.level= "2",
                          par.newTime= me.timedata.PM10
                          me.getselectPmData(par)
                      }else if(rowkey == 'PM25'){//指标项为PM10
                          me.activetitle = 'PM2.5'
                          me.pretime = me.timedata.PM25.substring(0,10)
                          par.pmType= "B",
                          par.level= "2",
                          par.newTime= me.timedata.PM25
                          me.getselectPmData(par)
    
                      }
                  }
              });
        },
        //判断热点网格类型来定义chuchuan
        swichhpunytype(rowkey){
          let me = this
          if(rowkey == 'rdwgNO2'){
              if(me.timetype){//为天的
                me.pretime = me.timedata.NO2HOTPOINTDAY
                me.houtpointpar.dataTime = me.timedata.NO2HOTPOINTDAY
              }else{
                 me.pretime = me.timedata.NO2HOTPOINTHOUR
                me.houtpointpar.dataTime = me.timedata.NO2HOTPOINTHOUR
              }
              me.$refs.HotspotTjtwo.getTjdata(me.houtpointpar)
            }else if(rowkey == 'rdwgPM25'){
              if(me.timetype){//为天的
                me.pretime = me.timedata.HOTPOINT
                me.houtpointpar.dataTime = me.timedata.HOTPOINT
                me.$refs.HotspotTjsan.getTjdata(me.houtpointpar)
              }else{
                me.pretime = me.timedata.HOTPOINTA
                me.houtpointpar.dataTime = me.timedata.HOTPOINTA
                me.$refs.HotspotTjsan.getTjdata(me.houtpointpar)
              }
            }else if(rowkey == 'rdwgHCHO'){
              me.pretime = me.timedata.HCHOWEEK.substring(0,10)
              me.houtpointpar.dataTime = me.timedata.HCHOWEEK
              me.$refs.HotspotTjtwo.getTjdata(me.houtpointpar)
            }
            if(this.overlay){ //如果弹出框在就关闭弹出框
                var popupCloser = document.getElementById("popup-closers");
                this.overlay.setPosition(undefined);
                popupCloser.blur();
              }
        me.gethotspotMapData(me.houtpointpar)
        },
        //获取热点网格数据
        gethotspotMapData(par){
          gethotspotMap(par).then((response)=>{
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
          var arr = this.getlonloat(newarr);
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
          mapUtil.clearLayer('hotspot')
          mapUtil.createLayer(linearr, "hotspot", 100, obj);
          this.mapBindClick();
          this.layers = 'hotspot'
              }
          })
        },
        //获取pm的数据
        getselectPmData(par){
           getselectPm(par).then((response)=>{
             if((response.msg == "操作成功" && response.data.pmAVG != null) ||response.data.pngPath != null || response.data.pmContrast != null){
                  this.$refs.Pmtj.zhuEcharts(response.data.pmAVG,this.activeBtn),
                  this.$refs.Pmtj.zhubottomEcharts(response.data.pmContrast,this.activeBtn);
                  let url =process.env.VUE_APP_BASE_API + process.env.VUE_APP_REPORT_PATH + response.data.pngPath;
                  mapUtil.createStaticImage("pm", url, this.exd, 0, null);
                  this.layers = 'pm'
              }else if(response.data.pmContrast == null || response.data.pmContrast == []){
                this.$refs.Pmtj.bottomhasdata=false
              }else if(response.data.pmAVG == null || response.data.pmAVG == []){
                this.$refs.Pmtj.tophasdata=false
              }
              
           })
           
        },
        //获取站点数据
        getfloorPoint(par){
             getselectPoint(par).then(res => {
                 let newarr = [];
                 if(res.msg == '操作成功'){
                    var resdata = res.data["mapPoint"];
                    this.first = res.data["first"];
                    this.list = res.data["last"];
                    this.$refs.FloorTj.getPieData(res.data["pie"]);
                    resdata.forEach(e => {
                    let colorstyle = "";
                    colorstyle = this.aqiColor(e.AQI);
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
                this.layers = 'floor'
                this.mapBindClick();
                }
            })
        },
         //   获取火点数据
        getStatisticData(par) {
            let me = this;
            getStatistic(par).then(response => {
              if(response.msg=='操作成功'){
                  this.$refs.Firetj.getFireTjdata(response)
                  if (response.data["mapPoint"].length > 0) {
                    var mapdata = response.data.mapPoint;
                    me.createfileFeature(mapdata)
                  }
              }
            });
          },
          //加载火点数据
        createfileFeature(filedata) {
            let map =mapUtil._mapInstance
            this.firePoint = null
            // this.tableData = filedata
            this.domindex = filedata.length
            let mapDom = this.$refs.mapview.$refs.map; // 获取map地图dom元素
            var divall =  document.createElement("div");
                divall.id = "divall"
            for (let i = 0; i < filedata.length; i++) {
                var oDiv = document.createElement("span"); // 遍历coordinates创建span元素
                oDiv.id = "gif-" + i; //设置元素的id值
                divall.appendChild(oDiv)
                mapDom.appendChild(divall); //span追加到map中
                this.$nextTick(() => {
                    let loc =[filedata[i].LON,filedata[i].LAT]
                    this.firePoint = new Overlay({ // 创建一个Overlay类
                        position: fromLonLat(loc),//设置Overlay的经纬度位置
                        positioning: "center-center",
                        element: document.getElementById("gif-" + i),// 把上面的创建的元素绑定在Overlay中
                        stopEvent: false
                    });
                    this.firePoint.name = 'mapdata'
                    map.addOverlay(this.firePoint);
                     this.layers = 'fire'
                    this.firemapBindClick(filedata[i],i)
                });
            }
        },
        //火点添加点击事件侦听
        firemapBindClick(data,index){
              let that = this
                document.getElementById("gif-" + index).addEventListener("click",function(){
                    let objw = {
                        NAME : data.AREANAME,
                        filetime:data.FIREDATE,
                        LON:data.LON,
                        LAT:data.LAT,
                        timeer:'时间',
                        lat:data.LAT,
                        lon:data.LON
                    }
                    let name = 'fire'
                    let coordinates = transform([data.LON, data.LAT],"EPSG:4326","EPSG:3857");
                    that.eventreSourcesEx(name,objw,coordinates,null)
                }, false)
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
      // 渲染裸地数据
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
            mapUtil.createLayer(linearr, "bare", 10, obj);
            me.mapBindClick();
            this.layers = 'bare'
    },
        //时间类型切换的方法
        timetypechange(val){
            if(val){
                this.timevalue = '天'
                this.houtpointpar.timeType = 'B'
            }else{
                this.timevalue = '小时'
                this.houtpointpar.timeType = 'A'
            }
            this.swichhpunytype(this.activeBtn,)
        },
        closeClick(){
            this.showleft = false
        },
        showleftshow(){
            this.showleft = true
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
                  coordinates = feature.getGeometry().getCoordinates();
                } else {
                  coordinates = feature.getGeometry().getCoordinates();
                }
                if (
                  feature.attribute != undefined
                ) {
                  me.eventreSourcesEx(name, attribute, coordinates, feature);
                }
              }
            });
          }
        },
        //列表点击定位事件
        getmap(data) {
          let loc = [];
          let that = this;
          let coordinates = null;
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
          if (that.overlay) {
            that.overlay.setPosition(undefined);
            popupCloser.blur();
            that.overlay = null;
          }
          that.popupshow = true;
          if (name == "bare") {
            loc = transform(
              [Number(data.lon), Number(data.lat)+.015],
              "EPSG:4326",
              "EPSG:3857"
            );
          coordinates = transform(
              [data.lon, data.lat],
                "EPSG:4326",
                "EPSG:3857"
                  );
            let area = that.getPointNum(data.area, 2);
            that.headername = "裸地信息";
            popcontent = popcontent =
              "<ul class='table-content' style='width:100%;border:1px solid  #2e8aaf;border-bottom:none'>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>地点</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.county +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>裸地面积(m²)</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              area +
              "</span>" +
              "</li>";
          } else if ((name = "floor")) {
            loc = transform([data.LON, data.LAT+0.015], "EPSG:4326", "EPSG:3857");
            coordinates = transform([data.LON, data.LAT],"EPSG:4326","EPSG:3857");
            this.headername = "站点信息";
            popcontent =
              "<ul class='table-content' style='width:100%;border:1px solid  #2e8aaf;border-bottom:none;display: flex;flex-wrap: wrap;border-left:none'>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>站点区域</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.AREANAME +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>站点名称</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.POINTNAME +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>AQI</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.AQI +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>时间</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.MONITORTIME +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>PM2.5</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.PM25 +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>PM10</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.PM10 +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>经度</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.LON +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>纬度</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.LAT +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>NO2</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.NO2 +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>CO</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.CO +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>O3</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.O3 +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>SO2</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
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
          that.overlay.setPosition(coordinates);
          that.$refs.mapview.mapInstance.addOverlay(that.overlay);
          that.$refs.mapview.mapInstance.getView().animate({
            center: loc,
            minZoom: 4,
            maxZoom: 18,
            zoom: 12,
            duration: 1000
          });
          that.listclearcloser(popupCloser, name);
        },
        listclearcloser(popupCloser, name) {
          let that = this;
          if (popupCloser) {
            popupCloser.onclick = function() {
              if (name == "bare") {
                that.$refs.BareTj.closeActive();
              } else {
                that.$refs.FloorTj.closeActive();
              }
                that.overlay.setPosition(undefined);
                popupCloser.blur();
                mapUtil.restoreView();
                return false;
            };
          }
        },
        // 弹出框的内容模板
        eventreSourcesEx(name, data, coodinate, feature) {
          let that = this;
          let loc = [];
            that.feature = null
            that.feature = feature
          let contentpanel = null;
          if (name == "hotspot") {
            loc = [Number(data.longitude),Number(data.latitude)+0.015]
          } else if (name == "bare") {
            loc = transform(
              [Number(data.lon), Number(data.lat)+0.015],
              "EPSG:4326",
              "EPSG:3857"
            );
            data.area = that.getPointNum(data.area, 2);
          } else{
            loc = transform([Number(data.LON), Number(data.LAT)+0.015], "EPSG:4326", "EPSG:3857"); //转化成3857墨卡托坐标
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
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>地点</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.NAME +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>时间</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.filetime +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>经度</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.lon +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>纬度</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.lat +
              "</span>" +
              "</li>";
          } else if (name == "floor") {
            this.headername = "站点信息";
            popcontent =
              "<ul class='table-content' style='width:100%;border:1px solid  #2e8aaf;border-bottom:none;display: flex;flex-wrap: wrap;border-left:none'>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>站点区域</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.AREANAME +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>站点名称</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.POINTNAME +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>AQI</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.AQI +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>时间</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.MONITORTIME +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>PM2.5</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.PM25 +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>PM10</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.PM10 +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>经度</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.LON +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>纬度</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.LAT +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>NO2</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.NO2 +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>CO</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.CO +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>O3</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.O3 +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf;border-left: 1px solid  #2e8aaf;width: 50%;'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>SO2</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.SO2 +
              "</span>" +
              "</li>";
          } else if (name == "hotspot") {
            this.headername = data.num + "号热点网格信息";
            popcontent =
              "<ul class='table-content' style='width:100%;border:1px solid  #2e8aaf;border-bottom:none'>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>地点</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.areaName +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>企业数量</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.enterprseNum +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>经度</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.longitude +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;;'>纬度</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.latitude +
              "</span>" +
              "</li>";
          } else if (name == "bare") {
            this.headername = "裸地信息";
            popcontent =
              "<ul class='table-content' style='width:100%;border:1px solid  #2e8aaf;border-bottom:none'>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>地点</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
              data.name +
              "</span>" +
              "</li>" +
              "<li style='line-height:35px;display: flex;justify-content: space-between;border-bottom: 1px solid  #2e8aaf'>" +
              "<span style='color:#fff;font-size: 14px;width:30%;border-right: 1px solid  #2e8aaf;text-align: center;'>裸地面积(m²)</span>" +
              "<span style='color:#ade909;font-size: 16px;width:70%;text-align: center;'>" +
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
            zoom: 12,
            duration: 1000
          });
          that.clearcloser(name);
        },
        // 清除弹出框
        clearcloser(name) {
            var popupCloser = document.getElementById("popup-closers");
          let that = this;
          if (popupCloser) {
            popupCloser.onclick = function() {
              if (name == "hotspot") {
                let obj = {
                  circle: "",
                  fill: "rgba(255, 0, 0, 0.7)",
                  stroke: "#ffffff",
                  line: 1
                };
                that.feature.setStyle(mapUtil.setStyle(obj));
            
              }
            that.overlay.setPosition(undefined);
            popupCloser.blur();
            mapUtil.restoreView();
            that.feature = null
            return false;
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
          if(this.feature){
            this.feature.setStyle(mapUtil.setStyle(obj));
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
        if(this.feature){
          this.feature.setStyle(mapUtil.setStyle(obj));
        }
       
      this.iconactive = false
      Measure.removrhelpTooltip(this.$refs.mapview.mapInstance)
    }
        
    },
    beforeDestroy() {
        // 页面一关闭，销毁监听事件
        window.removeEventListener("resize", this.mapContainerSize);
    },
};
</script>


<style scoped>
.newbigscreen-warp {
    height: 100%;
    flex-direction: column;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow:hidden;
   
}
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
.headeruser {
    position: absolute;
    right: 0.8%;
    top: 20%;
}
.containers {
    position: relative;
    z-index: 4;
}
.newbigcreen-left{
    width: 25%;
    position: absolute;
    height: 82%;
    z-index: 9;
    top: 17%;
    left: 10px;
}
</style>
<style scoped>
.navtrere{
    position: absolute;
    top: 10%;
    left: 10px;
    margin-top: 10px;
    z-index: 6;
    background: rgba(0,0,0,.5);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px;
    height: 45px;
    box-shadow: 0 0 10px #FAF8F7
}
.el-menu-demo {
    color: #fff;
    background-color: rgba(0,41,58,0.9);
    border-color:rgba(0,41,58,0.9);
    display: inline-block;
    height: 36px;
}
/deep/.el-menu{
    margin-right: 10px;
    background: none;
    height: 36px;
}
/deep/.el-menu.el-menu--horizontal{
    border-bottom: none;
}
/deep/.el-submenu{
    height: 100%;
}
/deep/.el-menu--horizontal>.el-submenu .el-submenu__title:hover{
    background: rgba(0,0,0,0);
   /* background: url('../../../assets/bigscreen/header-bt.png') no-repeat; */
    background-size: 100% 100%;
}
/deep/.el-submenu__title{

    font-size: 16px !important;
    color: #fff !important;
    border-bottom: none !important;
    /* background: url('../../../assets/bigscreen/header-bt.png') no-repeat; */
    background-size: 100% 100%;
    height: 100% !important;
    display: flex;
    align-items: center;
    width: 130px;
}

/deep/.el-menu >.is-active{
        background: url('../../../assets/image/businessSys/monitoringSystem/activeBtn.png') !important;
       
        background-size: 100% 100% !important;
}
/deep/.el-menu >.is-active>.el-submenu__title{
     color: #ade909 !important;
}
.elbutton{
    /* background: url('../../../assets/bigscreen/header-bt.png') no-repeat; */
    background-size: 100% 100%;
    color: #fff;
    border: 0px;
    font-size: 16px;
    width: 100px;
    background: rgba(0,0,0,0);
}
.swichtype{
    position: absolute;
    right: 10px;
    top: 10%;
    z-index: 6;
    height: 45px;
    display: flex;
    align-items: center;
    width: 120px;
    background: rgba(0,0,0,.5);
    box-shadow: 0 0 10px #FAF8F7;
    margin-top: 10px;
    border-radius: 6px;
    justify-content: space-between;
    padding: 0 10px;
}
</style>

<style scoped>
    .active-btn {
        background: url('../../../assets/image/businessSys/monitoringSystem/activeBtn.png') !important;
        color: #ade909 !important;
        background-size: 100% 100% !important;
    }
</style>

<style scoped>
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
</style>

<style scoped>
    .btnright{
        position: absolute;
        top: 18%;
        left: 10px;
        z-index: 9;
    }
    .icon-list {
        font-size: 25px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.6);
        color: #fefefe;
        border-radius: 25%;
        cursor: pointer;
    }
</style>

<style>
.slide-fade-enter-active {
 transition: all .8s ease;
}
.slide-fade-leave-active {
 transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
 transform: translateX(-200px);
 transition: all 0s ease;
 opacity: 0;
}
</style>

<style scoped>
#serverLegend {
  z-index:10;
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
.istiemside {
  right:50px;
}
.timeaside {
  height: 5%;
  background: none;
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
.timelist {
  height: 60%;
  width: 5px;
  background: #218fbd;
  margin-right: 10px;
}
.istiemsidedsd{
  left:66px;
  top: 17%
}
.notiemside {
  left:26%;
  top: 17%
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
.cepositon{
  position: fixed;
  top: 16%;
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
</style>

<style lang='scss' scope="scoped">
.ol-overlaycontainer .ol-overlay-container {
    span {
        display: block;
        width: 42px;
        height: 42px;
        cursor: pointer;
        border-radius: 50%;
        background: url("../../../assets/bigscreen/huodian.gif") no-repeat;
        background-size: 42px 42px;
       
    }
}
</style>

<style scoped>
@import './css/elchange.css'
</style>


