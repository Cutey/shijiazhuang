<template>
    <!--对比分析(空间)-->
    <div class="right-box">
        <div class="search-box">
            <div class="search-wrap">
                <el-form :model="searchForm" ref="searchForm">
                    <el-col :span="6">
                        <el-form-item label="时间:" prop="dateValue" label-width="60px">
                            <el-date-picker v-model="searchForm.dateValue"
                                            type="daterange"
                                            value-format="yyyy-MM-dd"
                                            range-separator="—"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="污染物:" label-width="75px">
                            <el-select v-model="searchForm.type" placeholder="请选择" style="width: 100%">
                                <el-option
                                    v-for="item in polluteType"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="时间精度:" label-width="90px">
                            <el-select v-model="searchForm.dateType" placeholder="请选择" style="width: 100%">
                                <el-option
                                    v-for="item in dateArray"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="区域:" label-width="60px">
                            <el-select v-model="searchForm.areaName" placeholder="全部" style="width: 100%">
                                <el-option
                                    v-for="item in regionData"
                                    :key="item.AREAID"
                                    :label="item.AREANAME"
                                    :value="item.AREAID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form>
            </div>
            <div class="search-btn">
                <button @click="searchBtn">查询</button>
            </div>
        </div>
        <div class="chart-box">
            <div id="bar-chart-box" class="bar-chart-box" v-if="showecharts">
                <!--柱状图标-->
            </div>

            <div class="bar-chart-box" v-else style="height: 100%;width: 100%;">
                <span style="height: 100%;width: 100%;display: flex;align-items: center;justify-content: center;font-size:26px;color:#fff">暂无数据</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {areaList} from "@/api/businessSys/monitoringSystem/spaceDisplay";
    import {timePmData} from "@/api/businessSys/monitoringSystem/statistics";
    export default {
        name: "timeDataContrast",
        data() {
            return {
                searchForm: {
                    dateValue: [],
                    type: 'PM10',
                    areaName: '',
                    dateType:'D'
                },
                polluteType: [
                    {name: 'PM10', value: 'PM10'},
                    {name: 'PM2.5', value: 'PM25'}
                ],
                //下拉框地区数据
                regionData: [],
                dateArray:[
                    {name:'日',value:'D'},
                    {name:'周',value:'W'},
                    {name:'月',value:'M'},
                    {name:'年',value:'Y'}
                ],
                showecharts:true,
                mychart:null,
            }
        },
        mounted() {
            this.$nextTick(() => {
                //获取地区下拉框数据
                this.regionSelectData();
                this.initDate(7);
                this.searchBtn();
            });
        },
        methods: {
            //获取地区下拉框数据
            regionSelectData() {
                areaList({areaId: 130100}).then(res => {
                    if (res.data.length > 0) {
                        for (let i = 0; i < res.data.length; i++) {
                            this.regionData.push(res.data[i])
                        }
                    }
                }).catch(error => {
                });
            },
            //搜索按钮事件
            searchBtn(){
                if(this.searchForm.dateValue && this.searchForm.dateValue.length > 0){
                    let that = this;
                    let pm = {
                        startDate:that.searchForm.dateValue[0],
                        endDate:that.searchForm.dateValue[1],
                        type: that.searchForm.type,
                        areaName: [that.searchForm.areaName]+'',
                        dateType:that.searchForm.dateType
                    }
                    timePmData(pm).then(res =>{
                        if(this.mychart){
                            this.mychart.dispose()
                        }
                        if(res.msg == '操作成功' && res.data && res.data.length !=0){
                            that.showecharts = true
                            that.$nextTick(()=>{
                                that.initBarChart(res.data,that.searchForm.type);
                            })
                        }else{
                            that.showecharts = false
                        }
                        
                    }).catch(error =>{
                        that.showecharts = false
                    });

                }else{
                    this.$message({
                        message: '请选择搜索的时间范围',
                        type: 'warning'
                    });
                }
            },
            //初始化柱状图
            initBarChart(data,type){
                let that = this;
                let borBox = document.getElementById('bar-chart-box');
                let option = {
                    color:['#35d17e','#57c5ec'],
                    legend: {
                        top: '10',
                        textStyle: {
                            color: '#fff'
                        },
                        formatter: function (name) {
                            if (name === 'DPM') {
                                return '地面监测数据'
                            } else {
                                return '遥感监测数据'
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            if(type === 'PM10'){
                                let data = params.data.DPM || params.data.WPM;
                                return '<div>' + params.data.DMONITORTIME + '&nbsp;' + data + 'mg/m3</div>'
                            }else{
                                let data = params.data.DPM || params.data.WPM;
                                return '<div>' + params.data.DMONITORTIME + '&nbsp;' + data + 'μg/m3</div>'
                            }
                        }
                    },
                    toolbox:{
                        top:'10',
                        right:'30',
                        feature:{
                            saveAsImage:{
                                pixelRatio: 2
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
                        dimensions: ['DMONITORTIME', 'DPM', 'WPM'],
                        source: data
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            color: '#fff',
                            interval: 0
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
                that.mychart = this.$echarts.init(borBox);
                //添加y轴默认刻度值
                if(data.length === 0){
                    option.yAxis.max = 50;
                    option.yAxis.min = 0
                }else{
                    option.yAxis.max = null;
                }
                that.mychart.setOption(option);
                window.addEventListener("resize", function () {
                    that.mychart.resize();
                });
            },
            //初始化时间轴日期
            initDate(d) {
                this.searchForm.dateValue = [];
                let myDate = new Date(); //获取今天日期
                myDate.setDate(myDate.getDate() - d);
                for (let i = 0; i < 2; i++) {
                    let day = myDate.getDate();
                    let mon = myDate.getMonth() + 1;
                    let year = myDate.getFullYear();
                    let dateTemp = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
                    this.searchForm.dateValue.push(dateTemp);
                    myDate.setDate(myDate.getDate() + d);
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .right-box {
        display: flex;
        flex: 1;
        height: 100%;
        flex-flow: column;

        .search-box {
            width: 100%;
            //height: 150px;
            margin-bottom: 20px;
            border: 1px solid #036db9;
            background: #01222f;
            display: flex;
            padding: 15px;
            align-items: center;

            .search-wrap {
                flex: 1;
                padding-top: 24px;
            }

            .search-btn {
                margin-right: 10px;
                button {
                    background: #046F99;
                    cursor: pointer;
                    color: #fff;
                    border: 0;
                    padding: 10px 15px;
                    margin-left: 15px;
                }
            }
        }

        .chart-box {
            width: 100%;
            height: 100%;
            border: 1px solid #036db9;
            background: #01222f;
            .bar-chart-box {
                flex: 1;
                height: 100%;
            }
        }
    }
</style>
