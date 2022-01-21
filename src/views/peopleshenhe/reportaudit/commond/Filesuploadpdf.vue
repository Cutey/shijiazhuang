<template>
    <div>
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body @close='abortClick' >
      <el-upload
  class="upload-demo"
  drag
  ref="pdfuoload"
  accept=".doc,.pdf,.PDF,.word"
  :action="upload.url"
  :file-list="fileList"
  :limit='filenum'
  :on-exceed='fileexceed'
  :before-upload="handleFileUploadProgress"
  :on-progress='fileprogress'
  :auto-upload='autoupload'
  :http-request='filerequest'
  multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">只能上传doc/pdf文件</div>
</el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm" :loading="isscu">提交</el-button>
        <el-button @click="abortClick">取 消</el-button>
      </div>
    </el-dialog>
    </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {upateWordAndPdf} from '@/api/upload'
export default {
     name: "Filesupload",
  props:['upload'],
  data() {
    return {
      location:window.location,
      mustFile: [],
      filenum:2,
      fileList:[],
      multipletrue:true,
      autoupload:false,
      pdfnum:0,
      docnum:0,
      feimustFile: [],
      mustFrom: {},
      feimustFrom: {},
      fileData:null,
      isscu:false,
      // 用户导入参数

      // 文件上传成功后
      contrast: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        //文件的路径
        path: "",
        //后台返回上传文件的表头
        fileField: [],
        // 后台返回的字段值
        tableField: []
      },
    }
},
  methods:{
    //   导入按钮点击后的事件
    Importclick(row){
        this.upload.title = row.title;
        this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(file) {

    },
    fileprogress(event, file, fileList){
    },
    // 下一步上传文件
    submitFileForm() {
      this.isscu = true
      this.fileData= new FormData();
      this.fileData.append('resourcesName', this.upload.data.resourcesName)
        this.$refs.pdfuoload.submit();
      if(this.pdfnum == 1 && this.docnum==1){
            this.fileserver()
            this.docnum = 0
            this.pdfnum = 0
      }else{
          this.fileData = {}
          this.fileList = []
          this.docnum = 0
          this.pdfnum = 0
          this.$message.error('上传的文件必须包含1个word文件和1个PDF文件');
      }
    
    },
    fileserver(){
      upateWordAndPdf(this.fileData).then((res)=>{
        if(res.msg == "操作成功"){
          this.isscu = false
          this.upload.open = false
          this.fileData = null
          this.fileList = []
          this.docnum = 0
          this.pdfnum = 0
          this.$message({
          message: '文件上传成功',
          type: 'success'
        });
        }
      })
    },
    fileexceed(files, fileList){
          this.fileData = null
          this.fileList = []
          this.docnum = 0
          this.pdfnum = 0
       this.$message.error('最多只能上传2个文件，且必须包含1个word文件和1个PDF文件');
    },
    filerequest(file){
       let filetype = ''
      let disLength = file.file.name.length
      filetype = file.file.name.substring(disLength-3,disLength)
      if(filetype=='pdf'){
        this.pdfnum ++
      }else if(filetype=='doc'){
        this.docnum ++
      }
       this.fileData.append('file', file.file);
    },
    abortClick(){
       this.upload.open = false
          this.fileData = null
          this.fileList = []
          this.docnum = 0
          this.pdfnum = 0
    }
}
    }
</script>