<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="88px">
      <el-form-item  label="工业名称:" prop="industryName">
        <el-input
          v-model="queryParams.industryName"
          placeholder="请输入工业名称"
          clearable
          size="small"
          @input="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工业编码:" prop="industryCode">
        <el-input
          v-model="queryParams.industryCode"
          placeholder="请输入工业编码"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:post:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:post:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:post:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
       <el-table-column label="ID" align="center" prop="industryId" />
      <el-table-column label="行业分类名称" align="center" prop="industryName" />
      <el-table-column label="行业分类编码" align="center" prop="industryCode" />
      <el-table-column label="备注" align="center" prop="descr" />
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
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="行业分类名称" prop="industryName">
            <!-- <el-select v-model="form.industryName" placeholder="请选择行业分类名称" style="width: 100%;">
                <el-option :label="item" :value="item" v-for="(item,index) in hylsit" :key="index"></el-option>
            </el-select> -->
          <el-input v-model="form.industryName" placeholder="请输入行业分类名称" />
        </el-form-item>
        <el-form-item label="行业分类编码" prop="industryCode">
          <el-input  oninput="value=value.replace(/[^0-9]/g,'')" v-model="form.industryCode" placeholder="请输入行业分类编码" />
        </el-form-item>
        <!-- <el-form-item label="资源类型">
            <el-select v-model="form.region" placeholder="请选择资源类型" style="width: 100%;">
                <el-option label="区域一" value="shanghai"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="目录类型">
            <el-select v-model="form.region" placeholder="请选择目录类型" style="width: 100%;">
                <el-option label="区域一" value="shanghai"></el-option>
            </el-select>
        </el-form-item> -->


        <el-form-item label="备注" prop="descr">
          <el-input v-model="form.descr" type="textarea" placeholder="请输入内容" />
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

import {getDEnterpriseIndustry,insertDEnterpriseIndustry,updateDEnterpriseInfo,deleteDEnterpriseIndustry,getDEnterpriseIndustryKV} from '@/api/zygl/hylb'
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
      hylsit:[],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        industryName: '',
        industryCode:'',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        industryName: [
          { required: true, message: "行业名称不能为空", trigger: "blur" }
        ],
        industryCode: [
          {required: true, message: "行业分类编码不能为空", trigger: "blur",}
        ],
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
      getDEnterpriseIndustry(this.queryParams).then(response => {
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
        industryName: undefined,
        descr: undefined,
        industryName: undefined,
        industryId: '',
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
      let par={
          pageNo: 1,
        pageSize: 10,
        industryName:row.industryName,
        industryCode:row.industryCode,
      }
    //   const postId = row.postId || this.ids
      getDEnterpriseIndustry(par).then(response => {
        this.form = response.data.list[0];
        this.open = true;
        this.title = "修改资源目录";
      });
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
            insertDEnterpriseIndustry(this.form).then(response => {
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
            industryId : row.industryId
        }
      this.$confirm('是否确认删除岗位编号为"' + par.industryId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteDEnterpriseIndustry(par);
        }).then(() => {
          
          this.msgSuccess("删除成功");
          this.getList();
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
   
  }
};
</script>