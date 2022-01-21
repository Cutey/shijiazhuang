<template>
  <div class="BigscreenHeaderright">
    <div class="marquee">
      <div class="marquee_title">
        <i class="fa fa-volume-up" aria-hidden="true"></i>
        <span>反馈信息:</span>
      </div>
      <div class="marquee_box">
        <ul class="marquee_list" :class="{marquee_top:animate}">
          <li v-for="(item, index) in marqueeList" :key="index">
            <div>{{item.title}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import {getscrollingTips} from '@/api/bigscreen/bigscreen.js'
export default {
  name: "E",
  data() {
    return {
      animate: false,
      marqueeList: [
        // {
        //   title: "长安区某企业排放预警提示"
        // },
        // {
        //   title: "长安区某企业排放预警提示"
        // },
        // {
        //   title: "长安区某企业排放预警提示"
        // },
        // {
        //   title: "长安区某企业排放预警提示"
        // }
      ]
    };
  },
  created: function() {
    this.getscrollingTipsData()
    setInterval(this.showMarquee, 2000);
    
  },
  methods: {
    getscrollingTipsData(){
      getscrollingTips().then((res)=>{
        if(res.msg=="操作成功"){
          let data=res.data
          let obj= new Object
          data.forEach((item)=>{
            obj.title = ''
            obj.title = item.AREA_NAME+'反馈率:'+item.RATE
            this.marqueeList.push(obj)
          })
        }
      })
    },
    showMarquee: function() {
      this.animate = true;
      setTimeout(() => {
        this.marqueeList.push(this.marqueeList[0]);
        this.marqueeList.shift();
        this.animate = false;
      }, 500);
    }
  }
};
</script>
<style scoped>
.BigscreenHeaderright {
  width: 34%;
  /* position: absolute; */
  /* left: 4%;
  bottom:2%; */
  color: #DFD90B;
  font-size: 1px;
}
.fa-volume-up {
  margin-right: 10px;
}
.volumemessage {
  margin-left: 15px;
}
div,
ul,
li,
span,
img {
  margin: 0;
  padding: 0;
  display: flex;
  box-sizing: border-box;
}
.marquee {
  width: 100%;
  /* height: 50px; */
  align-items: flex-end;
  color: #DFD90B;
  display: flex;
  box-sizing: border-box;
  justify-content:center;
}

.marquee_title {
  margin-left: 0px;
  height: 30px;
  font-size: 16px;
  align-items: center;
}

.marquee_box {
  display: block;
  position: relative;
  width: 50%;
  height: 30px;
  overflow: hidden;
}

.marquee_list {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}
.marquee_top {
  transition: all 0.5s;
  margin-top: -30px;
}

.marquee_list li {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  padding-left: 20px;
}

.marquee_list li span {
  padding: 0 2px;
}

.red {
  color: #ff483e;
}
</style>