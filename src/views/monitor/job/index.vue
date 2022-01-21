<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="任务名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务组名" prop="jobGroup">
        <el-select v-model="queryParams.jobGroup" placeholder="请选择任务组名" clearable size="small">
          <el-option
            v-for="dict in jobGroupOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择任务状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          v-hasPermi="['monitor:job:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['monitor:job:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:job:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['monitor:job:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-s-operation"
          size="mini"
          @click="handleJobLog"
          v-hasPermi="['monitor:job:query']"
        >日志</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="fuzhiUpdate"
          v-hasPermi="['monitor:job:edit']"
        >复制</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="jobList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="任务编号" align="center" prop="jobId" />
      <el-table-column label="任务名称" align="center" prop="jobName" :show-overflow-tooltip="true" />
      <el-table-column label="任务组名" align="center" prop="jobGroup" :formatter="jobGroupFormat" />
      <el-table-column prop="type" label="周期类型" align="center" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.type =='H'">小时</span>
            <span v-else-if="scope.row.type =='D'">天</span>
            <span v-else-if="scope.row.type =='W'">周</span>
            <span v-else-if="scope.row.type =='M'">月</span>
            <span v-else-if="scope.row.type =='S'">季</span>
            <span v-else-if="scope.row.type =='Y'">年</span>
          </template>
      </el-table-column>

      <el-table-column prop="timeInteval" label="时间区间" align="center" width="100px"></el-table-column>

       <el-table-column prop="redo" label="是否重做" align="center" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.redo =='0'">标准</span>
            <span v-else-if="scope.row.redo =='1'">重做</span>
          </template>
      </el-table-column>

      <el-table-column label="调用目标字符串" align="center" prop="invokeTarget" :show-overflow-tooltip="true" />
      <el-table-column label="cron执行表达式" align="center" prop="cronExpression" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-caret-right"
            @click="handleRun(scope.row)"
            v-hasPermi="['monitor:job:edit']"
          >执行一次</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['monitor:job:query']"
          >详细</el-button>
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

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body class="addcomemtd" style="overflow: hidden;">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="form.jobName" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobGroup">
              <el-select v-model="form.jobGroup" placeholder="请选择">
                <el-option
                  v-for="dict in jobGroupOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item prop="invokeTarget">
              <span slot="label">
                调用方法
                <el-tooltip placement="top">
                  <div slot="content">
                    Bean调用示例：ryTask.ryParams('ry')
                    <br />Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
                    <br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.invokeTarget" placeholder="请输入调用目标字符串" />
            </el-form-item>
          </el-col>
        <!--固定参数-->
          <el-col :span="21" style="margin-left: 5%; margin-bottom: 2%;">
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item title="固定参数" style='font-weight: bold !important' name="1">
                  <el-col :span="1.5">
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      style="margin-bottom:10px"
                      @click="AddClick"
                    >新增</el-button>
              </el-col>
                <el-table :data="tableData" border style="width: 100%;margin:0 auto" @row-dblclick="dbclick" v-if="tableData">
      <el-table-column prop="index" label="序号" align="center" width="50px">
        <template slot-scope="scope">
          <el-form :model="scope.row">
            <el-form-item size="mini">
               <!-- <el-input v-if="scope.row.isOK" v-model="scope.row.index" style="width:100%;hight:100%"></el-input> -->
              <span >{{scope.row.index}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="参数名称" align="center">
        <template slot-scope="scope">
          <el-form :model="scope.row">
            <el-form-item size="mini" >
              <el-input v-if="scope.row.isOK" v-model="scope.row.name" style="width:100%;hight:100%" @change="fixedstrinputchange(scope.row)"></el-input>
              <span v-else>{{scope.row.name}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="key" label="参数标识" align="center" width="100px">
          <template slot-scope="scope">
          <el-form :model="scope.row">
            <el-form-item size="mini" >
              <el-input v-if="scope.row.isOK" v-model="scope.row.key"  style="width:100%;hight:100%" @change="fixedstrinputchange(scope.row)"></el-input>
              <span v-else>{{scope.row.key}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
       <el-table-column prop="value" label="参数值" align="center">
          <template slot-scope="scope">
          <el-form :model="scope.row">
            <el-form-item size="mini" >
              <el-input v-if="scope.row.isOK" v-model="scope.row.value" style="width:100%;hight:100%" @change="fixedstrinputchange(scope.row)"></el-input>
              <span v-else>{{scope.row.value}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="70px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="Deleteclick(scope.$index, scope.row)">删除</el-button>
              </template>
        </el-table-column>
        </el-table>
              </el-collapse-item>
            </el-collapse>
          </el-col>
         <!-- 动态参数-->
        <el-col :span="21" style="margin-left: 5%; margin-bottom: 2%;">
              <el-collapse v-model="activeName1" accordion>
                <el-collapse-item title="动态参数" style='font-weight: bold !important' name="1">
                    <el-col :span="1.5">
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        style="margin-bottom:10px"
                        @click="AddClick1"
                      >新增</el-button>
                </el-col>
                  <el-table :data="tableData1" border style="width: 100%;margin:0 auto" @row-dblclick="dbclick1" v-if="tableData1">
        <el-table-column prop="index" label="序号" align="center" width="50px">
          <template slot-scope="scope1">
            <el-form :model="scope1.row">
              <el-form-item size="mini">
                <!-- <el-input v-if="scope.row.isOK" v-model="scope.row.index" style="width:100%;hight:100%;padding:0" :label='scope.row.index'></el-input> -->
                <span>{{scope1.row.index}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="参数名称" align="center">
          <template slot-scope="scope1">
            <el-form :model="scope1.row">
              <el-form-item size="mini" >
                <el-input v-if="scope1.row.isOK" v-model="scope1.row.name" @change="dynamicstsinputchange(scope1.row)" style="width:100%;hight:100%"></el-input>
                <span v-else>{{scope1.row.name}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="key" label="参数标识" align="center" width="100px">
            <template slot-scope="scope1">
            <el-form :model="scope1.row">
              <el-form-item size="mini" >
                <el-input v-if="scope1.row.isOK" v-model="scope1.row.key" @change="dynamicstsinputchange(scope1.row)" style="width:100%;hight:100%"></el-input>
                <span v-else>{{scope1.row.key}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

       

         <el-table-column prop="value" label="参数值" align="center">
            <template slot-scope="scope1">
            <el-form :model="scope1.row">
              <el-form-item size="mini" >
                <el-input v-if="scope1.row.isOK" v-model="scope1.row.value" @change="dynamicstsinputchange(scope1.row)" style="width:100%;hight:100%"></el-input>
                <span v-else>{{scope1.row.value}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="70px">
                <template slot-scope="scope1">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="Deleteclick1(scope1.$index, scope1.row)">删除</el-button>
                </template>
          </el-table-column>
          </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-col>
              <!-- 动态参数end -->
          <el-col :span="12">
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="请输入cron执行表达式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发" prop="concurrent">
              <el-radio-group v-model="form.concurrent" size="small">
                <el-radio-button label="0">允许</el-radio-button>
                <el-radio-button label="1">禁止</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="错误策略" prop="misfirePolicy">
              <el-radio-group v-model="form.misfirePolicy" size="small">
                <el-radio-button label="1">立即执行</el-radio-button>
                <el-radio-button label="2">执行一次</el-radio-button>
                <el-radio-button label="3">放弃执行</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

           <el-col :span="14">
              <el-form-item label="时间区间" prop="timeInteval">
               <el-input v-model="form.timeInteval" placeholder="请输入时间" />

                      <!-- <el-date-picker
                           v-model="form.timeInteval"
                           type="datetimerange"
                           range-separator="至"
                           start-placeholder="开始日期"
                           end-placeholder="结束日期">
                         </el-date-picker> -->
              </el-form-item>
           </el-col>
           

          <el-col :span="24">
            <el-form-item label="周期类型">
              <el-radio-group v-model="form.type">
                <el-radio
                  v-for="dict in reformType"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
           <el-col :span="24">
              <el-form-item label="是否重做">
                <el-radio-group v-model="form.redo">
                  <el-radio
                    v-for="dict in redoOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                  >{{dict.dictLabel}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
         <el-col :span="24" v-if="form.redo=='1'">
           <el-form-item label="时间范围">
            <el-date-picker
      v-model="timevalue"
       type="datetimerange"
            value-format="yyyy-MM-dd HH:mm"
            range-separator="——"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
    </el-date-picker>
    </el-form-item>
        </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 任务日志详细 -->
    <el-dialog title="任务详细" :visible.sync="openView" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务编号：">{{ form.jobId }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ jobGroupFormat(form) }}</el-form-item>
            <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cron表达式：">{{ form.cronExpression }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次执行时间：">{{ parseTime(form.nextValidTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用目标方法：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发：">
              <div v-if="form.concurrent == 0">允许</div>
              <div v-else-if="form.concurrent == 1">禁止</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行策略：">
              <div v-if="form.misfirePolicy == 0">默认策略</div>
              <div v-else-if="form.misfirePolicy == 1">立即执行</div>
              <div v-else-if="form.misfirePolicy == 2">执行一次</div>
              <div v-else-if="form.misfirePolicy == 3">放弃执行</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openView = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listJob, getJob, delJob, addJob, updateJob, exportJob, runJob,isZeroToTwentyfour, changeJobStatus } from "@/api/monitor/job";

export default {
  name: "Job",
  data() {
      

    return {
      from:{},
      timevalue:[],
      tablelendth:'1',
      tableData: [],
      tableData1: [],
      redoOptions:[
     {
       dictValue:"0",
       dictLabel:"标准"
     },
      {
       dictValue:"1",
       dictLabel:"重做"
     }
   ],
   reformType:[
         {
           dictValue:"H",
           dictLabel:"时"
         },
          {
           dictValue:"D",
           dictLabel:"天"
         },
         {
           dictValue:"W",
           dictLabel:"周"
         },
         {
           dictValue:"M",
           dictLabel:"月"
         },
         {
           dictValue:"S",
           dictLabel:"季"
         },
         {
           dictValue:"Y",
           dictLabel:"年"
         }
     ],
      activeName:'1',
       activeName1:'1',
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
      // 定时任务表格数据
      jobList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示详细弹出层
      openView: false,
      // 任务组名字典
      jobGroupOptions: [],
      // 状态字典
      statusOptions: [],
      num:1,
       num1:1,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: undefined,
        jobGroup: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        type:'H'
      },
      fixedstr:'',
      dynamicsts:'',
      // 表单校验
      rules: {
        jobName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" }
        ],
        invokeTarget: [
          { required: true, message: "调用目标字符串不能为空", trigger: "blur" }
        ],
        cronExpression: [
          { required: true, message: "cron执行表达式不能为空", trigger: "blur" }
        ],


      }
    };
  },
  created() {
    this.getList();
    // this.tablelendth=this.tableData.length
    this.getDicts("sys_job_group").then(response => {
      this.jobGroupOptions = response.data;
    });
    this.getDicts("sys_job_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
      dbclick(row, event, column){
        row.isOK =!row.isOK
     },
     dbclick1(row, event, column){
        row.isOK =!row.isOK
     },
    AddClick(){
      this.num = this.tableData.length+1
      let obj={
      isOK: false,
      name: "",
      identification: "",
      index:this.num,
      type:'H',
      isshow:"",
      options:"",
      default:'',
      key:'',
      value:''
      }
      this.tableData.push(obj)
    
    },
    AddClick1(){
     this.num1 = this.tableData1.length+1
      let obj={
      isOK: false,
      name: "",
      identification: "",
      index:this.num1,
      type:'H',
      isshow:"",
      options:"",
      default:'',
      key:'',
      value:''
      }
  
      this.tableData1.push(obj)
    },
    /** 查询定时任务列表 */
    getList() {
      this.loading = true;
      listJob(this.queryParams).then(response => {
        this.jobList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    Deleteclick(index,row){
      this.tableData.splice(index,1)
      if(this.tableData.length==0){
        this.num1 =1
      }else{
        for(var i=0;i<this.tableData.length;i++){
          this.tableData[i].index = i+1
        }
        this.num1 = this.tableData.length
      }
      this.fixedstrinputchange()
    },
    Deleteclick1(index,row){
      this.tableData1.splice(index,1)
      if(this.tableData1.length==0){
        this.num =1
      }else{
        for(var i=0;i<this.tableData1.length;i++){
          this.tableData1[i].index = i+1
        }
        this.num = this.tableData1.length+1
      }
      this.dynamicstsinputchange()
    },
    // 任务组名字典翻译
    jobGroupFormat(row, column) {
      return this.selectDictLabel(this.jobGroupOptions, row.jobGroup);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.reset();
      this.open = false;
      
    },
    // 表单重置
    reset() {
      this.form = {
        jobId: undefined,
        jobName: undefined,
        jobGroup: undefined,
        invokeTarget: undefined,
        cronExpression: undefined,
        misfirePolicy: 1,
        concurrent: 1,
        status: "0",
        fixedParams:undefined,//固定参数
        dynamicParams:undefined,//动态参数
        redo:"0",
        type: "H",
        timeInteval:undefined
      };
      this.num =1
      this.num1 =1
      this.tableData1 = []
      this.tableData = []
      this.timevalue=[]
      this.fixedstr = ''
       this.dynamicsts = ''
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
      this.ids = selection.map(item => item.jobId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 任务状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.jobName + '"任务吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeJobStatus(row.jobId, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /* 立即执行一次 */
    handleRun(row) {
      this.$confirm('确认要立即执行一次"' + row.jobName + '"任务吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return runJob(row.jobId, row.jobGroup);
        }).then(() => {
          this.msgSuccess("执行成功");
        }).catch(function() {});
    },
    /** 任务详细信息 */
    handleView(row) {
      getJob(row.jobId).then(response => {
        this.form = response.data;
        this.openView = true;
      });
    },
    /** 任务日志列表查询 */
    handleJobLog() {
      this.$router.push("/job/log");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加任务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      
      this.reset();
      this.tableData = []
      let fixedArray = []
      let dynamicArray = []
       this.timevalue=[]
      const jobId = row.jobId || this.ids;
      getJob(jobId).then(response => {
        if(response.data.redo =='1' && response.data.beginTime != null && response.data.endTime != null){
              this.timevalue.push(response.data.beginTime)
              this.timevalue.push(response.data.endTime)
        }else if(response.data.redo =='0'){
          this.timevalue=[]
        }else{
          this.timevalue=[]
        }
        this.fixedstr = response.data.fixedParams
        this.dynamicsts = response.data.dynamicParams
         fixedArray=JSON.parse(response.data.fixedParams)
        if(response.data.fixedParams !=null || fixedArray&& fixedArray.length!=0){
          this.tableData=this.creatArray(fixedArray)
        }
           dynamicArray = JSON.parse(response.data.dynamicParams)
        if(response.data.dynamicParams !=null || dynamicArray&& dynamicArray.length!=0){
          this.tableData1 = this.creatArray(dynamicArray)
        }
      
       
        this.form = response.data;
        this.open = true;
        this.title = "修改任务";
      });
    },
     /** 复制按钮操作 */
    fuzhiUpdate(){
      this.reset();
      this.tableData = []
      this.tableData1 =[]
      let fixedArray = []
      let dynamicArray = []
      this.timevalue=[]
      const jobId = this.ids;
      getJob(jobId).then(response => {
        if(response.data.redo =='1' && response.data.beginTime != null && response.data.endTime != null){
              this.timevalue.push(response.data.beginTime)
              this.timevalue.push(response.data.endTime)
        }else if(response.data.redo =='0'){
          this.timevalue=[]
        }else{
          this.timevalue=[]
        }
        this.fixedstr = response.data.fixedParams
        this.dynamicsts = response.data.dynamicParams
        if(response.data.fixedParams !=null || response.data.fixedParams !=''){
          fixedArray=JSON.parse(response.data.fixedParams)
          this.tableData=this.creatArray(fixedArray)
        }
        if(response.data.dynamicParams !=null || response.data.dynamicParams !=''){
          dynamicArray = JSON.parse(response.data.dynamicParams)
          this.tableData1 = this.creatArray(dynamicArray)
        }
      
      
        this.form = response.data;
        this.open = true;
        this.title = "复制任务";
      });
    },
    creatArray(data){
      let objarr = []
      for(var i=0; i<data.length;i++){
        let keys= Object.keys(data[i]);
         let newobj = {}
          for(var j=0;j<keys.length;j++){
            if(keys[j] !='name'){
              newobj.key=keys[j]
              newobj.value = data[i][keys[j]]
            }else{
              newobj.name = data[i].name
              newobj.index = i+1
              newobj.isOK = false
            }
          }
          objarr.push(newobj)
      }
      return objarr
    },
    fixedstrinputchange(){
      
       this.fixedstr=this.forArray(this.tableData)
    },
    dynamicstsinputchange(){
       this.dynamicsts=this.forArray(this.tableData1)
    },
    forArray(data){
      let obj = {}
      let objarray = []
      for(var i = 0;i<data.length;i++){
        obj = {}
        obj.name=data[i].name
        obj[data[i].key]=data[i].value
        objarray.push(obj)
      }
      return JSON.stringify(objarray)
    },
    /** 提交按钮 */
    submitForm: function() { 
      if(this.timevalue !=null && this.timevalue.length !=0){
          this.form.beginTime=this.timevalue[0] 
          this.form.endTime=this.timevalue[1]
      }else if(this.timevalue == null){
        this.timevalue = []
        this.form.beginTime=null
        this.form.endTime=null
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.jobId != undefined && this.title =='修改任务' ) {
            if(this.form.redo =='1' && this.form.beginTime == null && this.form.endTime == null){
                this.$message.error('请选择时间范围');
            }else{
               this.form.fixedParams=this.fixedstr;//固定
             this.form.dynamicParams=this.dynamicsts;//动态
            updateJob(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.tableData=[]
                this.tableData1 = []
                this.getList();
              }
            });
            }
          } else if(this.title =='添加任务') {
             this.form.fixedParams=this.fixedstr;//固定
             this.form.dynamicParams=this.dynamicsts;//动态
            addJob(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                this.tableData=[]
                this.tableData1 = []
              }
            });
          }else if(this.title =='复制任务') {
              this.form.jobId = null,
             this.form.fixedParams=this.fixedstr;//固定
             this.form.dynamicParams=this.dynamicsts;//动态
            addJob(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("复制成功");
                this.open = false;
                this.getList();
                this.tableData=[]
                this.tableData1 = []
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const jobIds = row.jobId || this.ids;
      this.$confirm('是否确认删除定时任务编号为"' + jobIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delJob(jobIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有定时任务数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportJob(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>

<style scoped>
.el-input__inner{
  text-align: center;
  padding: 0 !important;
}
.el-collapse-item__header.is-active{
    font-weight:bold;
}
.el-collapse-item__header{
    font-weight:bold;
}
/deep/ .el-dialog{
  max-height: 800px;
  overflow-y: auto;
}
/deep/.el-form-item--mini.el-form-item{
  margin-bottom: 0;
}
</style>
