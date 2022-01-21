<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="88px">
      <el-form-item  label="企业名称:" prop="postCode">
        <el-input
       
          v-model="queryParams.enterpriseName"
          placeholder="请输入企业名称"
          clearable
          size="small"
         @input="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行业类别:" prop="postCode">
           <!-- <el-select v-model="queryParams.mainPollution" placeholder="请选择行业分类名称" style="width: 100%;">
                <el-option :label="item" :value="item" v-for="(item,index) in hylsit" :key="index"></el-option>
            </el-select> -->
        <el-input
          v-model="queryParams.mainPollution"
          placeholder="请输入行业类别"
          clearable
          size="small"
          @input="handleQuery"
        />
      </el-form-item>
     
      
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:post:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
       <el-table-column label="ID" align="center" prop="dEnterpriseInfoId" />
      <el-table-column label="企业名称" align="center" prop="enterpriseName" />
      <el-table-column label="行业类别" align="center" prop="mainPollution" />
      <el-table-column label="行政区划" align="center" prop="postName" />
      <el-table-column label="经度" align="center" prop="lon" />
      <el-table-column label="纬度" align="center" prop="lat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:post:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:post:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="企业名称" prop="enterpriseName">
          <el-input v-model="form.enterpriseName" placeholder="请输入企业名称" />
        </el-form-item>
       <el-form-item label="行业分类名称" prop="mainPollution">
            <el-select v-model="form.mainPollution" placeholder="请选择行业分类名称" style="width: 100%;">
                <el-option :label="item" :value="item" v-for="(item,index) in hylsit" :key="index"></el-option>
            </el-select>
       </el-form-item>
       
         <el-form-item label="经度" prop="lon">
          <el-input v-model.number="form.lon" placeholder="请输入经度" oninput="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>
        <el-form-item label="纬度" prop="lat">
          <el-input  v-model.number="form.lat" type="number" placeholder="请输入经度" oninput="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>

        <el-form-item label="行政区划" prop="areaId">
          <el-input  v-model.number="form.areaId"  placeholder="请输入行政区划" />
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

import {getDEnterpriseInfo,insertDEnterpriseInfo,updateDEnterpriseInfo,deleteDEnterpriseInfo,getDEnterpriseIndustryKV} from '@/api/zygl/qyxx'
export default {
  name: "Post",
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
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        enterpriseName: '',
        mainPollution: '',
      },
      hylsit:[],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        enterpriseName: [
          { required: true, message: "企业名称不能为空", trigger: "blur" }
        ],
        mainPollution: [
          { required: true, message: "行业分类名称不能为空", trigger: "blur" }
        ],
        lat: [
          { required: true, message: "纬度不能为空", trigger: "blur" }
        ],
        lon: [
          { required: true, message: "经度不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDEnterpriseIndustryKV()
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      getDEnterpriseInfo(this.queryParams).then(response => {
        this.postList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 岗位状态字典翻译
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
        enterpriseName: undefined,
        mainPollution: undefined,
        lat: undefined,
        lon: undefined,
        areaId:undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增资源目录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
    //   const postId = row.postId || this.ids
        this.form = row
        this.open = true;
        this.title = "修改资源目录";
    //   getPost(postId).then(response => {
    //     this.form = response.data;
       
    //   });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title == "修改资源目录") {
            updateDEnterpriseInfo(this.form).then(response => {
              if (response.msg === '执行成功') {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            insertDEnterpriseInfo(this.form).then(response => {
              if (response.msg === '执行成功') {
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
        let par ={
            dEnterpriseInfoId:row.dEnterpriseInfoId
        }
      const postIds = row.postId || this.ids;
      this.$confirm('是否确认删除岗位编号为"' + par.dEnterpriseInfoId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteDEnterpriseInfo(par);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有岗位数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPost(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
     getDEnterpriseIndustryKV(){
        getDEnterpriseIndustryKV().then((res)=>{
            this.hylsit = res.data
        })
    }
  }
};
</script>