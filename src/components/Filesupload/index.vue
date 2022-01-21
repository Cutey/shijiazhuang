<template>
  <div>
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".txt, .cvs, .xls, .xlsx, .json"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :data="upload.data"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div
          class="el-upload__tip"
          style="color:red"
          slot="tip"
        >提示：仅允许导入“TXT/CVS/XLS/XLSX/JSON”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">下一步</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="contrast.title" :visible.sync="contrast.open" width="900px" append-to-body>
      <div style="display:flex;justify-content: space-between;">
        <el-form
          label-width="170px"
          ref="ruleForm"
          :rules="contrastrules"
          :model="ruleForm"
          style="display: flex;justify-content: space-between;flex-wrap: wrap;width:50%"
        >
          <span style="margin-bottom:10px;width:100%">必填字段</span>
          <el-form-item
            v-for="(item,index) in mustFile"
            :key="index"
            :label="item.column+'('+item.columnName+'):'"
            :prop="item.column"
            style="width:100%"
          >
            <el-select
              v-model="ruleForm[item.column]"
              placeholder="请选择"
              @change="selectChange"
              filterable
              clearable
            >
              <el-option
                :label="ite"
                v-for="(ite,ind) in contrast.fileField"
                :key="ind"
                :value="ite"
                ref="opt"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-form
          label-width="190px"
          :model="feimustFrom"
          ref="feimustFrom"
          style="display: flex;justify-content: space-between;flex-wrap: wrap;width:50%"
        >
          <span style="margin-bottom:10px;width:100%">选填字段</span>
          <el-form-item
            v-for="(item,index) in feimustFile"
            :key="index"
            :label="item.column+'('+item.columnName+'):'"
            :prop="item.column"
            style="width:100%"
          >
            <el-select
              v-model="feimustFrom[item.column]"
              placeholder="请选择"
              @change="selectChange"
              filterable
              clearable
            >
              <el-option
                :label="ite"
                v-for="(ite,ind) in contrast.fileField"
                :key="ind"
                :value="ite"
                ref="opt"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitwarehouseForm">提交</el-button>
        <el-button @click="contrast.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {ImportSavaData } from '@/api/system/user'
export default {
  name: "Filesupload",
  props:['upload'],
  data() {
    return {
      location:window.location,
      mustFile: [],
      feimustFile: [],
      mustFrom: {},
      feimustFrom: {},
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
      //提交的from表单
      ruleForm: {},
      //匹配导入信息的表单验证
      contrastrules: {
        userName: [
          { required: true, message: "userName不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "nickName不能为空", trigger: "blur" }
        ],
        uuid: [{ required: true, message: "uuid不能为空", trigger: "blur" }
        ],
        deptName:[
           { required: true, message: "deptName不能为空", trigger: "blur" }
        ],
        roleName:[
           { required: true, message: "roleName不能为空", trigger: "blur" }
        ]
      },
    };
  },
  watch: {
            upload: function(newVal,oldVal){
      
                // this.cData = newVal;  //newVal即是chartData
                // this.drawChart();
            }
        },
  methods:{
    //   导入按钮点击后的事件
    Importclick(row){
        this.upload.title = row.title;
        this.upload.open = true;
    },
          /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();

      if (response.msg == "上传成功") {
        this.forData(response.data.tableField);
        this.contrast.open = true;
        this.contrast.title = "匹配导入信息";
        this.contrast.path = response.data.filePath;
        this.contrast.fileField = response.data.fileField;
      } else {
        this.$alert(response.msg, "导入结果", {
          dangerouslyUseHTMLString: true
        });
      }
    },
    forData(data) {
      let obj = {};
      let feiobj = {};
      this.mustFile = [];
      this.feimustFile = [];
      for (var i = 0; i < data.length; i++) {
        var key = Object.keys(data[i]);
        obj[data[i].column] = "";
        if (data[i].columnRequired == 1) {
          this.mustFile.push(data[i]);
        } else if (data[i].columnRequired == 0) {
          this.feimustFile.push(data[i]);
          feiobj[data[i].column] = "";
        }
      }
      this.ruleForm = obj;
      this.feimustFrom = feiobj;
    },
    // 下一步上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    getCaption(obj) {
      var index = obj.lastIndexOf("//");
      obj = obj.substring(index + 1, obj.length);
      return obj;
    },
    submitwarehouseForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let filepath = this.getCaption(this.contrast.path);
          let frid = Object.assign(this.ruleForm, this.feimustFrom);
          let query = {
            isClean: this.upload.isUploading,
            json: {
              path: filepath,
              data: frid
            },
            table: this.upload.querytype
          };
      
          ImportSavaData(query).then(response => {
            this.ruleForm = {};
            this.$alert(response.msg, "导入结果", {
              dangerouslyUseHTMLString: true
            });
          });
          this.$parent.getList()
          this.contrast.open = false;
        }
      });
    },
    // 下拉框的change事件
    selectChange(e) {}
  }
};
</script>
<style scoped>
</style>