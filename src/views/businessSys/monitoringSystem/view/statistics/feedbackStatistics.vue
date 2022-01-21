<template>
    <!--反馈信息统计-->
    <div class="right-box">
        <div class="search-box">
            <div class="search-wrap">
                <el-form :model="searchForm" ref="searchForm">
                    <el-col :span="8">
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
                        <el-form-item label="热点区域:" label-width="90px">
                            <el-select v-model="searchForm.district" placeholder="全部" style="width: 100%">
                                <el-option
                                    v-for="item in regionData"
                                    :key="item.AREAID"
                                    :label="item.AREANAME"
                                    :value="item.AREAID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="产品类型:" label-width="90px">
                            <el-select v-model="searchForm.productType" placeholder="全部" style="width: 100%">
                                <el-option
                                    v-for="item in productTypelist"
                                    :key="item.key"
                                    :label="item.title"
                                    :value="item.value">
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
            <div id="bar-chart-box" class="bar-chart-box" v-if="hasechart">
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
    import {fbStatistics} from "@/api/businessSys/monitoringSystem/statistics";

    export default {
        name: "feedbackStatistics",
        data() {
            return {
                searchForm: {
                    dateValue: [],
                    district: '',
                    productType:'B'
                },
                //下拉框地区数据
                regionData: [],
                productTypelist:[
                    {
                        title:'PM10',
                        value:'A',
                        key:'PM10'
                    },
                    {
                        title:'PM2.5',
                        value:'B',
                        key:'PM2.5'
                    },
                    {
                        title:'NO2',
                        value:'NO2',
                        key:'NO2'
                    },
                    {
                        title:'HCHO',
                        value:'HCHO',
                        key:'HCHO'
                    }
                ],
                hasechart:true,
                mychart1:null,
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
            searchBtn() {
                if (this.searchForm.dateValue && this.searchForm.dateValue.length > 0) {
                    let that = this;
                    let pm = {
                        startDate: that.searchForm.dateValue[0],
                        endDate: that.searchForm.dateValue[1],
                        district: that.searchForm.district,
                        productType:that.searchForm.productType
                    }
                    fbStatistics(pm).then(res => {
                        if(this.mychart1){
                            this.mychart1.dispose()
                        }
                        if(res.msg == '操作成功' && res.data.length !=0){
                             that.hasechart = true
                            let xdata = [];
                            let ydata = [];
                            for (let i = 0; i < res.data.length; i++) {
                                xdata.push(res.data[i].DATETIME);
                                if(res.data[i].PERCENT){
                                    ydata.push(res.data[i].PERCENT);
                                }else{
                                    ydata.push(0) 
                                }
                                
                            }
                           that.$nextTick(()=>{
                                that.initBarChart(xdata, ydata);
                           })
                        }else{
                            that.hasechart = false
                        }
                        
                        
                    }).catch(error => {
                        that.hasechart = false
                    });
                }else{
                    this.$message({
                        message: '请选择搜索的时间范围',
                        type: 'warning'
                    });
                }
            },
            //初始化柱状图
            initBarChart(xdata, ydata) {
                let that = this;
                let borBox = document.getElementById('bar-chart-box');
                let option = {
                    color:['#57c5ec'],
                    legend: {
                        top: '10',
                        textStyle: {
                            color: '#fff'
                        },
                        data: ['反馈率']
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter:'{b}: {c}%'
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
                    xAxis: {
                        data: xdata,
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
                            name:'反馈率',
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
                            data: ydata
                        }
                    ]
                };
                that.mychart1 = this.$echarts.init(borBox);
                //添加y轴默认刻度值
                if (ydata.length === 0) {
                    option.yAxis.max = 50;
                    option.yAxis.min = 0
                } else {
                    option.yAxis.max = null;
                }
                that.mychart1.setOption(option);
                window.addEventListener("resize", function () {
                    boxChart.resize();
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
            }
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
