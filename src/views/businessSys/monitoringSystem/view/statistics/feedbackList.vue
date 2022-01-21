<template>
    <!--反馈信息列表-->
    <div class="right-box">
        <div class="search-box">
            <div class="search-wrap">
                <el-form :model="searchForm" ref="searchForm">
                    <el-col :span="5">
                        <el-form-item label="时间:" prop="dateTime" label-width="50px">
                            <el-date-picker style="width: 100%"
                                v-model="searchForm.dateTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
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
                    <el-col :span="5">
                        <el-form-item label="热点区域:" label-width="90px">
                            <el-select v-model="searchForm.district" placeholder="全部" style="width: 100%">
                                <el-option
                                    label="所有"
                                    value="">
                                </el-option>
                                <el-option
                                    v-for="item in regionData"
                                    :key="item.AREAID"
                                    :label="item.AREANAME"
                                    :value="item.AREAID">
                                </el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="反馈状态:" label-width="90px">
                            <el-select v-model="searchForm.feedbackStatus" placeholder="请选择" style="width: 100%">
                                <el-option
                                    v-for="item in polluteType"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form>
            </div>
            <div class="search-btn">
                <button @click="searchBtn">查询</button>
                <button @click="downData">下载</button>
            </div>
        </div>
        <div class="bottom-box">
            <div class="table-wrap">
                <el-table :data="tableData" style="width: 100%;">
                    <el-table-column
                        align="center"
                        prop="num"
                        label="网格编号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="areaName"
                        label="所属区县"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="longitude"
                        label="经度">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="latitude"
                        label="纬度">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="fdAbnormalreason"
                        label="异常原因">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="fdRegulmeasures"
                        label="解决措施">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="createDate"
                        label="反馈时间">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="nickName"
                        label="反馈人">
                    </el-table-column>
                </el-table>
            </div>
            <div class="page-wrap">
                <pagination
                    v-show="true"
                    :total="total"
                    :page.sync="searchForm.pageNum"
                    :limit.sync="searchForm.pageSize"
                    @pagination="changePage"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import {areaList} from "@/api/businessSys/monitoringSystem/spaceDisplay";
    import {feedBackList,exportFeedBack} from "@/api/businessSys/monitoringSystem/statistics";
    export default {
        name: "feedbackList",
        data(){
            return{
                total:0,
                searchForm:{
                    dateTime:'',
                    district:'',
                    feedbackStatus:'',
                    pageNum: 1,
                    pageSize: 10,
                    productType:'B',
                },
                polluteType: [
                    {name:'全部',value:''},
                    {name: '已反馈', value: 'Y'},
                    {name: '未反馈', value: 'N'}
                ],
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
                    },
                   
                ],
                //下拉框地区数据
                regionData: [],
                tableData:[]
            }
        },
        mounted() {
            this.$nextTick(() => {
                //获取地区下拉框数据
                this.regionSelectData();
                this.initDate();
                this.searchBtn();
            });
        },
        methods:{
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
            //搜索按钮
            searchBtn(){
                if(this.searchForm.dateTime && this.searchForm.dateTime !=''){
                    this.searchForm.pageNum = 1;
                    this.searchForm.pageSize = 10;
                    this.getFeedBackList();
                }else{
                    this.$message({
                        message: '请选择搜索时间',
                        type: 'warning'
                    });
                }
                
            },
            //获取列表数据
            getFeedBackList(){
                let that = this;
                feedBackList(this.searchForm).then(res => {
                    if(res.code === 200 && res.data){
                        that.total = res.data.total;
                        that.tableData = res.data.rows;
                    }
                }).catch(error => {
                })
            },
            //分页
            changePage(val){
                this.searchForm.pageNum = val.page;
                this.searchForm.pageSize = val.limit;
                this.getFeedBackList();
            },
            //下载
            downData(){
                delete this.searchForm.pageNum;
                delete this.searchForm.pageSize;
                exportFeedBack(this.searchForm).then(response =>{
                    this.download(response.msg);
                });
            },
            //初始化时间轴日期
            initDate() {
                let myDate = new Date(); //获取今天日期
                myDate.setDate(myDate.getDate());
                let day = myDate.getDate();
                let mon = myDate.getMonth() + 1;
                let year = myDate.getFullYear();
                var time=(new Date).getTime()-24*60*60*1000;
                var yesterday=new Date(time);
                yesterday=year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" +(yesterday.getDate()> 9 ? (yesterday.getDate()) : "0" + (yesterday.getDate()));
                this.searchForm.dateTime = yesterday;
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

        .bottom-box {
            width: 100%;
            height: 83%;
            border: 1px solid #036db9;
            background: #01222f;
            display: flex;
            flex-flow: column;
            .table-wrap{
                flex: 1;
                height: calc(100% - 50px);
                /deep/.el-table{
                    height: 100%;
                    .el-table__body-wrapper{
                        height: calc(100% - 45px);
                        overflow-y: auto;
                    }
                }
            }
            .page-wrap{
                height: 50px;
                .pagination-container{
                    margin: 0;
                    height: 100%;
                    background: #01222f;
                    /deep/.el-pagination{
                        padding: 2px 20px;
                    }
                }
            }
        }
    }
</style>
