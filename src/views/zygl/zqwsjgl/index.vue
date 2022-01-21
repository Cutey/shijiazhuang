<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" style="display: flex;align-items: center;">
      <el-form-item label="监测时间" prop="monitortime">
        <el-date-picker
            v-model="queryParams.monitortime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="small"
            @change='handleQuery'
            placeholder="选择监测时间">
          </el-date-picker>
      </el-form-item>
     
        <el-form-item label="ID" prop="areaId">
         <el-input
          v-model="queryParams.pmStatisticId"
          placeholder="请输入ID"
          clearable
          size="small"
          @input="handleQuery"
        />
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
       <el-table-column label="ID" align="center" prop="pmStatisticId" />
      <el-table-column label="站点ID" align="center" prop="pointId" />
      <el-table-column label="类型" align="center" prop="dateType" >
          <template slot-scope="scope">
            <span v-if="scope.row.dateType =='A'">整点</span>
            <span v-else-if="scope.row.dateType =='B'">日均</span>
          </template>
      </el-table-column>
      <el-table-column label="AQI" align="center" prop="aqi" />
      <el-table-column label="CO" align="center" prop="co" />
      <el-table-column label="pm10" align="center" prop="pm10" />
      <el-table-column label="pm2.5" align="center" prop="pm25" />
      <el-table-column label="SO2" align="center" prop="so2" />
      <el-table-column label="NO2" align="center" prop="no2" />
      <el-table-column label="O3" align="center" prop="o3" />
      <el-table-column label="tsp" align="center" prop="tsp" />
      <el-table-column label="首要污染物" align="center" prop="primaryPollutant" />
       <el-table-column label="质量" align="center" prop="quality" />
       <el-table-column label="等级" align="center" prop="levels" />
      <el-table-column label="监测时间" align="center" prop="monitortime" />
      <el-table-column label="创建时间" align="center" prop="createDate" />
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
import {getDPmPoint,deleteDPmPoint,insertDPmPoint,updateDPmPoint} from '@/api/zygl/zqwsjgl'
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
        monitortime: undefined,
        handleQuery:undefined
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