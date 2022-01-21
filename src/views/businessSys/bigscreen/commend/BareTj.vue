<template>
  <div class="BareTj">
    <!-- 饼状图 -->
    <el-container class="hotspot-pie">
      <el-header style="height:15%;justify-content: space-between;">
       <div>
          <img src="../../../../assets/bigscreen/nine17.png" alt class="headerimg" />
        <span class="headerspan">各区县地块数比统计</span>
       </div>
        <i class="el-icon-close headclose"  @click="closeClick()"></i>
        <div class="aswactive-el"></div>
      </el-header>
      <el-main class="conenthotpottj" style="padding:0">
        <div class="nohasdata"  v-if="barePeidata==false">暂无数据</div>
        <div id="barePei" style="overflow: hidden;" v-else></div>

      </el-main>
    </el-container>

    <el-container class="hotspot-pie">
      <el-header style="height:15%">
        <img src="../../../../assets/bigscreen/nine17.png" alt class="headerimg" />
        <span class="headerspan">各区县地块面积比统计</span>
        <div class="aswactive-el"></div>
      </el-header>
      <el-main class="conenthotpottj" style="padding:0">
        <div class="nohasdata" v-if="badata==false">暂无数据</div>
        <div id="baremian" style="overflow: hidden;" v-else></div>

      </el-main>
    </el-container>

    <el-container class="floor-pie">
      <el-header style="height:15%">
        <img src="../../../../assets/bigscreen/nine17.png" alt class="headerimg" />
        <span class="headerspan">地块最大的前十块裸地数据</span>
        <div class="aswactive-el"></div>
      </el-header>
      <el-main class="conenthotpottj" style="padding:0">

        <div class="divSty" :loading="loading" >
          <table class="tableSty" border="1" bordercolor="#73c9ea">
            <tr>
              <td colspan="10" class="table_titleSty">地块最大的前十块裸地数据</td>
            </tr>
            <tr style="font-weight: bold">
              <td style="width: 15%">排名</td>
              <td style="width: 28%">区域名称</td>
              <td style="width: 36%">裸地面积(m²)</td>
              <td style>操作</td>
            </tr>
            <tr v-if="baredata ==[]  || baredata ==null || baredata.length==0" class="" style="color:#888785"><td colspan="10">暂无数据</td></tr>
            <tr v-for="(item,index) in baredata" :key="'info2-'+index" v-else>
              <td>{{index+1}}</td>
              <td>{{item.newname}}</td>
              <td>{{item.areaed}}</td>
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
import axios from "axios";
export default {
  name: "BareTj",
  props: {
    baredata: {
      type: Array
    }
  },
  data() {
    return {
      isactive: null,
      barePeidata:true,
      loading: false,
      badata: true
    };
  },
  methods: {
    closeClick(){
      let str='bare'
      this.$emit('closeClick',str)
    },
    closeActive(){
      this.isactive=null
    },
    cleardata() {
      this.isactive = null;
    },
    buttonClick(row, index) {
      this.isactive = index;
      row.county=row.name
      row.name = "bare";
      this.$emit("getmap", row);
    },
    getbarepietop(data) {
      if(data == [] || data.length== 0 || data== null){
        this.barePeidata = false
      }else{
         this.barePeidata = true;
      let dataed = [];
      for (var i = 0; i < data.length; i++) {
        let obj = {};
        obj.value = data[i].count;
        obj.name = data[i].name;
        dataed.push(obj);
      }
       let chart1 = document.getElementById("barePei");
        let mychart1 = this.$echarts.init(chart1, "light");
        const option = {
          label: {
            show: true,
            formatter: "{b}({d}%)"
          },
          tooltip: {
            trigger: "item",
            formatter: "{b} <br/>{a}: {c} ({d}%)"
          },
          series: [
            {
              name: "块数",
              type: "pie",
              center: ["50%", "50%"],
              radius: ["24%", "40%"],
              roseType: "area",
              label: {
                normal: {
                  show: true
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: dataed.sort(function(a, b) {
                return a.value - b.value;
              })
            }
          ]
        };
        mychart1.setOption(option, true);
        window.addEventListener("resize", function() {
          mychart1.resize();
        });
      }

    },
    getPieData(chartData) {
      if(chartData==[] || chartData.length==0 || chartData== null){
        this.badata= false
      }else{
          this.badata = true;
      let dataed = [];
      for (var i = 0; i < chartData.length; i++) {
        let obj = {};
        obj.value = Math.round(chartData[i].sum);
        obj.name = chartData[i].name;
        dataed.push(obj);
      }
     let chart1 = document.getElementById("baremian");
        let mychart1 = this.$echarts.init(chart1, "light");
        var colorList = [
          "#73DDFF",
          "#73ACFF",
          "#FDD56A",
          "#FDB36A",
          "#FD866A",
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
            formatter: "{b} <br/>{a}: {c}(m²) ({d}%)"
          },
          series: [
            {
              name: "面积",
              type: "pie",
              center: ["51%", "51%"],
              radius: ["15%", "40%"],
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

    },
    
  }
};
</script>

<style scoped>
.BareTj {
  height: 100%;
  width: 100%;
}
.hotspot-pie {
  height: 30%;
  width: 100%;
}
.BareTj .el-header {
  width: 100%;
  background: rgba(4,31,51, 0.95);
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 20px rgb(11,99,160) inset;
  /* border-bottom: 1px solid rgba(39, 93, 108, 0.9); */
  position: relative;
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
  background: rgba(3, 38, 66, 0.9);
  height: 75%;
  width: 100%;
}
#barePei,
#baremian {
  height: 100%;
  width: 100%;
}
.divSty {
  overflow-y: auto;
  max-height: 96%;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  margin-top: 7px;
}
.divSty::-webkit-scrollbar {
  display: none; /*隐藏滚动条*/
}
.floor-pie {
  height: 30.1%;
  width: 100%;
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
  background-position: -14px 0;
}
.noshow {
  background-position: -14px 0;
}
.isshow {
  background-position: -28px 0;
}
.nohasdata {
  font-size: 18px;
  color: #888785;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
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
</style>
