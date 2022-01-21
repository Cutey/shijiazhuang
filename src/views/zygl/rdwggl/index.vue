<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" style="display: flex;align-items: center;">
    
        <el-form-item label="数据类型" prop="pointName">
         <el-select v-model="queryParams.dataType" @change='handleQuery' filterable clearable allow-create  placeholder="请选择数据类型" >
                <el-option :label="item.title"  :value="item.value" v-for="(item,index) in lists" :key="index"></el-option>
            </el-select>
      </el-form-item>

       <el-form-item label="产品类型" prop="productType">
          <el-input v-model="queryParams.productType" @change='handleQuery'></el-input>
         <!-- <el-select v-model="queryParams.productType" @change='handleQuery' filterable clearable allow-create  placeholder="请选择数据类型" >
                <el-option :label="item.title"  :value="item.value" v-for="(item,index) in lists" :key="index"></el-option>
            </el-select> -->
      </el-form-item>

      <el-form-item label="开始时间" prop="beginTime">
       <el-date-picker
            v-model="queryParams.beginTime"
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

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange"  style="width: 100%">
      <el-table-column type="selection" width="55" align="center" fixed/>
       <el-table-column label="排序" align="center" prop="num" fixed />
        <el-table-column label="数据类型" align="center" prop="dataType" fixed >
            <template slot-scope="scope">
                 <span v-if="scope.row.dataType =='A'">遥感</span>
                 <span v-else-if="scope.row.dataType =='B'">地基</span>
                <span v-else>{{scope.row.dataType}}</span>
            </template>
        </el-table-column>
     <el-table-column label="热点网格类型" align="center" prop="hotpointType" fixed width="200">
            <template slot-scope="scope">
                 <span v-if="scope.row.hotpointType =='A'">正常</span>
                 <span v-else-if="scope.row.hotpointType =='B'">特殊</span>
                 <span v-else>{{scope.row.hotpointType}}</span>
            </template>
        </el-table-column>

        <el-table-column label="产品类型" align="center" prop="productType" fixed>
            <template slot-scope="scope">
                 <span v-if="scope.row.productType =='A'">pm10</span>
                 <span v-else-if="scope.row.productType =='B'">pm2.5</span>
                <span v-else>{{scope.row.productType}}</span>
            </template>
        </el-table-column>
      <el-table-column label="文件类型" align="center" prop=" fileType" >
            <template slot-scope="scope">
                 <span v-if="scope.row.fileType =='A'">整点</span>
                 <span v-else-if="scope.row.fileType =='B'">日均</span>
                 <span v-else-if="scope.row.fileType =='C'">周均</span>
                  <span v-else>{{scope.row.fileType}}</span>
            </template>
        </el-table-column>
         <el-table-column label="主键" align="center" prop="hotpointDataId" width="200"/>
        <el-table-column label="创建时间" align="center" prop="creationDate" width="200"/>
        <el-table-column label="开始时间" align="center" prop="beginTime" width="200" />
         <el-table-column label="结束时间" align="center" prop="endTime" width="200"/>
      <el-table-column label="行政区划代码" align="center" prop="areaId" width="100"/>
       <el-table-column label="地区行政编码" align="center" prop="districtId" width="100"/>
        <el-table-column label="企业名称" align="center" prop=" enterpriseName" width="200">
            <template slot-scope="scope">
                 <span :title="scope.row.enterpriseName" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.enterpriseName}}</span>
            </template>
        </el-table-column>
       <!-- <el-table-column label="企业名称" align="center" prop="enterpriseName" /> -->
       <el-table-column label="经度" align="center" prop="longitude" width="200"/>
       <el-table-column label="纬度" align="center" prop="latitude" width="200"/>
       <el-table-column label="右下角经度,纬度" align="center" prop="lbPoint" width="270"/>
        <el-table-column label="右上角经度,纬度" align="center" prop="rtPoint" width="270"/>
       <el-table-column label="左上角经度,纬度" align="center" prop="ltPoint" width="270"/>
        <el-table-column label="左下角经度,纬度" align="center" prop="lbPoint" width="270"/>
      <el-table-column label="描述" align="center" prop="descr" />
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
import {getDPmPoint,deleteDPmPoint,insertDPmPoint,updateDPmPoint} from '@/api/zygl/rdwggl'
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
      lists:[
          {
              title:'遥感',
              value:'A'
          },
           {
              title:'地基',
              value:'B'
          }
      ],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        beginTime: null,
        dataType:null,
        productType:null
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