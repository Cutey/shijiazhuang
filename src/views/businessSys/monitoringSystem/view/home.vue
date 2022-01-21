<template>
    <div class="home-box">
        <div class="home-left-box">
            <div class="left-top" @click="picAmplify">
                <swiper :options="swiperOption" class="swiper-wrap" ref="wxSwiper" v-if="lb.length > 0">
                    <swiper-slide v-for="(item,index) in lb" :key="index" >
                        <img :src="reportPath+item.resourcesUrl" title="点击放大图片" style="width:75%" />
                        <!-- <div :style="{'background-image':'url('+reportPath+''+item.resourcesUrl+')'}"
                             style="background-size:100% 100%;height: 100%;"></div> -->
                    </swiper-slide>
                    <div class="swiper-pagination" v-for="(item,index) in lb" :key="index" slot="pagination"></div>
                </swiper>
            </div>
            <div class="right-bottom">
                <div class="title-box">
                    <div class="icon-box">
                        <i class="fa fa-line-chart fa-lg" aria-hidden="true"></i>
                        <i class="split-line"></i>
                        <span class="title-color">热点网格</span>
                    </div>

                    <div class="btn-change">
                        <button :class="{'active-btn':rdwgactive===item.text}" @click="rdwgbtnChangeBar(item)" v-for="(item) in rdwglist" :key="item.text">{{item.tex}}</button>
                    </div>
                </div>
                <div id="pie-chart-box" class="pie-chart-box">
                    <!--折现图-->
                </div>
            </div>

        </div>
        <div class="home-right-box">
            <div class="right-top">
                <div class="report-item-box">
                    <div class="title-box">
                        <div class="icon-box">
                            <i class="fa fa-file-text-o fa-lg"></i>
                            <i class="split-line"></i>
                            <span class="title-color">PM2.5监测日报</span>
                        </div>
                    </div>
                    <div class="list-box">
                        <!--列表-->
                        <ul>
                            <li v-for="(item,index) in reportWeek" :key="index">
                                <a :href="reportPath+item.resourcesUrl" target="_blank" style="display: block;">
                                    <i class="file-icon fa fa-caret-right fa-lg"></i>
                                    {{item.typeName}}
                                    <span class="report-date">{{item.releaseDate}}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="report-item-box">
                    <div class="title-box">
                        <div class="icon-box">
                            <i class="fa fa-file-text-o fa-lg"></i>
                            <i class="split-line"></i>
                            <span class="title-color">NO2监测日报</span>
                        </div>
                    </div>
                    <div class="list-box">
                        <!--列表-->
                        <ul>
                            <li v-for="(item,index) in reportDataDay" :key="index">
                                <a :href="reportPath+item.resourcesUrl" target="_blank" style="display: block;">
                                    <i class="file-icon fa fa-caret-right fa-lg"></i>
                                    {{item.typeName}}
                                    <span class="report-date">{{item.releaseDate}}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="report-item-box">
                    <div class="title-box">
                        <div class="icon-box">
                            <i class="fa fa-file-text-o fa-lg"></i>
                            <i class="split-line"></i>
                            <span class="title-color">HCHO监测周报</span>
                        </div>
                        <div class="more-box" @click="moreClick"><span>更多</span></div>
                    </div>
                    <div class="list-box">
                        <!--列表-->
                        <ul>
                            <li v-for="(item,index) in reportMonth" :key="index">
                                <a :href="reportPath+item.resourcesUrl" target="_blank" style="display: block;">
                                    <i class="file-icon fa fa-caret-right fa-lg"></i>
                                    {{item.typeName}}
                                    <span class="report-date">{{item.releaseDate}}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="left-bottom">
                <div class="title-box">
                    <div class="icon-box">
                        <i class="fa fa-bar-chart fa-lg" aria-hidden="true"></i>
                        <i class="split-line"></i>
                        <span class="title-color">地面监测</span>
                    </div>
                    <div class="btn-change">
                        <button :class="{'active-btn':activeBtn==='G'}" @click="btnChangeBar('G')">国控站点</button>
                        <button :class="{'active-btn':activeBtn==='S'}" @click="btnChangeBar('S')">省控站点</button>
                    </div>
                </div>
                <div id="bar-chart-box" class="bar-chart-box">
                    <!--柱状图标-->
                </div>
            </div>
        </div>


        <!--图片放大-->
        <viewer :images="lb"
                @inited="inited"
                class="viewer"
                ref="viewer"
        >
            <template slot-scope="scope">
                <img v-for="src in scope.images" :src="reportPath+src.resourcesUrl" :key="src.resourcesUrl"/>
            </template>
        </viewer>
    </div>
</template>

<script>
    import 'swiper/dist/css/swiper.css'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
    import {statePmData, provincePmData, gridList, reportData} from "@/api/businessSys/monitoringSystem/home";
    import {getpie} from '@/api/bigscreen/bigscreen.js'
    export default {
        name: "home",
        data() {
            return {
                //轮播图数据
                lb: [],
                //轮播图设置
                swiperOption: {
                    loop: true,
                    slidesPerView: 1,
                    autoplay: {
                        delay: 1500,
                        disableOnInteraction: true,
                    },
                    direction: 'horizontal',
                    speed: 1000,
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'bullets'
                    }
                },
                //日报绝对路径
                reportPath: process.env.VUE_APP_BASE_API + process.env.VUE_APP_REPORT_PATH,
                //日报数据
                reportDataDay: [],
                //周报数据
                reportWeek: [],
                //月报数据
                reportMonth: [],
                activeBtn: 'G',
                rdwgactive:'',
                timedata:[],
                houtpointpar:{
                    timeType:'',
                    product:'',
                    dataTime:''
                    },
                rdwglist:[
                    {
                            text: "rdwgPM25",
                            type: "B",
                            resourcesTypeID: "",
                            tes: "PM2.5",
                            tex: "PM2.5热点",
                            timeType:'B'
                        },
                        {
                            text: "rdwgNO2",
                            type: "NO2",
                            resourcesTypeID: "",
                            tes: "NO2",
                            tex: "NO2热点",
                            timeType:'B'
                        },

                ]
            }
        },
        components: {
            swiper,
            swiperSlide
        },
        mounted() {
            this.$nextTick(() => {
                //初始化饼图
                // this.pieData();
                this.getdatatime()
                // //柱状图
                this.barData();
                //日报数据
                this.reportDataList();
                //周报数据
                this.reportWeekList();
                // //日报数据
                this.reportMonthList();
                // //轮播图数据

            });
        },
        methods: {
            getdatatime(){
                let par = {
                    areaId: "130100"
                    };
                    let that = this
                getpie(par).then((response)=>{
                    if (response.msg == "success") {
                        // let row = {
                        //     dataTime : response.data[0].HOTPOINT
                        // }
                       that.timedata = response.data[0]
                       that.rdwgbtnChangeBar(that.rdwglist[0])
                       that.carouselData(response.data[0].ZCTPNG);
                    }
                })
            },
            //轮播图数据
            carouselData(day) {
                let pm = {
                    fileFormat: 'A',
                    fileSuffix: 'A',
                    fileType: 'A',
                    pageNum: 1,
                    pageSize: 11,
                    resourcesTypeId: 33
                };
                pm.dataTime = day;
                reportData(pm).then(res => {
                    if (res.data.rows.length > 0) {
                        this.lb = res.data.rows;
                    }
                }).catch(error => {
                });
            },
            //获取最新遥感监测日报数据
            reportDataList() {
                let pm = {
                    fileFormat: 'B',
                    fileSuffix: 'E',
                    fileType: 'D',
                    pageNum: 1,
                    pageSize: 6,
                    resourcesTypeId: '1331,1332',
                    isShow : 'Y'
                }
                reportData(pm).then(res => {
                    if (res.data.rows) {
                        for(let i=0;i<res.data.rows.length;i++){
                            //查找是否标题是否有'无'文字
                            let w = res.data.rows[i].resourcesName.lastIndexOf('无');
                            if(w > -1){
                                res.data.rows[i].typeName = res.data.rows[i].typeName+'_无云';
                            }else{
                                res.data.rows[i].typeName = res.data.rows[i].typeName+'_有云';
                            }
                        }
                        this.reportDataDay = res.data.rows;
                    }
                }).catch(error => {
                });
            },
            //获取最新遥感监测周报数据,随后修改参数
            reportWeekList() {
                let pm = {
                    fileFormat: 'B',
                    fileSuffix: 'E',
                    fileType: 'D',
                    pageNum: 1,
                    pageSize: 6,
                    resourcesTypeId: '51',
                    isShow : 'Y'
                }
                reportData(pm).then(res => {
                    if (res.data.rows) {
                        this.reportWeek = res.data.rows;
                    }
                }).catch(error => {
                });
            },

            //月报 ,随后修改参数
            reportMonthList() {
                let pm = {
                    fileSuffix: 'E',
                    fileType: 'W',
                    pageNum: 1,
                    pageSize: 6,
                    resourcesTypeId: 1333,
                    isShow : 'Y'
                }
                reportData(pm).then(res => {
                    if (res.data.rows) {
                        this.reportMonth = res.data.rows;
                    }
                }).catch(error => {
                });
            },

            //获取热点网格数据
            pieDatasd(par) {
                gridList(par).then(res => {
                    let ydata = [];
                    let xdata = [];
                    if (res.data.pie.length > 0) {
                        res.data.pieTime =res.data.pieTime.substring(0,10)
                        let t = res.data.pieTime +"  "+ '热点网格数据';
                        for (let i = 0; i < res.data.pie.length; i++) {
                            let ob = {};
                            ob.name = res.data.pie[i].AREANAME;
                            ob.value = res.data.pie[i].COMPANYNUM;
                            ydata.push(ob);
                            xdata.push(res.data.pie[i].AREANAME);
                        }
                        let center = ["30%", "55%"];
                        this.pieChartInit(ydata, xdata, t, center);
                    } else {
                        ydata.push({name: '暂无数据', value: 0});
                        let t = '暂无数据';
                        let center = ["50%", "55%"];
                        this.pieChartInit(ydata, xdata, t, center);
                    }

                }).catch(error => {
                });
            },
            //初始化折现图
            pieChartInit(ydata, xdata, t, center) {
                let that = this;
                let pieBox = document.getElementById('pie-chart-box');
                let option = {
                    title: {
                        text: t,
                        textStyle: {
                            align: 'center',
                            color: '#fff',
                            fontSize: 16,
                        },
                        top: '5%',
                        left: 'center',
                    },
                    tooltip: {
                        trigger: 'item',
                        axisPointer: {
                            lineStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: 'rgba(0, 255, 233,0)'
                                    }, {
                                        offset: 0.5,
                                        color: 'rgba(255, 255, 255,1)',
                                    }, {
                                        offset: 1,
                                        color: 'rgba(0, 255, 233,0)'
                                    }],
                                    global: false
                                }
                            },
                        },
                    },
                    grid: {
                        top: '20%',
                        left: '5%',
                        right: '5%',
                        bottom: '15%',
                        // containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        axisLine: {
                            show: true
                        },
                        splitArea: {
                            // show: true,
                            color: '#f00',
                            lineStyle: {
                                color: '#f00'
                            },
                        },
                        axisLabel: {
                            color: '#fff'
                        },
                        splitLine: {
                            show: false
                        },
                        boundaryGap: false,
                        data: xdata,

                    }],

                    yAxis: [{
                        type: 'value',
                        min: 0,
                        // max: 140,
                        splitNumber: 4,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgba(255,255,255,0.1)'
                            }
                        },
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            show: false,
                            margin: 20,
                            textStyle: {
                                color: '#d1e6eb',

                            },
                        },
                        axisTick: {
                            show: false,
                        },
                    }],
                    series: [
                        {
                            name: '热点网格',
                            type: 'line',
                            // smooth: true, //是否平滑
                            showAllSymbol: true,
                            symbol: 'circle',
                            symbolSize: 20,
                            lineStyle: {
                                normal: {
                                    color: "#00ca95",
                                    shadowColor: 'rgba(0, 0, 0, .3)',
                                    shadowBlur: 0,
                                    shadowOffsetY: 5,
                                    shadowOffsetX: 5,
                                },
                            },
                            label: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: '#00ca95',
                                }
                            },

                            itemStyle: {
                                color: "#00ca95",
                                borderColor: "#fff",
                                borderWidth: 2,
                                shadowColor: 'rgba(0, 0, 0, .3)',
                                shadowBlur: 0,
                                shadowOffsetY: 2,
                                shadowOffsetX: 2,
                            },
                            areaStyle: {
                                normal: {
                                    color: new that.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(0,202,149,0.3)'
                                    },
                                        {
                                            offset: 1,
                                            color: 'rgba(0,202,149,0)'
                                        }
                                    ], false),
                                    shadowColor: 'rgba(0,202,149, 0.9)',
                                    shadowBlur: 20
                                }
                            },
                            data: ydata
                        }
                    ]
                };
                let pieChart = this.$echarts.init(pieBox);
                pieChart.setOption(option);
                window.addEventListener("resize", function () {
                    pieChart.resize();
                });
            },
            //国省控按钮事件
            btnChangeBar(btnType) {
                this.activeBtn = btnType;
                this.barData(btnType);
            },
            //热点网格切换事件
            rdwgbtnChangeBar(row){
                this.rdwgactive = row.text
                this.houtpointpar.timeType = row.timeType
                this.houtpointpar.product =  row.type
                if(row.text == 'rdwgPM25'){
                    this.houtpointpar.dataTime = this.timedata.HOTPOINT
                }else if(row.text == 'rdwgNO2'){
                    this.houtpointpar.dataTime = this.timedata.NO2HOTPOINTDAY
                }else if(row.text == 'rdwgHCHO'){
                    this.houtpointpar.dataTime = this.timedata.HCHOWEEK
                }

                this.pieDatasd(this.houtpointpar)
            },
            //获取国省控柱状图数据
            barData(btnType) {
                let pm = {
                    pageNum: 1,
                    pageSize: 7
                };
                if (btnType === 'G' || !btnType) {
                    //加载国控数据
                    statePmData(pm).then(res => {
                        this.barChartInit(res.rows);
                    }).catch(error => {

                    });
                } else {
                    //加载省控数据
                    provincePmData(pm).then(res => {
                        this.barChartInit(res.rows);
                    }).catch(error => {
                    });

                }
            },
            //初始化柱状图
            barChartInit(data) {
                let that = this;
                let borBox = document.getElementById('bar-chart-box');
                let option = {
                    color:['#35d17e','#57c5ec'],
                    legend: {
                        top: '10',
                        textStyle: {
                            color: '#fff',
                            fontSize: 14
                        },
                        data:['PM10','PM2.5'],
                        // formatter: function (name) {
                        //     if (name === 'DPM10') {
                        //         return 'PM10'
                        //     } else {
                        //         return 'PM2.5'
                        //     }
                        // }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            if (params.seriesName === 'DPM10' || params.seriesName === 'PM10') {
                                let data = params.data;
                                return '<div>' + data.DMONITORTIME + '&nbsp;PM10:&nbsp;' + data.DPM10 + 'mg/m3</div>'
                            } else {
                                let data = params.data;
                                return '<div>' + data.DMONITORTIME + '&nbsp;PM2.5:&nbsp;' + data.DPM25 + 'μg/m3</div>'
                            }
                        }
                    },
                    toolbox: {
                        top: '10',
                        right: '30',
                        feature: {
                            saveAsImage: {
                                pixelRatio: 2,
                                backgroundColor: '#01222F'
                            }
                        },
                        emphasis: {
                            iconStyle: {
                                textFill: "rgba(255, 2255, 255, 1)"
                            }
                        },
                        iconStyle: {
                            borderColor: "rgba(255, 2255, 255, 1)"
                        }
                    },
                    grid: {
                        top: '15%',
                        left: "2%",
                        right: "3%",
                        bottom: "5%",
                        containLabel: true
                    },
                    dataset: {
                        dimensions: ['DMONITORTIME', 'DPM10', 'DPM25'],
                        source: data
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            color: '#fff'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#3E5761'
                            }
                        },
                    },
                    yAxis: {
                        axisLabel: {
                            color: '#fff'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#3E5761'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: ['#3E5761'],
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    series: [
                        {
                            name:'PM10',
                            type: 'bar',
                            barWidth: '15%',//主子宽度
                            barGap: 1, //柱子之间间距
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        return new that.$echarts.graphic.LinearGradient(0, 0, 0, 1,
                                            [
                                                {
                                                    offset: 0,
                                                    color: '#35d17e'
                                                    //color: "#fccb05"// 0% 处的颜色
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#35d17e'
                                                    //color: "#f5804d" // 100% 处的颜色
                                                }
                                            ]
                                        )
                                    },
                                    barBorderRadius: 10,
                                }
                            },
                            label: {
                                show: true,
                                position: "top",
                                padding: 0,
                                textStyle: {
                                    fontSize: '12',
                                    color: '#fff'
                                }
                            },
                        },
                        {
                            name:'PM2.5',
                            type: 'bar',
                            barWidth: '15%',
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        return new that.$echarts.graphic.LinearGradient(0, 0, 0, 1,
                                            [
                                                {
                                                    offset: 0,
                                                    color: '#57c5ec'
                                                    //color: "#8bd46e"// 0% 处的颜色
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#57c5ec'
                                                    //color: "#09bcb7" // 100% 处的颜色
                                                }
                                            ]
                                        )
                                    },
                                    barBorderRadius: 10,
                                }
                            },
                            label: {
                                show: true,
                                position: "top",
                                padding: 0,
                                textStyle: {
                                    fontSize: '12',
                                    color: '#fff'
                                }
                            },
                        }
                    ]
                };
                let boxChart = this.$echarts.init(borBox);
                boxChart.setOption(option);
                window.addEventListener("resize", function () {
                    boxChart.resize();
                });
            },
            //更多日报
            moreClick() {
                this.$router.push({path: '/businessSys/monitoringSystem/report'});
            },
            //获取时间
            initDate(d) {
                let myDate = new Date(); //获取今天日期
                if (d) {
                    //获取上一个日期
                    myDate.setDate(myDate.getDate() - d);
                } else {
                    myDate.setDate(myDate.getDate());
                }
                let day = myDate.getDate();
                let mon = myDate.getMonth() + 1;
                let year = myDate.getFullYear();
                return year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
            },
            //图片放大
            picAmplify() {
                this.$viewer.show();
            },
            inited(viewer) {
                this.$viewer = viewer
            }
        }
    }
</script>

<style lang="scss" scoped>
.btn-change {
                    button:focus {
                        outline: none;
                    }

                    button {
                        height: 100%;
                        width: 120px;
                        background: #01222f;
                        border: 0;
                        color: #fff;
                        cursor: pointer;
                    }

                    button:hover {
                        background: #046F99;
                        color: #c1ebff;
                    }
                }

</style>

<style lang="scss" scoped>
    .home-box {
        display: flex;
        flex: 1;
        height: 100%;
        width: 100%;
        .title-box {
            width: 100%;
            height: 55px;
            border-bottom: 1px solid #036db9;
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            .icon-box {
                position: relative;
                display: flex;
                align-items: center;
                width: 160px;
                color: #fff;
                .split-line {
                    margin: 0 5px;
                }
                .title-color {
                    color: #ade909;
                    font-size: 20px;
                }
            }

            .icon-box:before {
                content: "";
                position: absolute;
                right: 0;
                width: 1px;
                height: 140%;
                //border-right: 1px solid #036db9;
                transform: rotate(45deg);
            }
        }

        .home-left-box {
            //flex: 0 0 40%;
            width: 31%;
            height: 100%;
            display: flex;
            flex-flow: column;
            padding-right: 20px;

            .left-top {
                //flex: 1;
                width: 100%;
                height: 48.777%;
                margin-bottom: 20px;
                border: 1px solid #036db9;
                background: #01222F;

                .swiper-wrap {
                    height: 100%;

                    img {
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                    }
                }
            }

            .right-bottom {
                flex: 1;
                height: 50%;
                flex-flow: column;
                border: 1px solid #036db9;
                background: #01222F;
                display: flex;

                .pie-chart-box {
                    flex: 1;
                    height: 100%;
                }
            }

        }

        .home-right-box {
            flex: 0 0 69%;
            width: 69%;
            height: 100%;
            display: flex;
            flex-flow: column;

            .right-top {
                //flex: 1;
                width: 100%;
                height: 48.777777%;
                margin-bottom: 20px;
                display: flex;
                border: 1px solid #036db9;
                background: #01222F;

                .report-item-box {
                    display: flex;
                    flex: 1;
                    flex-flow: column;
                    width: 100%;
                    height: 100%;

                    .title-box {
                        border: 0;

                        .icon-box {
                            padding-left: 8px;
                            width: 53%;
                            margin: 10px 0;
                            background: #023C52;
                        }

                        .icon-box:after {
                            content: "";
                            position: absolute;
                            right: 0;
                            bottom: 0;
                            width: 0;
                            height: 0;
                            border-right: 10px solid #01222f;
                            border-top: 17px solid transparent;
                            border-bottom: 16px solid transparent;
                        }
                    }

                    .more-box {
                        display: flex;
                        align-items: center;
                        color: #fff;
                        cursor: pointer;
                    }

                    .more-box:hover {
                        color: #ade909;
                    }

                    .list-box {
                        //flex: 1;
                        height: calc(100% - 70px);
                        overflow: hidden;

                        ul {
                            list-style-type: none;
                            margin: 0 20px;
                            padding: 0;

                            li {
                                color: #fff;
                                padding: 15px 0;
                                border-bottom: 1px solid #2C4853;

                                .file-icon {
                                    color: #036db9;
                                    margin: 0 10px 0 20px;
                                }

                                .report-date {
                                    float: right;
                                }
                            }
                        }
                    }
                }
            }

            .left-bottom {
                flex: 1;
                height: 50%;
                display: flex;
                flex-flow: column;
                border: 1px solid #036db9;
                background: #01222F;
                display: flex;

                .btn-change {
                    button:focus {
                        outline: none;
                    }

                    button {
                        height: 100%;
                        width: 120px;
                        background: #01222f;
                        border: 0;
                        color: #fff;
                        cursor: pointer;
                    }

                    button:hover {
                        background: #046F99;
                        color: #c1ebff;
                    }
                }

                .bar-chart-box {
                    flex: 1;
                    height: 100%;
                }
            }
        }
        .viewer{
            display: none;
        }
    }

    @media screen and (max-width: 1600px) {
        .home-box .title-box .icon-box .title-color {
            font-size: 14px;
        }
        .home-box .home-right-box .right-top .report-item-box .list-box ul li {
            font-size: 14px;
        }
    }

    @media screen and (max-width: 1440px) {
        .home-box .title-box .icon-box .title-color {
            font-size: 12px;
        }
        .home-box .home-right-box .right-top .report-item-box .list-box ul li {
            font-size: 12px;
        }
    }

</style>
<style scoped>
.swiper-slide{
    display: flex;
    justify-content: center;
}
</style>


