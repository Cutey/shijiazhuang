<!--空间分析-->
<template>
    <div id="space-display-wrap">
        <!--地图组件-->
        <mapView :container="mapContainer" :baseMapName="mapBaseName" ref="mapView"/>
        <!--地图覆盖物-->
        <div id="map-overlays-wrap"></div>
        <!--顶部工具栏-->
        <div class="space-tool-wrap">
            <div class="tool-left">
                <div class="map-tool-box">
                    <button class="map-zoom-in" title="放大" @click="mapZoomIn">
                        <i class="fa fa-plus fa-lg" aria-hidden="true"></i>
                    </button>
                    <button class="map-zoom-out" title="缩小" @click="mapZoomOut">
                        <i class="fa fa-minus fa-lg" aria-hidden="true"></i>
                    </button>
                    <button class="map-zoom-restore" title="复位" @click="mapRestore">
                        <i class="fa fa-reply fa-lg" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="region-select">
                    <el-select v-model="regionValue" placeholder="请选择">
                        <el-option
                            v-for="item in regionData"
                            :key="item.AREAID"
                            :label="item.AREANAME"
                            :value="item.AREAID"
                        ></el-option>
                    </el-select>
                    <el-date-picker
                        v-model="selectDateTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                        style="margin-left: 15px">
                    </el-date-picker>
                    <button @click="queryBtn">查询</button>
                </div>
            </div>
            <!--<div class="tool-right">
                <div class="btn-change">
                    &lt;!&ndash; <button :class="{'active-btn':activeBtn==='grid'}" @click="btnChange('grid')">热点网格</button> &ndash;&gt;
                    <button :class="{'active-btn':activeBtn==='pm10'}" @click="btnChange('pm10')">PM10</button>
                    <button :class="{'active-btn':activeBtn==='pm25'}" @click="btnChange('pm25')">PM2.5</button>
                    <button :class="{'active-btn':activeBtn==='HCHO'}" @click="btnChange('HCHO')">HCHO</button>
                    <el-menu :default-active="activeBtn" class="el-menu-demo" mode="horizontal" @select="btnChange">
                        <el-submenu index="sixcan">
                            <template slot="title" style="color:#fff">{{sixtitle}}</template>
                            <el-menu-item v-for="(item) in sixoptions" :key="item.value" :index='item.value'>
                                {{item.label}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                    <button :class="{'active-btn':activeBtn==='SAND'}" @click="btnChange('SAND')">沙尘</button>
                </div>
            </div>-->
        </div>
        <!--功能按钮-->
        <div class="btn-wrap">
            <div class="btn-item-wrap">
                <ul>
                    <li :class="{'active-btn':activeBtn==='FIRE'}" @click="btnChange('grid','FIRE','PM25')">火点</li>
                </ul>
            </div>
            <div class="btn-change-box">
                <el-radio-group v-model="dataType" size="small" @change="dataTypeChangeHandle">
                    <el-radio-button label="B">插值</el-radio-button>
                    <el-radio-button label="A">遥感</el-radio-button>
                </el-radio-group>
            </div>
            <div>
                <div class="btn-item-wrap">
                    <span>热点网格</span>
                    <ul>
                        <li :class="{'active-btn':activeBtn==='B'}" @click="btnChange('grid','B','PM25')">PM2.5</li>
                        <li :class="{'active-btn':activeBtn==='NO2'}" @click="btnChange('grid','NO2','NO2')">NO2</li>
                    </ul>
                </div>
                <div class="btn-item-wrap" v-if="dataType == 'B'">
                    <span>插值浓度图</span>
                    <ul>
                        <li :class="{'active-btn':activeBtn=='138'}" @click="btnChange('consistence','138','PM10')">
                            PM10
                        </li>
                        <li :class="{'active-btn':activeBtn=='132'}" @click="btnChange('consistence','132','CO')">CO
                        </li>
                        <li :class="{'active-btn':activeBtn=='135'}" @click="btnChange('consistence','135','S02')">SO2
                        </li>
                        <li :class="{'active-btn':activeBtn=='134'}" @click="btnChange('consistence','134','O3')">O3
                        </li>
                    </ul>
                </div>
                <div class="btn-item-wrap" v-if="dataType == 'A'">
                    <span>遥感浓度图</span>
                    <ul>
                        <li :class="{'active-btn':activeBtn=='1336'}" @click="btnChange('consistence','1336','PM10')">
                            PM10
                        </li>
                        <li :class="{'active-btn':activeBtn=='1325'}" @click="btnChange('consistence','1325','HCHO')">
                            HCH0
                        </li>
                        <li :class="{'active-btn':activeBtn=='136'}" @click="btnChange('consistence','136','SAND')">沙尘
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--时间轴-->
        <timeAxis
            :day="axisConfig.day"
            :timeLength="axisConfig.timeLength"
            :speed="axisConfig.speed"
            @timeAxisMapData="timeAxisMapData"
            ref="timeAxis"
        />
        <!--信息反馈弹窗-->
        <checkDialog ref="checkDialog"/>

        <!--图例-->
        <div class="legend-box">
            <div id="legend-color" class="legend-color"></div>
            <div class="legend-title">
                <ul>
                    <li v-for="(item,index) in newtitelend" :key="index">{{item}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { Overlay } from 'ol'
    import { transform } from "ol/proj";
    import mapView from "@/components/map/mapInstance";
    import mapUtil from "@/utils/map";
    import timeAxis from "../components/newTimeAxis";
    import {
        areaList,
        hostDate,
        hotPointHandler,
        selectPm,
        factorTypeDate,
        mapData
    } from "@/api/businessSys/monitoringSystem/spaceDisplay";
    import sjz from "../../../../../public/data/sjz.json";

    //信息反馈弹窗
    import checkDialog from "../components/checkDialog";
    import CreateLegend from "@/utils/canvasLegend"
    import axios from "axios";

    export default {
        name: "spaceDisplay",
        data() {
            return {
                sixtitle: '六参数浓度图',
                sixoptions: [{
                    value: 'pm10-x',
                    label: 'PM10'
                }, {
                    value: 'pm25-x',
                    label: 'PM2.5'
                }, {
                    value: 'CO',
                    label: 'CO'
                }, {
                    value: 'SO2',
                    label: 'SO2'
                }, {
                    value: 'NO2',
                    label: 'NO2'
                }, {
                    value: 'O3',
                    label: 'O3'
                }],
                createLegend: null,
                selectDateTime: '',
                overlays:[],//火点覆盖物实例
                lengthColor: {  //B代表插值  A代表遥感
                    BPM25: ['#3b83ff', '#0ff', '#b4ff91', '#ff0', '#ff9500', 'red'],
                    BPM10: ['#3b83ff', '#0ff', '#b4ff91', '#ff0', '#ff9500', 'red'],
                    BNO2: ['rgb(112,153,89)', 'rgb(242,206,133)', 'rgb(194,140,124)', 'rgb(255,242,255)'],
                    BCO: ['#3b83ff', '#0ff', '#b4ff91', '#ff0', '#ff9500', 'red'],
                    BSO2: ['#3b83ff', '#0ff', '#b4ff91', '#ff0', '#ff9500', 'red'],
                    BO3: ['#3b83ff', '#0ff', '#b4ff91', '#ff0', '#ff9500', 'red'],
                    APM25: ['#43ce17', '#e1d72c', '#f72d0e', '#a7134c'],
                    APM10: ['#43ce17', '#e1d72c', '#f72d0e', '#a7134c'],
                    ANO2: ['#43ce17', '#e1d72c', '#f72d0e', '#a7134c'],
                    AHCHO: ['#ff0000', '#ffff00', '#63ff7b', '#0000ff'],
                    ASAND: ['rgb(241,188,255)', 'rgb(255,77,155)']
                },
                titelend: ['优', '良', '轻度', '中度', '重度', '严重'],
                newtitelend: ['优', '良', '轻度', '中度', '重度', '严重'],
                value: '',
                activeIndex: '',
                //地图初始化id
                mapContainer: "bigScreen",
                //地图底图
                mapBaseName: "vec",
                //地图实例
                mapInstance: null,
                //下拉框地区数据
                regionData: [
                    {
                        AREAID: 130100,
                        AREANAME: "石家庄",
                    }
                ],
                //选中的地区
                regionValue: 130100,
                //按钮默认选中 B:pm2.5
                activeBtn: "B",
                //数据类型 A:遥感,B:地基
                dataType: 'B',
                //按钮类型 grid:网格,par:六参数
                btnType: 'grid',
                //时间轴参数
                axisConfig: {
                    day: 7,
                    timeLength: 11,
                    speed: 1000,
                },
                //地图图片限制范围
                exd: [110.000002136454, 33.980001879856, 120.02000191249, 43.0000016782433],
            };
        },
        components: {
            mapView,
            timeAxis,
            checkDialog,
        },
        beforeDestroy() {
            // 页面一关闭，销毁监听事件
            window.removeEventListener("resize", this.mapContainerSize);
        },
        mounted() {
            this.$nextTick(() => {
                //初始化地图容器高度
                this.mapContainerSize();
                //当浏览器改变时,改变地图容器高度
                window.addEventListener("resize", this.mapContainerSize);
                //获取地图实例
                this.mapInstance = mapUtil.getMapInstance();
                //地图添加移动事件,当鼠标指向矢量图层变为小手
                this.vectorPointerMove();
                //地图绑定点击事件
                this.onMapClick();
                //获取地区下拉框数据
                this.regionSelectData();
                //获取最新有热点网格数据的日期
                //this.gridDate();
                this.createLegend = new CreateLegend('legend-color');
                this.btnChange(this.btnType, this.activeBtn, 'PM25');
                //将气泡框提交信息方法挂接到window中
                window.infoSubmit = this.infoSubmit;
            });
        },
        methods: {
            //地图容器尺寸
            mapContainerSize() {
                mapUtil.setMapHeight(140);
            },
            //地图放到
            mapZoomIn() {
                if (this.mapInstance) {
                    let z = this.mapInstance.getView().getZoom();
                    this.mapInstance.getView().setZoom(z + 1);
                }
            },
            //地图缩小
            mapZoomOut() {
                if (this.mapInstance) {
                    let z = this.mapInstance.getView().getZoom();
                    this.mapInstance.getView().setZoom(z - 1);
                }
            },
            //地图复位
            mapRestore() {
                mapUtil.restoreView();
            },
            //获取地区下拉框数据
            regionSelectData() {
                areaList({areaId: 130100}).then((res) => {
                    if (res.data.length > 0) {
                        for (let i = 0; i < res.data.length; i++) {
                            this.regionData.push(res.data[i]);
                        }
                    }
                }).catch((error) => {
                });
            },
            //查询按钮根据选中的地区查询json数据,绘制边界
            queryBtn() {
                //清楚图层
                mapUtil.clearLayer("boundaryLayer");
                if (this.regionValue === 130100) {
                    let feature = this.$refs.mapView.createBoundary();
                    
                    let extent = feature.getGeometry().getExtent(); //获取范围
                    this.mapInstance.getView().fit(extent); //定位
                } else {
                    let features = sjz.features;
                    for (let i = 0; i < features.length; i++) {
                        if (this.regionValue === features[i].attributes.PAC) {
                            let feature = mapUtil.createFeature(
                                "polygon",
                                "boundaryFeature",
                                features[i].geometry.rings
                            ); //创建要素
                            let extent = feature.getGeometry().getExtent(); //获取范围
                            mapUtil.createLayer(feature, "boundaryLayer", 1); //创建边界图层
                            this.mapInstance.getView().fit(extent); //定位
                            break;
                        }
                    }
                }

                if (this.selectDateTime) {
                    this.getFactorTypeDate();
                }
            },
            dataTypeChangeHandle() {
                this.btnType = 'grid';
                this.activeBtn = 'B';
                this.getFactorTypeDate();
                this.createCanvasLegend('PM25');
            },
            //获取时间参数
            getParams() {
                let params = {};
                //params.areaId = this.regionValue;
                params.dataType = this.dataType;
                if (this.activeBtn != '1325') {
                    params.fileType = 'A';
                    params.lastTime = 4;
                } else {
                    params.fileType = 'W';
                    params.lastTime = 35;
                }
                params.hotPointType = 'A';
                if (this.btnType == 'grid') {
                    params.productType = this.activeBtn;
                } else {
                    params.resourcesTypeId = this.activeBtn;
                }
                if (this.selectDateTime) {
                    params.dataTime = this.selectDateTime;
                }
                return params;
            },

            //根据类型获取时间
            getFactorTypeDate() {
                let params = this.getParams();
                factorTypeDate(params).then(res => {
                    if (res.code == 200) {
                        if (this.activeBtn == '1325' || this.activeBtn == 'FIRE') {  //HCHO及火点去掉小时
                            res.data.hours = [];
                        }
                        this.$refs.timeAxis.initTimeSlide(res.data);
                    }
                }).catch(error => {

                })
            },
            //根据时间获取数据
            getDateTimeData(time) {
                let params = this.getParams();
                params.dataTime = time;
                this.removeOverlay();
                //隐藏气泡框
                this.$refs.mapView.mapPopup.setPosition(undefined);
                if (this.btnType == 'grid' && this.activeBtn == 'FIRE') { //火点数据
                    params.resourcesTypeId = '';
                    this.fireDataHandler(params);
                    return;
                }
                if (this.btnType == 'grid') {
                    //热点网格数据
                    params.resourcesTypeId = '';
                    this.newHotPointHandler(params);
                    let par = JSON.parse(JSON.stringify(params));
                    //地图加载图片数据
                    par.productType = '';
                    if (par.dataType == 'B') {
                        par.resourcesTypeId = params.productType == 'B' ? 137 : 1316; //插值
                    } else {
                        par.resourcesTypeId = params.productType == 'B' ? 1335 : 1317;//遥感
                    }
                    this.newGetSelectPm(par);
                } else {
                    this.newGetSelectPm(params);
                }
            },
            //pm25及pm10按钮切换事件
            btnChange(btnType, activeBtn, colorItem) {
                this.btnType = btnType;
                this.activeBtn = activeBtn;
                this.getFactorTypeDate();
                this.createCanvasLegend(colorItem);
            },

            //图例颜色
            createCanvasLegend(colorItem) {
                if (this.dataType == 'B') {
                    colorItem = 'B' + colorItem;
                } else {
                    colorItem = 'A' + colorItem;
                }
                let color = this.lengthColor[colorItem];
                this.createLegend.createLegendColor(color);
            },


            //火点火点数据
            fireDataHandler(params) {
                mapUtil.clearLayer("gridLayer"); //清除图层
                mapUtil.clearLayer("pm"); //清除pm图层
                mapData(params).then((res) => {
                    if (res.data.length > 0) {
                        this.drawMapCharts(res.data);
                    }else{
                        this.msgInfo('暂无火点数据');
                    }
                }).catch(error=>{

                })
            },
            //新的绘制热点网格地图数据
            newHotPointHandler(params) {
                let that = this;
                return new Promise((resolve, reject) => {
                    mapData(params).then((res) => {
                        mapUtil.clearLayer("gridLayer"); //清除图层
                        if (res.data.length > 0) {
                            let features = [];
                            for (let i = 0; i < res.data.length; i++) {
                                let coordinate = that.hostGrid(res.data[i]);
                                let coordinates = [coordinate];
                                let feature = mapUtil.createhoutFeature(
                                    "polygon",
                                    "gridFeature" + i,
                                    coordinates,
                                    res.data[i]
                                );
                                features.push(feature);
                            }
                            let styleObj = {
                                circle: "",
                                fill: "rgba(255,0,0,0.8)",
                                stroke: "#ffffff",
                                line: 1,
                            };

                            let layer = mapUtil.createLayer(
                                features,
                                "gridLayer",
                                2,
                                styleObj
                            );
                        }
                        resolve(true);
                    }).catch((error) => {
                    });
                });
            },
            //新的加载地图图片数据
            newGetSelectPm(params) {
                let that = this;
                return new Promise((resolve, reject) => {
                    mapData(params).then((res) => {
                        if (that.btnType != 'grid') {
                            mapUtil.clearLayer("gridLayer"); //清除热网格图层
                        }
                        mapUtil.clearLayer("pm"); //清除pm图层
                        if (res.data.length > 0) {
                            let imgPath = '';
                            if (res.data.length == 1) {
                                //图片路径
                                imgPath = process.env.VUE_APP_BASE_API + process.env.VUE_APP_REPORT_PATH + res.data[0].PICURL;
                                this.newtitelend = this.titelend;

                            }
                            if (res.data.length == 2) {
                                let jsonurl = process.env.VUE_APP_BASE_API + process.env.VUE_APP_REPORT_PATH + res.data[0].PICURL;
                                axios.get(jsonurl).then(response => {
                                    if (that.activeBtn == '1325') {
                                        response.data.data[0] = parseFloat(response.data.data[0]).toFixed(4);
                                        response.data.data[1] = parseFloat(response.data.data[1]).toFixed(4);
                                    }
                                    this.newtitelend = response.data.data;
                                }).catch(() => {
                                    this.newtitelend = this.titelend;
                                });
                                //图片路径
                                imgPath = process.env.VUE_APP_BASE_API + process.env.VUE_APP_REPORT_PATH + res.data[1].PICURL;
                            }
                            if (that.activeBtn == 'NO2') {
                                that.exd = [113.23443, 36.71951, 115.64419, 39.48501];
                            } else if (that.activeBtn == '136') {
                                that.exd = [106.285, 32.396, 125.968, 45.024];
                                this.newtitelend = ['高', '低'];
                            } else if (that.activeBtn == '1325') {
                                that.exd = [112.852, 36.107, 116.15, 39.871];
                            } else {
                                that.exd = [110.000002136454, 33.980001879856, 120.02000191249, 43.0000016782433];
                            }
                            //创建静态图片图层
                            mapUtil.createStaticImage("pm", imgPath, that.exd, 0, null);
                        } else {
                            this.newtitelend = this.titelend;
                        }

                        resolve(true);
                    }).catch((error) => {
                    });
                });
            },

           //地图展示火点
            drawMapCharts(data) {
                console.log(data)
                let that = this;
                document.getElementById('map-overlays-wrap').innerHTML = '<div id="map-overlays-box"></div>';
                let overlaysWrap = document.getElementById('map-overlays-box');
                for (let i = 0; i < data.length; i++) {
                    let id = 'overlays-box' + i;
                    let itemEl = document.createElement("div");
                    itemEl.id = id;
                    itemEl.setAttribute('class','overlays-item-box');
                    itemEl.setAttribute('data-index',i+'');
                    overlaysWrap.appendChild(itemEl);
                    let overlay = new Overlay({
                        element: document.getElementById(id),
                        position: transform([data[i].LON,data[i].LAT], "EPSG:4326", "EPSG:3857"),
                        autoPan: true,
                        autoPanAnimation: {
                            duration: 250
                        }
                    });
                    overlay.data = data[i];
                    this.overlays.push(overlay);
                    this.mapInstance.addOverlay(overlay);//将气泡框添加到地图
                    document.getElementById(id).addEventListener('click',function (e) {
                        that.fireContent(e,that);
                    })
                }
            },
            //获取点击的火点内容
            fireContent(event,that){
                let e = event || window.event;
                let index = e.target.getAttribute('data-index');
                if(index){
                    let fireOverlay = this.overlays[parseInt(index)];
                    let obj = {
                        NAME : fireOverlay.data.AREANAME,
                        filetime:fireOverlay.data.FIREDATE,
                        LON:fireOverlay.data.LON,
                        LAT:fireOverlay.data.LAT,
                        timeer:'时间',
                        lat:fireOverlay.data.LAT,
                        lon:fireOverlay.data.LON
                    };
                    let coordinates = transform([fireOverlay.data.LON, fireOverlay.data.LAT],"EPSG:4326","EPSG:3857");
                    //气泡框显示位置
                    that.$refs.mapView.mapPopup.setPosition(coordinates);
                    //组装信息内容
                    let content = that.fireJointContent(obj);
                    //将内容添加到气泡框中
                    that.$refs.mapView.attrAddPopup(content);
                }

            },
            //火点内容组装
            fireJointContent(data){
                let popcontent =
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
                "</ul>"
                return popcontent;
            },

            //获取最新有热点网格数据,pm25,pm10日期
            gridDate() {
                this.getFactorTypeDate();
                let that = this;
                let par = {
                    areaId: that.regionValue,
                    hotPointType: "A"
                }
                hostDate(par).then((res) => {
                    if (this.activeBtn === "PM2.5" || this.activeBtn === "NO2") {
                        //this.sixtitle = '六参数浓度图';
                        let productType = 'B';
                        let curTime = '';
                        if (this.activeBtn === "PM2.5") {
                            curTime = res.data[0].HOTPOINTA;
                            productType = 'B';
                        } else {
                            curTime = res.data[0].NO2HOTPOINTHOUR;
                            productType = 'NO2';
                        }
                        //初始化时间轴数据当前时间
                        that.$refs.timeAxis.initTimeSlide(curTime);
                        //热点网格数据
                        that.hotPointHandler(curTime, productType);
                    } else if (this.activeBtn === "pm25") {
                        this.sixtitle = '六参数浓度图';
                        //初始化时间轴数据当前时间
                        that.$refs.timeAxis.initTimeSlide(res.data[0].PM25);
                        //pm25数据
                        that.getSelectPm("B", res.data[0].PM25);
                    } else if (this.activeBtn === "pm10") {
                        this.sixtitle = '六参数浓度图',
                            //初始化时间轴数据当前时间
                            that.$refs.timeAxis.initTimeSlide(res.data[0].PM10);
                        //pm10数据
                        that.getSelectPm("A", res.data[0].PM10);
                    } else if (this.activeBtn === 'CO') {
                        this.sixtitle = 'CO'
                        //初始化时间轴数据当前时间
                        that.$refs.timeAxis.initTimeSlide(res.data[0].CO);
                        //CO数据
                        that.getSelectPm("C", res.data[0].CO);
                    } else if (this.activeBtn === "SO2") {
                        this.sixtitle = 'SO2'
                        //初始化时间轴数据当前时间
                        that.$refs.timeAxis.initTimeSlide(res.data[0].SO2);
                        //pm10数据
                        that.getSelectPm("D", res.data[0].SO2);
                    } else if (this.activeBtn === "NO2") {
                        this.sixtitle = 'NO2'
                        //初始化时间轴数据当前时间
                        that.$refs.timeAxis.initTimeSlide(res.data[0].NO2);
                        //pm10数据
                        that.getSelectPm("E", res.data[0].NO2);
                    } else if (this.activeBtn === "O3") {
                        this.sixtitle = 'O3'
                        //初始化时间轴数据当前时间
                        that.$refs.timeAxis.initTimeSlide(res.data[0].O3);
                        //pm10数据
                        that.getSelectPm("F", res.data[0].O3);
                    } else if (this.activeBtn === "SAND") {
                        this.sixtitle = '六参数浓度图',
                            //初始化时间轴数据当前时间
                            that.$refs.timeAxis.initTimeSlide(res.data[0].SAND);
                        // //pm10数据
                        that.getSelectPm("G", res.data[0].SAND);
                    } else if (this.activeBtn === 'pm25-x') {
                        this.sixtitle = 'pm25';
                        //初始化时间轴数据当前时间
                        that.$refs.timeAxis.initTimeSlide(res.data[0].SPM25);
                        // //pm10数据
                        that.getSelectPm("H", res.data[0].SPM25);
                    } else if (this.activeBtn === 'pm10-x') {
                        this.sixtitle = 'pm10';
                        //初始化时间轴数据当前时间
                        that.$refs.timeAxis.initTimeSlide(res.data[0].SPM10);
                        //pm10数据
                        that.getSelectPm("I", res.data[0].SPM10);
                    }
                }).catch((error) => {
                });
            },
            //绘制热点网格地图数据
            hotPointHandler(time, productType) {
                let that = this;
                let pm = {
                    dataTime: time,
                    timeType: 'A',
                    product: productType
                };

                return new Promise((resolve, reject) => {
                    hotPointHandler(pm)
                        .then((res) => {
                            mapUtil.clearLayer("gridLayer"); //清除图层
                            mapUtil.clearLayer("pm"); //清楚pm图层
                            if (res.data.length > 0) {
                                let features = [];
                                for (let i = 0; i < res.data.length; i++) {
                                    let coordinate = that.hostGrid(res.data[i]);
                                    let coordinates = [coordinate];
                                    let feature = mapUtil.createhoutFeature(
                                        "polygon",
                                        "gridFeature" + i,
                                        coordinates,
                                        res.data[i]
                                    );
                                    features.push(feature);
                                }
                                let styleObj = {
                                    circle: "",
                                    fill: "rgba(255,0,0,0.8)",
                                    stroke: "#ffffff",
                                    line: 1,
                                };

                                let layer = mapUtil.createLayer(
                                    features,
                                    "gridLayer",
                                    2,
                                    styleObj
                                );
                            }
                            resolve(true);
                        })
                        .catch((error) => {
                        });
                });
            },
            //加载pm25或pm10地图数据
            getSelectPm(pmType, time) {
                let that = this;

                let pm = {
                    pmType: pmType, //pm类型A为PM10.B为PM25
                    areaId: that.regionValue, //行政区划编码
                    level: 1, //行政区划级别 1 省 2 市 3 区县
                    newTime: time,
                };
                if (pmType == 'A' || pmType == 'B') {
                    pm.sts = 'Y'
                }

                return new Promise((resolve, reject) => {
                    selectPm(pm).then((res) => {
                        mapUtil.clearLayer("gridLayer"); //清除热网格图层
                        mapUtil.clearLayer("pm"); //清楚pm图层
                        if (res.data) {
                            //图片路径
                            let imgPath =
                                process.env.VUE_APP_BASE_API + process.env.VUE_APP_REPORT_PATH +
                                res.data.pngPath;
                            //图片范围
                            let extent = [
                                111.983002136,
                                35.9120018352,
                                119.983001957,
                                42.9520016782,
                            ];
                            let jsonsd = res.data.pngPath.split(".");
                            let jsonurl = process.env.VUE_APP_BASE_API + process.env.VUE_APP_REPORT_PATH + jsonsd[0] + '.json';
                            //创建静态图片图层
                            axios.get(jsonurl).then(response => {
                                this.newtitelend = response.data.data
                            }).catch(() => {
                                this.newtitelend = this.titelend
                            });
                            mapUtil.createStaticImage("pm", imgPath, that.exd, 0, null);
                        }

                        resolve(true);
                    })
                        .catch((error) => {
                        });
                });
            },
            //时间轴展示地图数据
            timeAxisMapData(time, intervalCount, type) {
                let that = this;
                //清楚时间轴定时器
                // clearInterval(intervalCount);
                if (that.activeBtn === "grid") {
                    //热点网格数据
                    that.hotPointHandler(time).then((res) => {
                        //type等于I时,继续轮播
                        if ("I" === type) {
                            //继续执行时间轴定时器
                            that.$refs.timeAxis.timeMove();
                        }
                    });
                } else if (that.activeBtn === "pm25") {
                    //pm25数据
                    that.getSelectPm("B", time).then((res) => {
                        //type等于I时,继续轮播
                        if ("I" === type) {
                            //继续执行时间轴定时器
                            that.$refs.timeAxis.timeMove();
                        }
                    });
                } else if (that.activeBtn === "pm10") {
                    //pm10数据
                    that.getSelectPm("A", time).then((res) => {
                        //type等于I时,继续轮播
                        if ("I" === type) {
                            //继续执行时间轴定时器
                            that.$refs.timeAxis.timeMove();
                        }
                    });
                } else if (that.activeBtn === "CO") {
                    //CO数据
                    that.getSelectPm("C", time).then((res) => {
                        //type等于I时,继续轮播
                        if ("I" === type) {
                            //继续执行时间轴定时器
                            that.$refs.timeAxis.timeMove();
                        }
                    });
                } else if (that.activeBtn === "SO2") {
                    //SO2数据
                    that.getSelectPm("D", time).then((res) => {
                        //type等于I时,继续轮播
                        if ("I" === type) {
                            //继续执行时间轴定时器
                            that.$refs.timeAxis.timeMove();
                        }
                    });
                } else if (that.activeBtn === "NO2") {
                    //NO2数据
                    that.getSelectPm("E", time).then((res) => {
                        //type等于I时,继续轮播
                        if ("I" === type) {
                            //继续执行时间轴定时器
                            that.$refs.timeAxis.timeMove();
                        }
                    });
                } else if (that.activeBtn === "O3") {
                    //NO2数据
                    that.getSelectPm("F", time).then((res) => {
                        //type等于I时,继续轮播
                        if ("I" === type) {
                            //继续执行时间轴定时器
                            that.$refs.timeAxis.timeMove();
                        }
                    });
                }
            },

            //地图点击事件
            onMapClick() {
                let that = this;
                let map = that.mapInstance;
                that.mapEventKey = map.on("singleclick", function (evt) {
                    let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                        return feature;
                    });
                    if (feature) {
                        if (feature.name != "boundaryFeature") {
                            let extent = feature.getGeometry().getExtent();
                            //气泡框显示位置
                            that.$refs.mapView.mapPopup.setPosition(evt.coordinate);
                            map.getView().animate({center: evt.coordinate, zoom: 13});
                            //组装信息内容
                            let content = that.splitJointContent(feature.attributes);
                            //将内容添加到气泡框中
                            that.$refs.mapView.attrAddPopup(content);
                        } else {
                            //隐藏气泡框
                            that.$refs.mapView.mapPopup.setPosition(undefined);
                            mapUtil.restoreView();
                        }
                    } else {
                        //隐藏气泡框
                        that.$refs.mapView.mapPopup.setPosition(undefined);
                        mapUtil.restoreView();
                    }
                });
            },
            //地图改变鼠标光标为小手
            vectorPointerMove() {
                let that = this;
                let map = that.mapInstance;
                map.on("pointermove", function (evt) {
                    let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
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
            //气泡框信息填报弹窗按钮
            infoSubmit(num, name, id) {
                this.$refs.checkDialog.dialogFormVisible = true;
                this.$refs.checkDialog.title = num + "热点网格核查反馈";
                this.$refs.checkDialog.form.name = "石家庄" + name;
                this.$refs.checkDialog.form.num = num;
                this.$refs.checkDialog.form.hotpointid = id;
            },
            //热点网格数据组装成面数据
            hostGrid(data) {
                let coordinate = [];
                coordinate[0] = data.rbPoint.split(",");
                coordinate[1] = data.lbPoint.split(",");
                coordinate[2] = data.ltPoint.split(",");
                coordinate[3] = data.rtPoint.split(",");
                coordinate[4] = data.rbPoint.split(",");
                return coordinate;
            },
            //组装气泡框中数据
            splitJointContent(attr) {
                let content =
                    '<div style="color:#fff">' +
                    '<div style="margin-bottom: 10px;" onclick="infoSubmit(' +
                    attr.num +
                    ",'" +
                    attr.areaName +
                    "'," +
                    attr.hotpointDataId +
                    ')">' +
                    "<span>网格涉及企业</span>" +
                    '<span class="info-btn" title="信息提交"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span>' +
                    "</div>";
                if (attr.enterprseNames) {
                    content += '<div class="info-box"><ul>';
                    for (let i = 0; i < attr.enterprseNames.length; i++) {
                        content += "<li>" + attr.enterprseNames[i] + "</li>";
                    }
                    content += "</ul></div>";
                } else {
                    content += '<div class="un-info-box"><span>暂无企业信息</span></div>';
                }
                return content;
            },


            //移除地图覆盖物
            removeOverlay(){
                for(let i=0;i<this.overlays.length;i++){
                    this.mapInstance.removeOverlay(this.overlays[i]);
                }
                this.overlays = [];
            },
            /**
             * 附近位置最大最小经纬度计算
             * @param   longitude  经度
             * @param   latitude   纬度
             * @param   distince    距离（千米）
             * @returns 格式：经度最小值-经度最大值-纬度最小值-纬度最大值
             */
            getMaxMinLongitudeLatitude(longitude, latitude, distince) {
                let r = 6371.393; // 地球半径千米
                let lng = longitude;
                let lat = latitude;
                let dlng =
                    2 *
                    Math.asin(
                        Math.sin(distince / (2 * r)) / Math.cos((lat * Math.PI) / 180)
                    );
                dlng = (dlng * 180) / Math.PI; // 角度转为弧度
                let dlat = distince / r;
                dlat = (dlat * 180) / Math.PI;
                let minlat = lat - dlat;
                let maxlat = lat + dlat;
                let minlng = lng - dlng;
                let maxlng = lng + dlng;
                let coordinate = [];
                coordinate[0] = [minlng, minlat];
                coordinate[1] = [maxlng, minlat];
                coordinate[2] = [maxlng, maxlat];
                coordinate[3] = [minlng, maxlat];
                coordinate[4] = [minlng, minlat];
                return coordinate;
            },
        },
    };
</script>
<style scoped>
    #space-display-wrap >>> .el-menu--horizontal > .el-submenu .el-submenu__title {
        color: #fff;
        font-size: 16px;
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    #space-display-wrap >>> .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
        background: url('../../../../assets/image/businessSys/monitoringSystem/activeBtn.png') !important;
        color: #ade909 !important;
        background-size: 100% 100% !important;
        border-bottom: none;
    }

    #space-display-wrap >>> .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
        background: #046f99 !important;
        color: #c1ebff !important;
    }

    #space-display-wrap >>> .el-menu-demo {
        color: #fff;
        background-color: rgba(0, 41, 58, 0.9);
        border-color: rgba(0, 41, 58, 0.9);
        display: inline-block;
        height: 100%;
    }
</style>
<style lang="scss" scoped>
    #space-display-wrap {
        position: relative;

        button:focus {
            outline: none;
        }

        .space-tool-wrap {
            display: flex;
            position: absolute;
            top: 0;
            width: 100%;
            height: 60px;


            .tool-left {
                display: flex;
                // flex: 1;
                padding: 0 10px;
                background: rgba(0, 41, 58, 0.9);

                .map-tool-box {
                    display: flex;
                    align-items: center;

                    button {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        border: 2px solid #046f99;
                        background: rgba(255, 255, 255, 0);
                        margin-right: 15px;
                        color: #046f99;
                        cursor: pointer;
                    }
                }

                .region-select {
                    display: flex;
                    align-items: center;
                    margin-left: 20px;

                    /deep/ .el-input__inner {
                        background-color: #234554;
                        color: #fff;
                        border: 1px solid #046f99;
                    }

                    button {
                        background: #046f99;
                        cursor: pointer;
                        color: #fff;
                        border: 0;
                        padding: 10px 15px;
                        margin-left: 15px;
                    }
                }
            }

            .tool-right {
                display: flex;
                flex: 1;
                justify-content: flex-end;

                .btn-change {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    button {
                        height: 100%;
                        width: 120px;
                        background: rgba(0, 41, 58, 0.9);
                        border: 0;
                        color: #fff;
                        cursor: pointer;
                    }

                    button:hover {
                        background: #046f99;
                        color: #c1ebff;
                    }
                }
            }
        }

        .btn-wrap {
            position: absolute;
            top: 60px;
            right: 10px;

            .btn-change-box {
                margin-bottom: 10px;

                /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
                    background-color: #183d4b;
                    border-color: #183d4b;
                }
            }

            .btn-item-wrap {
                background: #183d4b;
                color: #fff;
                text-align: center;
                margin-bottom: 10px;

                span {
                    display: inline-block;
                    padding: 8px 10px;
                    background: #046f99;
                    width: 100%;
                }

                ul {
                    li {
                        padding: 10px;
                        cursor: pointer;
                    }

                    li:hover {
                        color: #ade909;
                    }
                }
            }

        }

        .legend-box {
            position: absolute;
            bottom: 0px;
            right: 0px;
            width: 18.9%;
            background: rgba(0, 41, 58, 0.9);

            .legend-color {
                height: 10px;
            }

            /*.legend-color {
                background-image: linear-gradient(
                        to right,
                        #43ce17 15%,
                        #e1d72c 22%,
                        #f72d0e 75%,
                        #a7134c 90%
                );
                height: 10px;
            }

            .SANDlegend-color {
                background-image: linear-gradient(
                        to right,
                        #7F0200 15%,
                        #C00002 22%,
                        #FC6E00 55%,
                        #FFFF4F 90%
                );
                height: 10px;
            }

            .legends-color {
                background-image: linear-gradient(
                        to right,
                        rgb(59, 131, 255) 15%,
                        rgb(0, 255, 255) 32%,
                        rgb(180, 255, 145) 48%,
                        rgb(255, 255, 0) 64%,
                        rgb(255, 149, 0) 84%,
                        rgb(255, 0, 0) 90%
                );
                height: 10px;
            }*/

            .legend-title {
                flex: 1;
                display: flex;
                justify-content: center;

                ul {
                    display: flex;
                    flex: 1;

                    li {
                        flex: 1;
                        color: #fff;
                        padding: 14px 10px 13px 10px;
                        text-align: center;
                    }
                }
            }
        }
    }
    /deep/.overlays-item-box{
        width: 40px;
        height: 40px;
        cursor: pointer;
        background: url("../../../../assets/bigscreen/huodian.gif") no-repeat;
        background-size: 40px 40px;
    }
</style>

<!--气泡框内容样式-->
<style lang="scss" scoped>
    .info-box {
        height: 110px;
        overflow-y: auto;

        ul li {
            padding: 5px 0;
        }
    }

    .un-info-box {
        height: 110px;
        overflow-y: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .info-btn {
        margin-left: 15px;
        cursor: pointer;
        color: #ade909;
    }


</style>
