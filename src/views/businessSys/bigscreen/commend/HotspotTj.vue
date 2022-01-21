<template>
  <div class="hotspots">
    <!-- 饼状图 -->
    <el-container class="hotspot-pie">
      <el-header style="height:15%;justify-content: space-between;">
        <div>
          <img src="../../../../assets/bigscreen/nine17.png" alt class="headerimg" />
          <span class="headerspan">区县热点网格分布</span>
        </div>
        <i class="el-icon-close headclose" style @click="closeClick()"></i>
        <div class="aswactive-el"></div>
      </el-header>
      <el-main class="conenthotpottj" style="padding:0">
        <div id="hotspotPie" style="overflow: hidden;" v-if="hasdata"></div>
        <div v-else id="hotspotPie" class="nohasdata">暂无数据</div>
      </el-main>
    </el-container>
    <!-- 柱状图 -->
    <el-container class="hotspot-pie">
      <el-header style="height:15%">
        <img src="../../../../assets/bigscreen/nine17.png" alt class="headerimg" />
        <span class="headerspan">区县企业污染类型统计 (个)</span>
        <div class="aswactive-el"></div>
      </el-header>
      <el-main class="conenthotpottj" style="padding:0">
        <div id="hotspotzhu" style="overflow: hidden;" v-if="zhuhasdata"></div>
        <div v-else id="hotspotPie" class="nohasdata">暂无数据</div>
      </el-main>
    </el-container>
    <!-- 折现图 -->
    <el-container class="hotspot-pie">
      <el-header style="height:15%">
        <img src="../../../../assets/bigscreen/nine17.png" alt class="headerimg" />
        <span class="headerspan">区县企业个数统计 (个)</span>
        <div class="aswactive-el"></div>
      </el-header>
      <el-main class="conenthotpottj" style="padding:0">
        <div id="hotspotzhe" style="overflow: hidden;" v-if="zhehasdata"></div>
        <div v-else id="hotspotPie" class="nohasdata">暂无数据</div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import $ from "jquery";
import {
  getgridTypeList,
  getcounty,
  getgridList
} from "@/api/bigscreen/bigscreen.js";
export default {
  props: {
    hottime: {
      type: String
    }
  },
  name: "HotspotTj",
  data() {
    return {
      timer: "",
      hasdata: true,
      zhuhasdata: true,
      zhehasdata: true
    };
  },
  watch: {
    hottime: function(val, oldval) {
      this.timer = val;
    }
  },
  mounted() {
    let me = this;
    this.$nextTick(() => {
      // me.getpieData();
    });
  },
  methods: {
    closeClick() {
      let str = "hotspot";
      this.$emit("closeClick", str);
    },
    //获取热点网格的企业类型数据
    getgridTypeListData(tiem) {
      let par = {
        dataTime: tiem
      };
      let me = this;
      getgridTypeList(par).then(response => {
        if (response.msg == "操作成功" && response.data.length > 0) {
          me.zhuEcharts(response.data);
        } else {
          this.zhuhasdata = false;
        }
      });
    },
    //获取热点网格的企业个数
    getcountyData(tiem) {
      let par = {
        dataTime: tiem
      };
      let me = this;
      getcounty(par).then(response => {
        if (response.msg == "操作成功" && response.data.length > 0) {
          let xdata = [];
          let ydata = [];
          for (var i = 0; i < response.data.length; i++) {
            xdata.push(response.data[i].AREANAME);
            ydata.push(response.data[i].NUM);
          }
          me.zheEcharts(xdata, ydata);
        } else {
          this.zhehasdata = false;
        }
      });
    },
    //获取饼状图数据
    getpieData(tiem) {
      let chartData = [];
      let me = this;
      let par= {
        dataTime: tiem
      }
      getgridList(par).then(response => {
        if (response.msg == "操作成功" && response.data.pie.length > 0) {
          let dat = response.data.pie;

          for (var i = 0; i < dat.length; i++) {
            let obj = {};
            obj.value = dat[i].COMPANYNUM;
            obj.name = dat[i].AREANAME;
            obj.data = dat[i].NEWTIME;
            chartData.push(obj);
          }
          me.pieEcharts(chartData);
        } else {
          me.hasdata = false;
        }
      });
    },
    pieEcharts(chartData) {
      let chart1 = document.getElementById("hotspotPie");
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
          formatter: "{b}(数量:{c}个)"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/>{a}: {c}个 ({d}%)"
        },
        color:colorList,
        series: [
          {
            name: "数量",
            type: "pie",
            center: ["50%", "50%"],
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
            data: chartData
          }
        ]
      };
      mychart1.setOption(option, true);
      window.addEventListener("resize", function() {
        mychart1.resize();
      });
    },
    zheEcharts(xdata, ydata) {
      let chartzhe = document.getElementById("hotspotzhe");
      let mychart1 = this.$echarts.init(chartzhe, "light");
      const option = {
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#036FC6"
            }
          }
        },
        legend: {
          x: "center",
          textStyle: {
            fontSize: 18, //字体大小
            color: "#ffffff" //字体颜色
          }
        },
        grid: {
          left: "3%",
          right: "10%",
          top: "10%",
          bottom: "5%",
          containLabel: true
        },

        xAxis: {
          type: "category",
          axisTick: {
            //决定是否显示坐标刻度
            alignWithLabel: true,
            show: true
          },
          boundaryGap: false, //坐标轴两边留白
          data: xdata,
          axisLabel: {
            textStyle: {
              color: "#fff",
              fontStyle: "normal",
              fontFamily: "微软雅黑",
              fontSize: 12
            },
            //坐标轴刻度标签的相关设置。
            interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
            formatter: function(params) {
              var newParamsName = "";
              var paramsNameNumber = params.length;
              var provideNumber = 1; //一行显示几个字
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = "";
                  var start = p * provideNumber;
                  var end = start + provideNumber;
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName;
            }
            //rotate:50,
          },
          axisTick: {
            //坐标轴刻度相关设置。
            show: true
          },
          axisLine: {
            //坐标轴轴线相关设置
            lineStyle: {
              color: "#E5E9ED"
              // opacity:0.2
            }
          },
          splitLine: {
            //坐标轴在 grid 区域中的分隔线。
            show: false,
            lineStyle: {
              color: "#E5E9ED"
              // 	opacity:0.1
            }
          }
        },
        yAxis: [
          {
            type: "value",
            splitNumber: 5,
            axisLabel: {
              textStyle: {
                color: "#fff",
                fontStyle: "normal",
                fontFamily: "微软雅黑",
                fontSize: 12
              }
            },
            axisLine: {
              show: true
            },
            axisTick: {
              show: true
            },
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#fff"
                // 	opacity:0.1
              }
            }
          }
        ],
        series: [
          {
            type: "line",
            smooth: true,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#B1C603" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#ffffff" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            },
            areaStyle: {
              color: "#C2D70B" //折现背景区域颜色
            },
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#B1C603" // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "#5865FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#ffffff" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            },
            data: ydata
          }
        ]
      };
      mychart1.setOption(option, true);
      window.addEventListener("resize", function() {
        mychart1.resize();
      });
    },
    zhuEcharts(seriesData) {
      let chartzhe = document.getElementById("hotspotzhu");
      let mychart1 = this.$echarts.init(chartzhe, "light");
      var xData = [],
        yData = [];
      seriesData.map(function(a, b) {
        xData.push(a.INDUSTRY_NAME);
        yData.push(a.NUM);
      });
      const option = {
        grid: {
          left: "3%",
          right: "5%",
          bottom: "2%",
          top: "10%",
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
              fontSize: 12
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
            show: true
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
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
};
</script>

<style scoped>
.hotspots {
  width: 100%;
  height: 100%;
}
.hotspot-pie {
  height: 30.1%;
  width: 100%;
}
.hotspots .el-header {
  width: 100%;
  background: rgba(4, 31, 51, 0.95);
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
  background: rgba(16, 27, 38, 0.95);
  height: 85%;
  width: 100%;
}
#hotspotzhe,
#hotspotzhu,
#hotspotPie {
  width: 100%;
  height: 100%;
}
.nohasdata {
  font-size: 18px;
  color: #888785;
  display: flex;
  justify-content: center;
  align-items: center;
}
.headclose {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}
.headclose:hover {
  color: #f31a08;
  font-size: 22px;
  font-weight: bolder;
}

 /* @media screen and (max-width: 1366px) {
        .headerspan{
            font-size: 14px
        }
    }
  @media screen and (max-width: 1036px) {
        .headerspan{
            font-size: 12px
        }
    }
  @media screen and (max-width: 800px) {
        .headerspan{
            font-size: 8px
        }
    } */
  /* @media screen and (max-width: 800px) {
        .hotspots{
            display: none;
        }
    } */
</style>
