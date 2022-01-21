<!--报告-->
<template>
    <div id="report-wrap">
        <div class="search-box">
            <div class="search-wrap">
                <el-form :model="searchForm" ref="searchForm">
                    <el-col :span="8">
                        <el-form-item label="报告类型:" label-width="80px">
                            <el-select v-model="searchForm.resourcesTypeId" placeholder="全部" style="width: 100%">
                                <el-option
                                    v-for="(item,index) in reportData"
                                    :key="index+'jdakd'"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
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

                    <el-col :span="8">
                        <el-form-item label="文件类型:" prop="filetype" label-width="90px">
                            <el-radio v-model="radio" label="E">PDF类型</el-radio>
                            <el-radio v-model="radio" label="D">word类型</el-radio>
                        </el-form-item>
                    </el-col>
                </el-form>
            </div>
            <div class="search-btn">
                <button @click="searchBtn">查询</button>
            </div>
        </div>
        <div class="bottom-box">
            <div class="table-wrap">
                <el-table :data="tableData" style="width: 100%;">
                    <el-table-column
                        align="center"
                        prop="ROW_ID"
                        label="序号"
                        width="180">
                            <template slot-scope="scope">
                                <span>{{scope.row.ROW_ID}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="resourcesName"
                        label="报告名称"
                        width="480">
                        <template slot-scope="scope">
                                <span>{{scope.row.resourcesName}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="typeName"
                        label="报告类型"
                        width="380">
                            <template slot-scope="scope">
                                <span>{{scope.row.typeName}}</span>
                            </template>
                    </el-table-column>
                 
                    <el-table-column
                        align="center"
                        prop="releaseDate"
                        label="发布时间">
                        <template slot-scope="scope">
                                <span>{{scope.row.releaseDate}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                             <el-button
                             v-if="isyulan"
                                size="mini"
                                type="primary"
                                class="el-icon-view"
                                @click='previewReport(scope.row)'>&nbsp;预览
                            </el-button>
                             <el-button
                             v-else
                                size="mini"
                                type="primary"
                                class="el-icon-download"
                                @click='previewReport(scope.row)'>&nbsp;下载
                            </el-button>
                            <!-- <el-button type="success" size="mini" @click="auditclick(scope.row)" v-if="isyulan">审核</el-button> -->
                            <!-- <el-button type="success" size="mini" :disabled="scope.row.state=='2'?true:false"
                                           @click="passReport(scope.row)">通过
                            </el-button>
                             <el-button type="danger" size="mini" :disabled="scope.row.state=='2'?true:false"
                                           @click="bo(scope.row)">驳回
                                </el-button> -->
                        </template>
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
    import {reportData} from "@/api/businessSys/monitoringSystem/home";
    export default {
        name: "report",
        components:{
        },
        data() {
            return {
                radio:'D',
                total: 0,
                isyulan:true,
                searchForm: {
                    resourcesTypeId: 51,
                    dateValue: '',
                    pageNum: 1,
                    pageSize: 10,
                },
                reportData: [
                    {id: 51, name: 'PM2.5空气质量遥感监测日报'},
                    {id: 56, name: '空气质量遥感监测周报'},
                    {id: 63, name: '空气质量遥感监测月报'},
                    {id: 126, name: '空气质量遥感监测季报'},
                    {id: 127, name: '空气质量遥感监测年报'},
                    {id: 140, name: '建筑裸地分布报告'},
                    {id: 40, name: '沙尘遥感监测图 '},
                    {id: 40, name: '沙尘遥感监测图 '},
                    {id: 1331, name: 'NO2-差值空气质量遥感监测日报'},
                    {id: 1332, name: 'NO2-遥感空气质量遥感监测日报'},
                    {id: 1333, name: 'HCHO空气质量遥感监测周报'},
                    // {id: 8, name: '空气质量六项污染物日均浓度图 '},
                    // {id: 9, name: '激光雷达监测报告 '},
                ],
                tableData: []
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.initDate(7);
                this.searchBtn();
            });
        },
        methods: {
            //审核通过事件
            auditclick(row){
                
            },
            //获取搜索条件
            searchParams(p) {
                let pm = {};
                if (!p) {
                    pm.pageNum = 1;
                    pm.pageSize = 10;
                } else {
                    pm.pageNum = p.page;
                    pm.pageSize = p.limit;
                }
                if (this.searchForm.dateValue) {
                    pm.startDate = this.searchForm.dateValue[0];
                    pm.endDate = this.searchForm.dateValue[1];
                }
                pm.resourcesTypeId = this.searchForm.resourcesTypeId;
                // pm.fileSuffix = 'E';
                pm.fileSuffix = this.radio
                pm.isShow = 'Y'
                return pm;
            },
            //搜索
            searchBtn() {
                let pm = this.searchParams();
                this.reportDataList(pm);
            },
            //获取报告数据
            reportDataList(pm) {

                let that = this;
                reportData(pm).then(res => {
                    let hasisshow = []
                    if (res.code === 200 && res.data) {
                        if(pm.fileSuffix=='E'){
                            this.isyulan = true
                        }else{
                            this.isyulan = false
                        }
                        for(var i=0;i<res.data.rows.length;i++){
                            res.data.rows[i].state=2
                        }
                        that.total = res.data.total;
                        that.tableData = res.data.rows;
                    }
                }).catch(error => {
                })
            },
            //分页
            changePage(val) {
                let par = this.searchParams(val);    
                this.reportDataList(par);
            },
            //预览
            previewReport(row) {
                let path = process.env.VUE_APP_BASE_API + process.env.VUE_APP_REPORT_PATH + row.resourcesUrl;
                window.open(path);
            },
            //初始化日期
            initDate(d) {
                this.searchForm.dateValue = [];
                let myDate = new Date(); //获取今天日期
                let day = myDate.getDate();
                let mon = myDate.getMonth() + 1;
                let year = myDate.getFullYear();
                let starttime = year + '-' + '01-01'
                let endtime = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day)
                this.searchForm.dateValue = [starttime,endtime]
                // myDate.setDate(myDate.getDate() - d);
                // for (let i = 0; i < 2; i++) {
                //     let day = myDate.getDate();
                //     let mon = myDate.getMonth() + 1;
                //     let year = myDate.getFullYear();
                //     let dateTemp = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
                //     this.searchForm.dateValue.push(dateTemp);
                //     myDate.setDate(myDate.getDate() + d);
                // }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #report-wrap {
        display: flex;
        flex: 1;
        width: 100%;
        height: 100%;
        flex-flow: column;

        .search-box {
            width: 100%;
            //height: 100px;
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

            .table-wrap {
                flex: 1;
                height: calc(100% - 50px);

                /deep/ .el-table {
                    height: 100%;

                    .el-table__body-wrapper {
                        height: calc(100% - 45px);
                        overflow-y: auto;
                    }
                }
                .preview-btn{
                    background: #046F99;
                    cursor: pointer;
                    color: #fff;
                    border: 0;
                    padding: 7px 10px;
                    border-radius: 5px;
                }
            }

            .page-wrap {
                height: 50px;

                .pagination-container {
                    margin: 0;
                    height: 100%;
                    background: #01222f;

                    /deep/ .el-pagination {
                        padding: 2px 20px;
                    }
                }
            }
        }
    }
   #report-wrap /deep/ .el-dialog .el-dialog__body{
       overflow: auto !important;
   }
</style>
