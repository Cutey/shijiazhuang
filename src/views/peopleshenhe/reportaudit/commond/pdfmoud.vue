<template>
    <div class="pdf" v-show="fileType === 'pdf'">
    <div class="arrow">
        <div>
             <el-button type="info"  @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">上一页</el-button>
    {{currentPage}} / {{pageCount}}
    <!--下一页 -->
    <el-button type="info"  @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pageCount}">下一页</el-button>
        </div>

        <div>
            <el-button type="success"  @click="passfile" v-if="haspass">通过</el-button>
            <el-button type="primary"  @click="fileDown">下载文件</el-button>
        </div>
    </div>
    <!-- 自己引入就可以使用,这里我的需求是做了分页功能,如果不需要分页功能,只要src就可以了 -->
    <pdf
      :src="pdfurl"
      :page="currentPage" 
      @num-pages="pageCount=$event"
      @page-loaded="currentPage=$event"
      @loaded="loadPdfHandler"> 
    </pdf>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import axios from 'axios'
import {reportData,upateOKByWordAndPdf} from "@/api/businessSys/monitoringSystem/home";
export default {
    components: {pdf},
    props:{
        pdfurl:{
            type: String,
            default: ''
        },
        downobj:{
            type:Object,
            default:null
        },
        haspass:{
          type:Boolean,
          default:true
        }
    },
    data(){
        return{
            currentPage: 1, // pdf文件页码
            pageCount: 0, // pdf文件总页数
            fileType: 'pdf', // 文件类型
    　　　　 src: '', // pdf文件地址
            fileurl:'',
            hasfileurl:false
        }
    },
      beforeDestroy() {

  },
    created(){
　　　　// 有时PDF文件地址会出现跨域的情况,这里最好处理一下
        // this.pdfurl = pdf.createLoadingTask(this.pdfurl) 
　　},
  mounted(){
      // this.pdfurl = pdf.createLoadingTask(this.pdfurl) 
  },
    methods: {
    fileDown(){
        let par = {
            resourcesName : this.downobj.resourcesName
        }
        reportData(par).then((res)=>{
            if(res.msg == "操作成功"){
                let filelist = res.data.rows
                for(var i=0;i<filelist.length;i++){
                    var disLength = filelist[i].resourcesUrl.length;
                    var shortName = filelist[i].resourcesUrl.substring(disLength-3,disLength);
                    if(shortName == 'pdf'){
                        let url = process.env.VUE_APP_BASE_API + process.env.VUE_APP_REPORT_PATH + filelist[i].resourcesUrl
                        this.downloadPDf(url,filelist[i].resourcesName)
                    }else{

                         window.open(process.env.VUE_APP_BASE_API + process.env.VUE_APP_REPORT_PATH + filelist[i].resourcesUrl)
                    }
                }
              let box = document.getElementById("PDFaifrom");
              box.remove()
            }
        })
        },
        passfile(){
            let par = {
            resourcesName : this.downobj.resourcesName
                }
            upateOKByWordAndPdf(par).then((res)=>{
                if(res.msg == "操作成功"){
                    this.$message({
                        message: '恭喜你，该报告审核通过',
                        type: 'success'
                    });
                    this.$emit('isshowPdftype')
                }
            })
        },
        //pdf文件下载方法
        downloadPDf(url,name) {
        axios.get(url, {
          responseType: 'blob', //重要
        }).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.id = "PDFaifrom"
          let fname = name;
          link.href = url;
          link.setAttribute('download', fname);
          document.body.appendChild(link);
          link.click();
        })
      },
      // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
      changePdfPage (val) {
        if (val === 0 && this.currentPage > 1) {
          this.currentPage--
        }
        if (val === 1 && this.currentPage < this.pageCount) {
          this.currentPage++
        }
      },
      // pdf加载时
      loadPdfHandler (e) {
        this.currentPage = 1 // 加载的时候先加载第一页
      }

    }
  }

</script>

<style scoped>
.arrow{
    /* position: fixed; */
    position: absolute;
    top: 82px;
    z-index: 99;
    width: 100%;
    display: flex;
    justify-content: space-around;;
}
</style>