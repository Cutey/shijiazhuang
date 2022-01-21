<template>
  <div class="PmtwoTj">
    <!-- 饼状图 -->
    <el-container class="hotspot-pie">
      <el-header style="height:10%;justify-content: space-between;">
        <div>
          <img src="../../../../assets/bigscreen/nine17.png" alt class="headerimg" />
        <span class="headerspan">各区县PM2.5均值统计 ( {{pretime}} )</span>
        </div>
         <i class="el-icon-close headclose"  @click="closeClick()"></i>
         <div class="aswactive-el"></div>
      </el-header>
      <el-main class="conenthotpottj" style="padding:0">
        <div id="pmtop" style="overflow: hidden;" v-if="tophasdata"></div>
        <div v-else id="pmtop" class="nohasdata">
           暂无数据
        </div>
      </el-main>
    </el-container>

    <!-- 饼状图 -->
    <el-container class="hotspot-pie">
      <el-header style="height:10%">
        <img src="../../../../assets/bigscreen/nine17.png" alt class="headerimg" />
        <span class="headerspan">周边城市PM2.5对比  ( {{pretime}} )</span>
        <div class="aswactive-el"></div>
      </el-header>
      <el-main class="conenthotpottj" style="padding:0">
        <div id="pmbottom" style="overflow: hidden;" v-if="bottomhasdata"></div>
        <div v-else id="pmtop" class="nohasdata">
           暂无数据
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getselectPm } from "@/api/bigscreen/bigscreen.js";
import mapUtil from "@/utils/map";
export default {
  name: "PmtwoTj",
  props:{
    pretime:String
  },
  data() {
    return {
      // exd:[112.000002136, 35.9800018352, 120.020001957, 43.0000016782] ,
      exd:[110.000002136454,33.980001879856,120.02000191249,43.0000016782433],
      tophasdata:true,
      bottomhasdata:true
    };
  },
  methods: {
     closeClick(){
      let str='pm25'
      this.$emit('closeClick',str)
    },
    //排序方法
    compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
},
    getselectPmData(par) {
      let me = this;
      getselectPm(par).then(response => {
        if (
          (response.msg == "操作成功" && response.data.pmAVG != null) ||
          response.data.pngPath != null ||
          response.data.pmContrast != null
        ) {
          me.zhutopEcharts(response.data.pmAVG),
          me.zhubottomEcharts(response.data.pmContrast);
          let url =
            process.env.VUE_APP_BASE_API +
            process.env.VUE_APP_REPORT_PATH +
            response.data.pngPath;
          mapUtil.createStaticImage("pm25", url, this.exd, 0, null);
          mapUtil.setcenter()
        }else if(response.data.pmContrast == null || response.data.pmContrast == []){
          this.bottomhasdata=false
        }else if(response.data.pmAVG == null || response.data.pmAVG == []){
          this.tophasdata=false
        }
      });
    },
    zhutopEcharts(seriesData) {
      let chartzhe = document.getElementById("pmtop");
      let mychart1 = this.$echarts.init(chartzhe, "light");
      var xData = [],
        yData = [];
      seriesData.sort(this.compare("PM25"))
      seriesData.map(function(a, b) {
        a.PM25 = Math.round(a.PM25)
        xData.push(a.NAME);
        yData.push(a.PM25);
      });
      const option = {
        grid: {
          left: "3%",
          right: "10%",
          bottom: "3%",
          top:"3%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        yAxis: {
          name: "",
          type: "category",
          data: xData,
          axisLine: {
            lineStyle: {
              color: "#999"
            }
          },
          axisLabel: {
            show: true,
            interval:0,
            // formatter: function(value) {
            //   return value.split("").join("\n");
            // },
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
        xAxis: {
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
            inverse: true,
            type: "bar",
            name: "",
            label: {
              show: true, // 开启显示
              rotate: 0, // 旋转70度
              position: "right", // 在上方显示
              distance: 10, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
              verticalAlign: "middle",
              textStyle: {
                // 数值样式
                color: "#fff",
                fontSize: 12
              }
            },
            itemStyle: {
              normal: {
                barBorderRadius: [0, 8, 8, 0],
                  color: function (params) {
                                if(params.data >= 0 && params.data < 35){
                                    return "#00E400"
                                }else if(params.data >= 35 && params.data < 75){
                                    return "#FFFF00"
                                }else if(params.data >= 75 && params.data < 115){
                                    return "#FF7E02"
                                }else if(params.data >= 115 && params.data < 150){
                                    return "#FF0000"
                                }else if(params.data >= 150 && params.data < 250){
                                    return "#99004C"
                                }else if(params.data >= 250){
                                    return "#7E0023"
                                }else {
                                    return "#FF6A66"
                                }
                            }
              }
            },
            barWidth: "40%"
          }
        ]
      };
      mychart1.setOption(option, true);
      window.addEventListener("resize", function() {
        mychart1.resize();
      });
    },
    zhubottomEcharts(seriesData) {
      let chartzhe = document.getElementById("pmbottom");
      let mychart1 = this.$echarts.init(chartzhe, "light");
      seriesData.sort(this.compare("PM25"))
      var xData = [],
        yData = [];
      seriesData.map(function(a, b) {
         a.PM25 = Math.round(a.PM25)
        xData.push(a.NAME);
        yData.push(a.PM25);
      });
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
            show: true,
            interval:0,
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
                color: function (params) {
                                if(params.data >= 0 && params.data < 35){
                                    return "#00E400"
                                }else if(params.data >= 35 && params.data < 75){
                                    return "#FFFF00"
                                }else if(params.data >= 75 && params.data < 115){
                                    return "#FF7E02"
                                }else if(params.data >= 115 && params.data < 150){
                                    return "#FF0000"
                                }else if(params.data >= 150 && params.data < 250){
                                    return "#99004C"
                                }else if(params.data >= 250){
                                    return "#7E0023"
                                }else {
                                    return "#FF6A66"
                                }
                            }
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
.PmtwoTj {
  width: 100%;
  height: 100%;
}
.hotspot-pie {
  height: 45.7%;
  width: 100%;
}
.PmtwoTj .el-header {
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
#pmbottom,
#pmtop {
  width: 100%;
  height: 100%;
}
.nohasdata{
  font-size: 18px;
    color: #888785;
    display: flex;
    justify-content: center;
    align-items: center;
}
.headclose{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  z-index:100;
}
 .headclose:hover{
  color: #F31A08;
  font-size: 22px;
  font-weight: bolder;
}
</style>
