<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" style="display: flex;align-items: center;">
      <el-form-item label="类型名称" prop="typeName">
        <el-input
          v-model="queryParams.typeName"
          placeholder="请输入资源类型名称"
          clearable
          size="small"
          @input="handleQuery"
        />
      </el-form-item>
     
      <el-form-item label="资源类型ID" prop="resourcesTypeId">
         <el-input
          v-model="queryParams.resourcesTypeId"
          placeholder="请输入资源类型ID"
          clearable
          size="small"
          @input="handleQuery"
        />
      </el-form-item>
        <el-form-item label="标识名称" prop="dirName">
        <el-input
          v-model="queryParams.dirName"
          placeholder="请输入标识名称"
          clearable
          size="small"
          @input="handleQuery"
        />
      </el-form-item>
       <el-form-item label="标识类型" prop="dirType">
            <el-select v-model="queryParams.dirType" filterable clearable allow-create  placeholder="请选择标识类型" >
                <el-option :label="item.title"  :value="item.value" v-for="(item,index) in dirTypelist" :key="index"></el-option>
            </el-select>
      </el-form-item>

        <el-form-item label="报告类型" prop="resourceTypeChild">
            <el-select v-model="queryParams.resourceTypeChild" clearable filterable  allow-create placeholder="请选择报告类型" >
                <el-option :label="item.title"   :value="item.value" v-for="(item,index) in baogaotype" :key="index"></el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="sts">
            <el-select v-model="queryParams.sts" filterable clearable  allow-create  placeholder="请选择状态" >
                <el-option :label="item.title"  :value="item.value" v-for="(item,index) in stslist" :key="index"></el-option>
            </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
      <el-table-column label="ID" align="center" prop="resourcetypeId" />
      <el-table-column label="资源类型ID" align="center" prop="resourcesTypeId" />
      <el-table-column label="资源类型名称" align="center" prop="typeName" />
      <!-- <el-table-column label="资源类型" align="center" prop="postName" /> -->
      <el-table-column label="报告类型" align="center" prop="resourceTypeChild" >
           <template slot-scope="scope">
              <span v-if="scope.row.resourceTypeChild == 'D'">日报</span>
              <span v-else-if="scope.row.resourceTypeChild == 'W'">周报</span>
              <span v-else-if="scope.row.resourceTypeChild == 'M'">月报</span>
              <span v-else-if="scope.row.resourceTypeChild == 'Q'">季报</span>
              <span v-else-if="scope.row.resourceTypeChild == 'Y'">年报</span>
              <span v-else-if="scope.row.resourceTypeChild == 'O'">其它</span>
          </template>
      </el-table-column>
      <el-table-column label="标识名称" align="center" prop="dirName" />
      
      <el-table-column label="标识类型" align="center" prop="dirType" width="180" >
            <template slot-scope="scope">
              <span v-if="scope.row.dirType == 'R'">资源目录</span>
              <span v-if="scope.row.dirType == 'P'">产品目录</span>
          </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="sts">
          <template slot-scope="scope">
              <span v-if="scope.row.sts == 'A'">正常</span>
              <span v-if="scope.row.sts == 'P'">停用</span>
          </template>
      </el-table-column>
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
        <el-form-item label="资源类型名称" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入资源类型名称" />
        </el-form-item>
        <el-form-item label="标识名称" prop="dirName">
        <el-input
          v-model="form.dirName"
          placeholder="请输入标识名称"
          clearable
          size="small"
        />
      </el-form-item>
       <el-form-item label="标识类型" prop="dirType">
            <el-select v-model="form.dirType" placeholder="请选择标识类型" style="width:100%">
                <el-option :label="item.title" :value="item.value" v-for="(item,index) in dirTypelist" :key="index"></el-option>
            </el-select>
      </el-form-item>

        <el-form-item label="报告类型" prop="resourceTypeChild">
            <el-select v-model="form.resourceTypeChild" placeholder="请选择报告类型" style="width:100%">
                <el-option :label="item.title" :value="item.value" v-for="(item,index) in baogaotype" :key="index"></el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="sts">
            <el-select v-model="form.sts" placeholder="请选择状态" style="width:100%">
                <el-option :label="item.title" :value="item.value" v-for="(item,index) in stslist" :key="index"></el-option>
            </el-select>
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
import {getDResourceType,deleteDResourceType,insertDResourceType,updateDResourceType} from '@/api/zygl/zyml'
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
        esourcesTypeId: undefined,
        typeName: undefined,
        resourceTypeChild:undefined,
        sts:undefined,
        dirName:undefined,
        dirType:undefined
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
      getDResourceType(this.queryParams).then(response => {
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
            updateDResourceType(this.form).then(response => {
              if (response.msg == '执行成功') {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            insertDResourceType(this.form).then(response => {
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
          return deleteDResourceType(par);
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