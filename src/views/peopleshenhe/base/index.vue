<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
        >新增</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="fa fa-eye"
          size="mini"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
        >查看历史列表</el-button>
      </el-col>
    </el-row>
    <div style="display:flex;align-items: center;">
      <div class="listname"></div>
      <h4 style="color:#606266;margin-left:10px">{{tiemtitle}}</h4>
    </div>
    <div>
      <el-date-picker
        v-model="timedate"
        type="date"
        @change='getList'
        value-format="yyyy-MM-dd"
        placeholder="选择日期">
      </el-date-picker>
    </div>
    <div class="cardAll-wrap" v-loading="loading">
      <div>
        <viewer
          @inited="inited"
          class="viewer"
          ref="viewer"
          style="height:85%;width: 100%;margin: 0 auto;"
          :images="demodate"
        >
          <div class="card-box">
            <div class="card-item" v-for="(item, index) in demodate" :key="index">
              <div class="card">
                <div class="card-top">
                  <img :src="item.resourceUrl" />
                </div>
                <div class="card-bottom">
                  <el-row class="info">
                    <span class="row-span" :title="item.pro_name">{{item.pro_name}}</span>
                  </el-row>
                  <el-row class="date-time">
                    <span>日期:{{item.resourcesDate}}</span>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
        </viewer>
      </div>
    </div>

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件类型" prop="fileType">
          <el-select v-model="form.fileType" placeholder="请选择文件类型">
            <el-option label="整点" value="A"></el-option>
            <el-option label="日均" value="B"></el-option>
            <el-option label="周均" value="C"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" prop="productType">
          <el-radio-group v-model="form.productType">
            <el-radio label="A" value>pm10</el-radio>
            <el-radio label="B" value>pm2.5</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="热点类型" prop="hotPointType">
          <el-radio-group v-model="form.hotPointType">
            <el-radio label="A" value>正常</el-radio>
            <el-radio label="B" value>特殊</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据类型" prop="dataType">
          <el-radio-group v-model="form.dataType">
            <el-radio label="A" value>遥感</el-radio>
            <el-radio label="B" value>地基</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="titlelist" :visible.sync="openlist" width="900px" append-to-body>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="产品类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.productType=='A'">pm10</span>
            <span v-else-if="scope.row.productType=='B'">pm2.5</span>
            <span v-else>暂无产品类型</span>
          </template>
        </el-table-column>
        <el-table-column label="热点类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.hotPointType=='A'">正常</span>
            <span v-else-if="scope.row.hotPointType=='B'">特殊</span>
            <span v-else>暂无热点类型</span>
          </template>
        </el-table-column>
        <el-table-column label="数据类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.dataType=='A'">遥感</span>
            <span v-else-if="scope.row.dataType=='B'">地基</span>
            <span v-else>暂无数据类型</span>
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
        <el-table-column label="自动/手动" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isAuto=='0'">自动</span>
            <span v-else-if="scope.row.isAuto=='1'">手动</span>
            <span v-else>暂无类型</span>
          </template>
        </el-table-column>
        <el-table-column label="云量" align="center" width="180">
          <template slot-scope="scope">
            <span>{{scope.row. yl}}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期" align="center" width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-size="queryParams.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="lengths"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getpeopleList,
  getpeopleadd,
  getpeopleupdate,
  getpeoplerevamp
} from "@/api/peopleshenhe";
import {
  treeselect as menuTreeselect,
  roleMenuTreeselect
} from "@/api/system/menu";
import {
  treeselect as deptTreeselect,
  roleDeptTreeselect
} from "@/api/system/dept";
import { getToken } from "@/utils/auth";
import Filesupload from "@/components/Filesupload";
import "viewerjs/dist/viewer.css";
// import Viewer from "v-viewer/src/component.vue";
export default {
  name: "Role",
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
      demodate: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      // 日期范围
      dateRange: [],
      timedate:'',
      // 状态数据字典
      statusOptions: [],

      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      currentPage4: 1,
      multipleSeleccard: [],
      // 表单参数
      form: {
        fileType: "B",
        productType: "B",
        hotPointType: "A",
        dataType: "A"
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      openlist: false,
      titlelist: "",
      tableData: [],
      lengths: 0,
      // 表单校验
      rules: {
        fileType: [
          { required: true, message: "文件类型不能为空", trigger: "blur" }
        ],
        productType: [
          { required: true, message: "产品类型不能为空", trigger: "change" }
        ],
        hotPointType: [
          { required: true, message: "热点类型不能为空", trigger: "change" }
        ],
        dataType: [
          { required: true, message: "数据类型不能为空", trigger: "change" }
        ]
      },
      tiemtitle:"前一日真彩图"
    };
  },
  components: {
    // Viewer
  },
  created() {},
  mounted() {

    let myDate = new Date(); //获取今天日期
    let day = myDate.getDate();
    let mon = myDate.getMonth() + 1;
    let year = myDate.getFullYear();
    let dateTemp =
      year +
      "-" +
      (mon < 10 ? "0" + mon : mon) +
      "-" +
      (day < 10 ? "0" + day : day);
    let par = {
      data: dateTemp,
      resourcesTypeId: 38
    };
    this.$nextTick(() => {
      this.getList();
      
    });
  },
  methods: {
    timeer() {
      let hour = new Date().getHours();
      if (hour >= 15) {
        this.tiemtitle='今日真彩图'
      } else {
        this.tiemtitle='前一日真彩图'
      }
    },
    inited(viewer) {
      this.$viewer = viewer;
    },
    show() {
      this.$viewer.show();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.currentPage4 = val;
      this.getpeoplehistory();
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      if(this.timedate =='' || this.timedate == null){
            this.timeer()
      }else{
        this.tiemtitle = this.timedate+'真彩图'
      }
      let par ={
        date : this.timedate
      }
      getpeopleList(par).then(response => {
        if (response.data.length > 0 && response.code == 200) {
          for (var i = 0; i < response.data.length; i++) {
            response.data[i].resourceUrl =
              process.env.VUE_APP_BASE_API +
              process.env.VUE_APP_REPORT_PATH +
              response.data[i].resourceUrl;
          }
          this.demodate = response.data;
          this.loading = false;
        }
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        fileType: "B",
        productType: "B",
        hotPointType: "A",
        dataType: "A"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleUpdate() {
      this.reset();
      this.openlist = true;
      this.titlelist = "查看历史列表";
      this.getpeoplehistory();
    },
    getpeoplehistory() {
      getpeopleupdate(this.queryParams).then(response => {
        if (response.data.rows.length > 0 && response.data.code == 200) {
          this.tableData = response.data.rows;
          let rows = response.data.rows;
          this.lengths = response.data.rows.length;
        }
      });
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
      this.title = "新增地基遥感";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id || this.form.createUserId) {
            this.form.isAuto = 1
            getpeoplerevamp(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.openlist = false;
                this.getList();
              }
            });
          } else {
            getpeopleadd(this.form).then(response => {
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
    handleEdit(index, row) {
      this.form = row;
      this.open = true;
      this.title = "修改历史列表";
    },
    forData(data) {
      let obj = {};
      //map循环方式
      data.map(function(e, item) {
        obj[e] = "";
      });
      return obj;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  min-width: 1366px;
  overflow-x: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 1366px;
  overflow-x: auto;
}
.cardAll-wrap {
  padding-top: 10px;
  /*padding-left: 30px;*/
  /*padding-right: 45px;*/
  // margin: 0 auto;
}
.card-box {
  display: flex;
  flex-wrap: wrap;
  padding-left: 0px;
  padding-right: 0px;
  // max-height: 520px;
  // overflow-y: scroll;
  // margin-right: -15px;
  .card-item {
    padding: 0 10px 0 10px;
    width: 20%;
    /*flex: 0 0 20%;
            max-width: 20%;*/
    .card {
      /*width: 17.555555%;
                margin: 0px 0px 30px 30px;
                min-width: 200px;
                float: left;*/
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid #eee;
      padding: 10px 0;

      .card-top {
        position: relative;
        font-size: 0;
        img {
          height: 100%;
          width: 100%;
        }
        .state-wrap {
          position: absolute;
          left: 0;
          bottom: 0;
          font-size: 12px;
          background: rgba(5, 5, 5, 0.2);
          padding: 5px 5px;
        }
      }
    }
  }
}
.card-bottom .date-time {
  width: 100%;
  padding: 10px 10px 10px 10px;
}
.fa-eye {
  margin-right: 5px;
}
.listname {
  width: 6px;
  height: 24px;
  background: orange;
}
</style>