<template>
  <div class="FloorTj">
    <!-- 饼状图 -->
    <el-container class="hotspot-pie">
      <el-header style="height:16%;justify-content: space-between;">
        <div>
          <img src="../../../../assets/bigscreen/nine17.png" alt class="headerimg" />
        <span class="headerspan">AQI状态点位数占比统计</span>
        </div>
         <i class="el-icon-close headclose" @click="closeClick()"></i>
         <div class="aswactive-el"></div>
      </el-header>
      <el-main class="conenthotpottj" style="padding:0">
         <div v-if="floordat==false" id="pmtop" class="nohasdata">
           暂无数据
        </div>
        <div id="floorpie" style="overflow: hidden" v-else></div>

      </el-main>
    </el-container>

    <el-container class="floor-pie">
      <el-header style="height:8%">
        <img src="../../../../assets/bigscreen/nine17.png" alt class="headerimg" />
        <span class="headerspan">AQI排名前十和后十站点数据</span>
        <div class="aswactive-el"></div>
      </el-header>
      <el-main class="conenthotpottj" style="padding:0;overflow-y: auto;">
        <div class="divSty">
          <table class="tableSty" border="1" bordercolor="#73c9ea">

            <tr>
              <td colspan="10" class="table_titleSty">AQI排名后十的站点信息</td>
            </tr>
            <tr style="font-weight: bold">
              <td style="width: 10%">排名</td>
              <td style="width: 28%">站点名称</td>
              <td style="width: 9%">AQI</td>
              <td style="width: 9%">
                PM
                <span style="font-size: 1px;">2.5</span>
              </td>
              <td style="width: 9%">
                PM
                <span style="font-size: 1px;">10</span>
              </td>
              <td style="width: 9%">操作</td>
            </tr>
            <tr v-if="list ==[]  || list ==null || list.length==0" class="" style="color:#888785"><td colspan="10">暂无数据</td></tr>
            <tr v-for="(item,index) in list" :key="index" style="cursor: pointer;" v-else>
              <td>{{index+1}}</td>
              <td>{{item.POINTNAME}}</td>
              <td>{{item.AQI}}</td>
              <td>{{item.PM25}}</td>
              <td>{{item.PM10}}</td>
              <td>
                <el-tooltip
                  effect="dark"
                  content="定位"
                  placement="right"
                  style
                  popper-class="draw_share_atooltip"
                >
                  <div class="tableList">
                    <span
                      class="tableListicon"
                      @click="buttonClicks(item,index)"
                      :class="isactives == index ? 'noshow' : 'isshow' "
                    ></span>
                  </div>
                </el-tooltip>
              </td>
            </tr>

                        <tr>
              <td colspan="10" class="table_titleSty">AQI排名前十的站点信息</td>
            </tr>
            <tr style="font-weight: bold">
              <td style="width: 10%">排名</td>
              <td style="width: 28%">站点名称</td>
              <td style="width: 9%">AQI</td>
              <td style="width: 9%">
                PM
                <span style="font-size: 1px;">2.5</span>
              </td>
              <td style="width: 9%">
                PM
                <span style="font-size: 1px;">10</span>
              </td>
              <td style="width: 9%">操作</td>
            </tr>
            <tr v-if="first ==[]  || first ==null || first.length==0" class="" style="color:#888785"><td colspan="10">暂无数据</td></tr>
            <tr v-for="(item,index) in first" :key="'info2-'+index" style="cursor: pointer;" v-else>
              <td>{{index+1}}</td>
              <td>{{item.POINTNAME}}</td>
              <td>{{item.AQI}}</td>
              <td>{{item.PM25}}</td>
              <td>{{item.PM10}}</td>
              <td>
                <el-tooltip
                  effect="dark"
                  content="定位"
                  placement="right"
                  style
                  popper-class="draw_share_atooltip"
                >
                  <div class="tableList">
                    <span
                      class="tableListicon"
                      @click="buttonClick(item,index)"
                      :class="isactive == index ? 'noshow' : 'isshow' "
                    ></span>
                  </div>
                </el-tooltip>
              </td>
            </tr>
          </table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "FloorTj",
  props: {
    first: {
      type: Array //type为Array,default为函数
    },
    list: {
      type: Array
    }
  }, //用props属性进行传数据，此时子组件已经获取到list的数据了
  data() {
    return {
      loading: [],
      isactive: null,
      isactives: null,
      floordat:true
    };
  },
  methods: {
    closeActive(){
      this.isactive=null,
      this.isactives=null
    },
    closeClick(){
      let str='floor'
      this.$emit('closeClick',str)
    },
    buttonClick(row, index) {
      this.isactives=null
      this.isactive = index;
      row.name = "floor";
      this.$emit("getmap", row);
    },
    buttonClicks(row, index) {
      this.isactive=null
      this.isactives = index;
      row.name = "floor";
      this.$emit("getmap", row);
    },
    getPieData(chartData) {
      if(chartData==[] || chartData==null || chartData.length==0){
        this.floordat=false
      }else{
      let dataed = [];
      for (var i = 0; i < chartData.length; i++) {
        let obj = {};
        obj.value = chartData[i].NUM;
        obj.name = chartData[i].NAME;
        dataed.push(obj);
      }
      let chart1 = document.getElementById("floorpie");
      let mychart1 = this.$echarts.init(chart1, "light");
        var colorList = [
        "#73DDFF",
        "#EFA513",
        "#17EF13",
        "#EF3113",
        "#EF1397",
        "#9E87FF",
        "#58D5FF"
      ];
      let option = {
        label: {
          show: true,
          formatter: "{b}({d}%)"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/>{a}: {c} ({d}%)"
        },
        color:colorList,
        series: [
          {
            name: "数量",
            type: "pie",
            center: ["50%", "47%"],
            radius: ["15%", "50%"],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 13
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: dataed
          }
        ]
      };
      mychart1.setOption(option, true);
      window.addEventListener("resize", function() {
        mychart1.resize();
      });
      }

    }
  }
};
</script>

<style scoped>
.FloorTj {
  width: 100%;
  height: 100%;
}
.hotspot-pie {
  height: 30%;
  width: 100%;
}
.floor-pie {
  height: 61.5%;
  width: 100%;
}
.FloorTj .el-header {
  width: 100%;
  background: rgba(4,31,51, 0.95);
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 20px rgb(11,99,160) inset;
  /* border-bottom: 1px solid rgba(39, 93, 108, 0.9); */
  position: relative;
  /* box-shadow: 0 2px 3px -1px  inset; */
}
.aswactive-el {
  position: absolute;
  height: 1px;
  left: 0;
  bottom: 0px;
  width: 100%;
  background: url("../../../../assets/image/businessSys/monitoringSystem/active2.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.headerimg {
  height: 16px;
  width: 16px;
  margin-right: 20px;
}
.headerspan {
  color: #fff;
  font-family: MicrosoftYaHei;
  font-size: 16px;
}
.conenthotpottj {
  background: rgba(16,27,38, 0.95);
  height: 85%;
  width: 100%;
}
#floorpie,
#dayfloor {
  height: 100%;
  width: 100%;
}
.divSty {
  overflow-y: auto;
  max-height: 96%;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  padding-top: 10px;
}

.tableSty {
  text-align: center;
  border-collapse: collapse;
  line-height: 30px;
  color: #fff;
  margin: 5px 2px 10px 2px;
  width: 95%;
}

.table_titleSty {
  font-size: 15px;
  font-weight: bold;
  color: #e6a809;
}
.tableList {
  overflow: hidden;
  background: none;
  text-align: center;
  cursor: pointer;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
}
.tableListicon {
  width: 14px;
  height: 14px;
  vertical-align: middle;
  display: inline-block;
  background: url(//webmap0.bdimg.com/wolfman/static/common/images/ipLocation/ipLocation_72a86af.png);
  background-size: 76px, auto;
}
.noshow {
  background-position: -14px 0;
}
.isshow {
  background-position: -28px 0;
}
.headclose{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}
 .headclose:hover{
  color: #F31A08;
  font-size: 22px;
  font-weight: bolder;
}

.divSty::-webkit-scrollbar {
  display: none !important;
}

</style>

<style>
.divSty::-webkit-scrollbar {
  display: none; /*隐藏滚动条*/
}
.conenthotpottj::-webkit-scrollbar {
  display: none; /*隐藏滚动条*/
}
</style>
 