<template>
  <div class="FireTj">
    <!-- 饼状图 -->
    <el-container class="hotspot-pie">
      <el-header style="height:10%;justify-content: space-between;">
        <div>
          <img src="../../../../assets/bigscreen/nine17.png" alt class="headerimg" />
          <span class="headerspan">各区县当天火点数比</span>
        </div>
        <i
          class="el-icon-close headclose"
          @click="closeClick()"
        ></i>
        <div class="aswactive-el"></div>
      </el-header>
      <el-main class="conenthotpottj" style="padding:0">
        <div v-if="series==false" id="pmtop" class="nohasdata">
           暂无数据
        </div>
        <div id="daypie" style="overflow: hidden;" v-else></div>
      </el-main>
    </el-container>

    <!-- 饼状图 -->
    <el-container class="hotspot-pie">
      <el-header style="height:10%">
        <img src="../../../../assets/bigscreen/nine17.png" alt class="headerimg" />
        <span class="headerspan">各区县近七日火点数比</span>
        <div class="aswactive-el"></div>
      </el-header>
      <el-main class="conenthotpottj" style="padding:0">
        <div v-if="weekpied==false" id="pmtop" class="nohasdata">
           暂无数据
        </div>
        <div id="weekpie" style="overflow: hidden;" v-else></div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getStatistic } from "@/api/bigscreen/bigscreen.js";
export default {
  name: "FireTj",
  data() {
    return {
      loading: true,
      weekpied:true,
      series:true
    };
  },
  mounted() {},
  methods: {
    closeClick() {
      let str = "fire";
      this.$emit("closeClick", str);
    },
    getFireTjdata(time) {
      let par = {
        areaId: "130100",
        newTime: time
      };
      let me = this;
      getStatistic(par).then(response => {
        if (response.msg == "操作成功") {
          //各区县当天火点数比
          me.getdaypieData(response.data["newDayZB"]);
          //各区县本周火点数比
          me.getweekpie(response.data["7DayZB"]);
        }
      });
    },
    getweekpie(data) {
      if(data==null || data==[] || data.length==0){
        this.weekpied=false
      }else{
        this.weekpied=true
 let dataed = [];
      for (var i = 0; i < data.length; i++) {
        let obj = {};
        obj.value = data[i].NUM;
        obj.name = data[i].NAME;
        dataed.push(obj);
      }
      let chart1 = document.getElementById("weekpie");
      let mychart1 = this.$echarts.init(chart1, "light");
      var colorList = [
        "#73DDFF",
        "#EFA513",
        "#17EF13",
        "#EF3113",
        "#EF1397",
        "#9E87FF",
        "#58D5FF",
        "#D4EC0B"
      ];
      const option = {
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
            name: "点数",
            type: "pie",
            center: ["50%", "50%"],
            radius: ["15%", "40%"],
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
    getdaypieData(seriesData) {
      for(var i=0;i<seriesData.length;i++){
        if(seriesData[i].NAME == undefined){
          seriesData[i].NAME= '鹿泉区'
        }
      }
      if(seriesData==null || seriesData.length==0 || seriesData==[]){
        this.series=false
      }else{
         this.series=true
 let chart1 = document.getElementById("daypie");
      let mychart1 = this.$echarts.init(chart1, "light");
      var xData = [],
        yData = [];
      for (var i = 0; i < seriesData.length; i++) {
        yData.push(seriesData[i].NUM);
        xData.push(seriesData[i].NAME);
      }
      const option = {
        grid: {
          left: "3%",
          right: "5%",
          bottom: "10%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          name: "",
          type: "category",
          data: xData,
          axisLine: {
            lineStyle: {
              color: "#999"
            }
          },
          axisLabel: {
            formatter: function(value) {
              return value.split("").join("\n");
            },
            textStyle: {
              color: "#fff",
              fontStyle: "normal",
              fontFamily: "微软雅黑",
              fontSize: 14
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          name: "",
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#999"
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            data: yData,
            type: "bar",
            name: "",
            label: {
              show: true, // 开启显示
              rotate: 0, // 旋转70度
              position: "top", // 在上方显示
              distance: 20, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
              verticalAlign: "middle",
              textStyle: {
                // 数值样式
                color: "#fff",
                fontSize: 12
              }
            },
            itemStyle: {
              normal: {
                barBorderRadius: [6, 6, 0, 0],
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 1,
                    color: "#73DDFF"
                  },
                  {
                    offset: 0,
                    color: "#EAE41F"
                  }
                ])
              }
            },
            barWidth: "20%"
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
.FireTj {
  height: 100%;
  width: 100%;
}
.hotspot-pie {
  height: 45.7%;
  width: 100%;
}
.FireTj .el-header {
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
#weekpie,
#daypie {
  height: 100%;
  width: 100%;
}
.nohasdata{
  font-size: 18px;
    color: #888785;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
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
