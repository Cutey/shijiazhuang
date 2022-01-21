<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" style="display: flex;align-items: center;">
      <el-form-item label="行政区名称" prop="areaName">
         <el-input
          v-model="queryParams.areaName"
          placeholder="请输入行政区名称"
          clearable
          size="small"
          @input="handleQuery"
        />
      </el-form-item>

       <el-form-item label="政区划代码" prop="areaId">
         <el-input
          v-model="queryParams.areaId"
          placeholder="请输入政区划代码"
          clearable
          value-format='yyyy-MM-dd'
          size="small"
          @input="handleQuery"
        />
      </el-form-item>

    </el-form>

    <el-row :gutter="10" class="mb8">
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="行政区代码" align="center" prop="areaId" />
        
      <el-table-column label="行政区" align="center" prop="areaName" />
      <el-table-column label="上一级行政区代码" align="center" prop="parentId" />
       <el-table-column label="等级" align="center" prop="levels" />
      <el-table-column label="备注" align="center" prop="descr" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {getDPmPoint,deleteDPmPoint,insertDPmPoint,updateDPmPoint} from '@/api/zygl/csgl'
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
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      baogaotype:[
          {
              title:'日报',
              value:'D'
          },
          {
              title:'周报',
              value:'W'
          },
          {
              title:'月报',
              value:'M'
          },
          {
              title:'季报',
              value:'Q'
          },
          {
              title:'年报',
              value:'Y'
          },
          {
              title:'其它',
              value:'O'
          }
      ],
      stslist:[
          {
              title:'正常',
              value:"A"
          },
          {
              title:'停用',
              value:"P"
          }
      ],
      dirTypelist:[
          {
              title:'资源目录',
              value:'R'
          },
           {
              title:'产品目录',
              value:'P'
          },
           {
              title:'数据源',
              value:'S'
          }
      ],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        areaId: undefined,
        areaName:undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        typeName: [
          { required: true, message: "资源类型名称不能为空", trigger: "blur" }
        ],
        dirName: [
          { required: true, message: "标识名称不能为空", trigger: "blur" }
        ],
        dirType: [
          { required: true, message: "标识类型不能为空", trigger: "blur" }
        ],
        resourceTypeChild: [
          { required: true, message: "报告类型不能为空", trigger: "blur" }
        ],
        sts: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      getDPmPoint(this.queryParams).then(response => {
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
        resourcesTypeId: undefined,
        dirName: undefined,
        dirType: undefined,
        resourceTypeChild: undefined,
        resourcetypeId: undefined,
        sts: undefined,
        typeName:undefined
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
    this.form = row;
    this.open = true;
    this.title = "修改资源目录";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title == "修改资源目录") {
            updateDPmPoint(this.form).then(response => {
              if (response.msg == '执行成功') {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            insertDPmPoint(this.form).then(response => {
              if (response.msg == '执行成功') {
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
        let par={
            resourcesTypeId:row.resourcesTypeId
        }
      this.$confirm('是否确认删除岗位编号为"' + row.resourcesTypeId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteDPmPoint(par);
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
    }
  }
};
</script>