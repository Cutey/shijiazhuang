<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" >
      <el-form-item label="文件名称" prop="resourcesName">
        <el-input
          v-model="queryParams.resourcesName"
          placeholder="请输入文件名称"
          clearable
          size="small"
          style="width:140px"
          @input="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件类型ID" prop="dictType">
         <el-select v-model="queryParams.resourcesTypeId" filterable clearable allow-create  placeholder="请选择文件类型" >
                <el-option :label="item.TITLE"  :value="item.VALUE" v-for="(item,index) in lists" :key="index"></el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="行政区划代码" prop="status">
       <el-input
          v-model="queryParams.areaId"
          placeholder="请行政区划代码"
          clearable
          size="small"
          style="width:100px"
         @input="handleQuery"
        />
      </el-form-item>
      
      <el-form-item label="创建时间">
         <el-date-picker
            v-model="queryParams.resourcesDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="small"
            placeholder="选择日期时间">
          </el-date-picker>
      </el-form-item>
       <!-- <el-form-item label="文件类型ID" prop="resourcesTypeId">
         <el-select v-model="queryParams.resourcesTypeId" filterable  allow-create  placeholder="请选择文件类型" >
                <el-option :label="item.title"  :value="item.value" v-for="(item,index) in wenjianTypelist" :key="index"></el-option>
            </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dict:add']"
        >新增</el-button>
      </el-col> -->
    </el-row>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文件类型ID" align="center" prop="resourcesTypeId" />
      <el-table-column label="文件名称" align="center" prop="resourcesName" width="300"/>
      <el-table-column label="文件类型" align="center" prop="fileType" >
        <template slot-scope="scope">
          <span v-if="scope.row.fileType =='A'">整点数据</span>
          <span v-else-if="scope.row.fileType =='B'">日数据</span>
          <span v-else-if="scope.row.fileType =='C'">周数据</span>
          <span v-else-if="scope.row.fileType =='M'">月数据</span>
          <span v-else-if="scope.row.fileType =='S'">季数据</span>
          <span v-else-if="scope.row.fileType =='Y'">年数据</span>
          <span v-else-if="scope.row.fileType =='D'">日报</span>
          <span v-else-if="scope.row.fileType =='E'">周报</span>
          <span v-else-if="scope.row.fileType =='F'">其它</span>
        </template>
      </el-table-column>
      <el-table-column label="文件格式" align="center" prop="fileFormat" >
        <template slot-scope="scope">
          <span v-if="scope.row.fileFormat =='A'">图片</span>
          <span v-else-if="scope.row.fileFormat =='B'">文件</span>
          <span v-else-if="scope.row.fileFormat =='C'">视频</span>
          <span v-else-if="scope.row.fileFormat =='D'">音频</span>
          <span v-else-if="scope.row.fileFormat =='Z'">其它</span>
        </template>
      </el-table-column>
      <el-table-column label="文件后缀" align="center" prop="fileSuffix" >
        <template slot-scope="scope">
          <span v-if="scope.row.fileSuffix =='A'">.png</span>
          <span v-else-if="scope.row.fileSuffix =='B'">.tif</span>
          <span v-else-if="scope.row.fileSuffix =='C'">.jpg</span>
          <span v-else-if="scope.row.fileSuffix =='D'">.doc</span>
          <span v-else-if="scope.row.fileSuffix =='E'">pdf</span>
          <span v-else-if="scope.row.fileSuffix =='F'">.csv</span>
          <span v-else-if="scope.row.fileSuffix =='G'">.txt</span>
          <span v-else-if="scope.row.fileSuffix =='H'">.zip</span>
          <span v-else-if="scope.row.fileSuffix =='I'">.rar</span>
          <span v-else-if="scope.row.fileSuffix =='J'">.shp</span>
          <span v-else-if="scope.row.fileSuffix =='K'">.dbf</span>
          <span v-else-if="scope.row.fileSuffix =='L'">.mp4</span>
          <span v-else-if="scope.row.fileSuffix =='M'">.flv</span>
          <span v-else-if="scope.row.fileSuffix =='N'">.mp3</span>
          <span v-else-if="scope.row.fileSuffix =='O'">.wmv</span>
          <span v-else-if="scope.row.fileSuffix =='p'">.hdf</span>
          <span v-else-if="scope.row.fileSuffix =='Z'">其它</span>
        </template>
      </el-table-column>
      <el-table-column label="文件日期" align="center" prop="resourcesDate" />
      <el-table-column label="创建日期" align="center" prop="createDate" />
      <el-table-column label="文件下载" align="center" prop="status" :formatter="statusFormat" >
            <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="fa fa-cloud-download"
            @click="filedownload(scope.row)"
          >文件下载</el-button>
         
        </template>
      </el-table-column>
      <el-table-column label="行政区划" align="center" prop="areaId" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属区域" prop="dictName">
        <span>省</span>
          <el-input
          v-model="queryParams.dictName"
          placeholder="请输入省"
          clearable
          size="small"
          style="width:100px"
          @keyup.enter.native="handleQuery"
        />
        <span>市</span>
          <el-input
          v-model="queryParams.dictName"
          placeholder="请输入市"
          clearable
          size="small"
          style="width:100px"
          @keyup.enter.native="handleQuery"
        />
        <span>县</span>
          <el-input
          v-model="queryParams.dictName"
          placeholder="请输入县"
          clearable
          size="small"
          style="width:100px"
          @keyup.enter.native="handleQuery"
        />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  
  </div>
</template>

<script>
import { getResources, insertResources, deleteResources, updateResources,getDResourceTypeKV} from "@/api/zygl/zywj";
import axios from 'axios'
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        areaId: undefined,
        resourcesDate: undefined,
        resourcesName: undefined,
        resourcesTypeId:undefined
      },
      // 表单参数
      form: {},
      lb:[],
      // 表单校验
      rules: {
        areaId: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        resourcesDate: [
          { required: true, message: "文件日期不能为空", trigger: "blur" }
        ]
      },
      wenjianTypelist:[
        {
          title:'整点数据',
          value:'A'
        },
        {
          title:'日数据',
          value:'B'
        },
        {
          title:'周数据',
          value:'C'
        },
        {
          title:'月数据',
          value:'M'
        },
        {
          title:'季数据',
          value:'S'
        },
        {
          title:'年数据',
          value:'Y'
        },
        {
          title:'日报',
          value:'D'
        },
        {
          title:'周报',
          value:'E'
        },
        {
          title:'其它',
          value:'F'
        }
      ],
      lists:[]
    };
  },
  created() {
    this.getList();
    this.getDResourceTypeKV()
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      getResources(this.queryParams).then(response => {

          this.typeList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增资源文件";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictId = row.dictId || this.ids
      getType(dictId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资源文件";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dictId != undefined) {
            updateType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids;
      this.$confirm('是否确认删除字典编号为"' + dictIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delType(dictIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有类型数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportType(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 清理缓存按钮操作 */
    handleClearCache() {
      clearCache().then(response => {
        if (response.code === 200) {
          this.msgSuccess("清理成功");
        }
      });
    },
    //文件下載方法
    filedownload(row){
      if(row.resourcesUrl && row.resourcesUrl!=''){
          let url= process.env.VUE_APP_BASE_API + process.env.VUE_APP_REPORT_PATH + row.resourcesUrl
        this.filedowmn(url,row.resourcesName)
      }
    
    },
    filedowmn(url,name){
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
    getDResourceTypeKV(){
      getDResourceTypeKV().then((res)=>{
        this.lists = res.data
      })
    }
  }
};
</script>