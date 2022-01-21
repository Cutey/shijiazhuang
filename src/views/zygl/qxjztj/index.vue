<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" style="display: flex;align-items: center;">
      <el-form-item label="地区名称" prop="regionName">
         <el-input
          v-model="queryParams.regionName"
          placeholder="请输入地区名称"
          clearable
          size="small"
          @input="handleQuery"
        />
      </el-form-item>

       <el-form-item label="文件日期" prop="fileDate">
        <el-date-picker
            v-model="queryParams.fileDate"
            type="datetime"
            @change='handleQuery'
            value-format="yyyy-MM-dd HH:mm:ss"
            size="small"
            placeholder="选择日期时间">
          </el-date-picker>
      </el-form-item>

    </el-form>

    <el-row :gutter="10" class="mb8">
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="dataStorageId" />
        <el-table-column label="行政区代码" align="center" prop="areaId" />
        
      <el-table-column label="地区名称" align="center" prop="regionName" />
        <el-table-column label="资源类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sourceType=='A'">遥感</span>
            <span v-else-if="scope.row.sourceType=='B'">地基</span>
            <span v-else>暂无资源类型</span>
          </template>
        </el-table-column>
        <el-table-column label="产品类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.productType=='A'">pm10</span>
            <span v-else-if="scope.row.productType=='B'">pm2.5</span>
             <span v-else-if="scope.row.productType=='C'">AOD</span>
            <span v-else>暂无产品类型</span>
          </template>
        </el-table-column>
        <el-table-column label="文件类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.fileType=='A'">整点</span>
            <span v-else-if="scope.row.fileType=='B'">日均</span>
             <span v-else-if="scope.row.fileType=='C'">周均</span>
            <span v-else>暂无文件类型</span>
          </template>
        </el-table-column>
        <el-table-column label="pm产品值" align="center" prop="pmValue" />
       <el-table-column label="文件日期" align="center" prop="fileDate" />
      <el-table-column label="创建日期" align="center" prop="createDate" />
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
import {getDPmPoint,deleteDPmPoint,insertDPmPoint,updateDPmPoint} from '@/api/zygl/qxjztj'
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
        regionName: undefined,
        fileDate:undefined,
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