<template>
    <div class="reportaudit" id="reportaudit">
        <div class="search-box">
            <div class="search-wrap">
                       <el-form :model="searchForm" ref="searchForm">
                    <el-col :span="8">
                        <el-form-item label="报告类型:" label-width="80px">
                            <el-select v-model="searchForm.resourcesTypeId" placeholder="全部" style="width: 100%">
                                <el-option
                                    v-for="item in reportData"
                                    :key="item.id"
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

                    <!-- <el-col :span="8">
                        <el-form-item label="文件类型:" prop="filetype" label-width="90px">
                            <el-radio v-model="radio" label="E">PDF类型</el-radio>
                            <el-radio v-model="radio" label="D">word类型</el-radio>
                        </el-form-item>
                    </el-col> -->
                </el-form>
            </div>
            <div class="search-btn">
                <el-button type="primary" @click="searchBtn" size="mini">查询</el-button>
                <el-button type="info" @click="searchFrom">重置</el-button>
                <!-- <button ></button> -->
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
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="typeName"
                        label="报告名称"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="releaseDate"
                        label="发布时间">
                    </el-table-column>
                     <el-table-column label="审核状态" prop="state" align="center"  width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.isShow=='N'" style="color: #ebb563">待审核</span>
                    <span v-else style="color: #67C23A">审核通过</span>
                </template>
            </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="mini" @click="auditclick(scope.row)" :disabled="scope.row.isShow !=='N'" v-if="scope.row.isShow =='N'">审核</el-button>
                            <el-button type="danger" size="mini" @click="cancelclick(scope.row)" v-if="scope.row.isShow !=='N'">取消</el-button>
                            <el-button type="primary" size="mini" @click="fileDowod(scope.row)">重新上传</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="page-wrap">
                <Pagination
                    v-show="true"
                    :total="total"
                    layout="prev, pager, next"
                    :page.sync="searchForm.pageNum"
                    :limit.sync="searchForm.pageSize"
                    @pagination="changePage"
                />
            </div>
        </div>
        
        <el-dialog
            :title="pdfname"
            :visible.sync="isshowPdf"
            width="80%"
            @close='dialogClose'
            @open='dialogOpen'
            :append-to-body='isappendbody'
            center>
            <Pdfmoud :pdfurl='pdfurl' @isshowPdftype='isshowPdftype' :downobj='downobj' :haspass='haspass' ref="pdfmoudle"/>
        </el-dialog>
        <Filesuploadpdf ref="PDFFilesupload" :upload='upload'/>
    </div>
</template>

<script>
    import {reportData,upateOKByWordAndPdf} from "@/api/businessSys/monitoringSystem/home";
    import Pdfmoud from './commond/pdfmoud'
    import Filesuploadpdf from './commond/Filesuploadpdf'
    import { getToken } from "@/utils/auth";
    import pdf from 'vue-pdf'
    export default {
        components:{
            Pdfmoud,
            Filesuploadpdf
        },
        data(){
            return{
                radio:'E',
                total: 0,
                isshowPdf:false,
                isyulan:true,
                isappendbody:false,
                downobj:null,
                haspass:true,
                pdfname:"",
                searchForm: {
                    resourcesTypeId: 51,
                    dateValue: '',
                    pageNum: 1,
                    pageSize: 10,
                },
                 upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url:
          process.env.VUE_APP_BASE_API +
          "api/pm/upateWordAndPdf",
        //上传传的参数
        data: {
            
        }
      },
        reportData: [
                    {id:1331,name:'NO2-日报-插值-PDF'},
                    {id:1333,name:'HCHO-周报-遥感-PDF'},
                    {id:1332,name:'NO2-日报-遥感-PDF'},
                    {id: 51, name: '空气质量遥感监测日报'},
                    {id: 56, name: '空气质量遥感监测周报'},
                    {id: 63, name: '空气质量遥感监测月报'},
                    {id: 126, name: '空气质量遥感监测季报'},
                    {id: 127, name: '空气质量遥感监测年报'},
                    {id: 140, name: '建筑裸地分布报告'},
                    {id: 40, name: '沙尘遥感监测图 '},
                    
                    // {id: 8, name: '空气质量六项污染物日均浓度图 '},
                    // {id: 9, name: '激光雷达监测报告 '},
                ],
                tableData:[],
                pdfurl:''
                }
            },
            mounted() {
            this.$nextTick(() => {
                this.initDate(7);
                this.searchBtn();
            });
        },
        methods: {
            cancelclick(row){
                    let par = {
                    resourcesName : row.resourcesName
                }
                upateOKByWordAndPdf(par).then((res)=>{
                    if(res.msg =='操作成功'){
                        let pb={
                        page :this.searchForm.pageNum,
                        limit : this.searchForm.pageSize,
                        };
                        
                        let pm = this.searchParams(pb);
                        this.reportDataList(pm);
                    }
                })
            },
            //审核通过事件
            auditclick(row){
            
                this.downobj = row
                this.pdfname = row.resourcesName+'预览'
                this.isshowPdf = true
                // pdf.createLoadingTask(this.pdfurl)
                this.pdfurl = process.env.VUE_APP_BASE_API + process.env.VUE_APP_REPORT_PATH + row.resourcesUrl
                this.$nextTick(()=>{
                    this.$refs.pdfmoudle.loadPdfHandler(1)
                })
            },
            dialogOpen(){
                if(this.$refs.pdfmoudle && this.$refs.pdfmoudle.pdfurl != ''){
                    this.$refs.pdfmoudle.pdfurl = this.pdfurl
                }
            },
            dialogClose(){
               this.pdfurl = ''
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
                return pm;
            },
            //搜索
            searchBtn() {
                let pm = this.searchParams();
                this.reportDataList(pm);
            },
            searchFrom(){
                this.searchForm={
                    resourcesTypeId: 51,
                    dateValue: '',
                    pageNum: 1,
                    pageSize: 10,
                },
                this.initDate(7);
                this.searchBtn()
            },
            fileDowod(row){
                let par={
                title:"文件上传"
                    }
                this.upload.data.resourcesName =row.resourcesName 
                this.$refs.PDFFilesupload.Importclick(par)
            },
            //获取报告数据
            reportDataList(pm) {
                let that = this;
                reportData(pm).then(res => {
                    if (res.code === 200 && res.data) {
                        if(pm.fileSuffix=='E'){
                            this.isyulan = true
                        }else{
                            this.isyulan = false
                        }
                        for(var i=0;i<res.data.rows.length;i++){
                            res.data.rows[i].state=2
                            //查找是否标题是否有'无'文字
                            if(pm.resourcesTypeId == 51){
                                 let w = res.data.rows[i].resourcesName.lastIndexOf('无');
                            if(w > -1){
                                res.data.rows[i].typeName = res.data.rows[i].typeName+'_无云';
                            }else{
                                res.data.rows[i].typeName = res.data.rows[i].typeName+'_有云';
                            }
                            }
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
            isshowPdftype(){
                this.isshowPdf = false
                let pb={
                        page :this.searchForm.pageNum,
                        limit : this.searchForm.pageSize,
                        };
                let pm = this.searchParams(pb);
                this.reportDataList(pm);
            },
            //初始化日期
            initDate(d) {
                this.searchForm.dateValue = [];
                let myDate = new Date(); //获取今天日期
                myDate.setDate(myDate.getDate() - d);
                for (let i = 0; i < 2; i++) {
                    let day = myDate.getDate();
                   
                    let mon = myDate.getMonth() + 1;
                    let year = myDate.getFullYear();
                     let oneyear = ''
                     let dateTemp = ''
                     if(i==0){
                        oneyear = year + '-01-01'
                        this.searchForm.dateValue.push(oneyear)
                     }else{
                        dateTemp = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
                          this.searchForm.dateValue.push(dateTemp);
                     }
                    myDate.setDate(myDate.getDate() + d);
                }
            }
        }
}
</script>

<style lang="scss" scoped>
    #reportaudit {
        display: flex;
        flex: 1;
        width: 100%;
        height: 100%;
        flex-flow: column;

        .search-box {
            width: 100%;
            //height: 100px;
            margin-bottom: 20px;
            // border: 1px solid #036db9;
            // background: #01222f;
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
                    // background: #046F99;
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
            // border: 1px solid #036db9;
            // background: #01222f;
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
                    // background: #046F99;
                    cursor: pointer;
                    // color: #fff;
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
                    // background: #01222f;

                    /deep/ .el-pagination {
                        padding: 2px 20px;
                    }
                }
            }
        }
    }
   #reportaudit /deep/ .el-dialog .el-dialog__body{
       overflow: auto !important;
       height: 800px;
   }
</style>