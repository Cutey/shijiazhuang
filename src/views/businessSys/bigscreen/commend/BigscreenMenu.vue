<template>
  <div style="height:100%;width:100%;padding:0;" class="bigmenu">
    <el-menu class="el-menu-vertical-demo warp menu-wrap" :collapse="false">
      <el-tooltip
        class="item"
        effect="dark"
        :content="todo.tex"
        v-for="(todo, index) in todos"
        :key="index"
        placement="right"
        style
        popper-class="draw_share_atooltip"
      >
        <el-menu-item
          :key="todo.tex"
          @click="addClass(todo)"
          style="padding: 10px 0;"
          class="warp-tree"
        >
          <i
            v-bind:class="[todo.text, todo.text==current ? 'activeimg': '']"
            class="icorer"
            style=""
          ></i>
          <span :style="{color:(todo.text==current ?'#ade909':'#53ddff')}" style="width:100%" class="foer">{{todo.tex}}</span>
        </el-menu-item>
      </el-tooltip>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "BigscreenMenu",
  data() {
    return {
      current: "hotspot",
      lastTime: 0, //默认上一次点击时间为0
      todos: [
        {
          text: "hotspot",
          type: "",
          resourcesTypeID: "1",
          tes: "HOTPOINT",
          tex: "热点"
        },
        {
          text: "pm25",
          type: "B",
          resourcesTypeID: "",
          tes: "PM25",
          tex: "PM2.5"
        },
        {
          text: "PM10",
          type: "A",
          resourcesTypeID: "",
          tes: "PM10",
          tex: "PM10"
        },
        {
          text: "fire",
          type: "",
          resourcesTypeID: "17",
          tes: "FIREPOINT",
          tex: "火点"
        },
        {
          text: "floor",
          type: "",
          resourcesTypeID: "2",
          tes: "POINT",
          tex: "站点"
        },
        {
          text: "bare",
          type: "",
          resourcesTypeID: "19",
          tes: "BARELAND",
          tex: "裸地"
        }
      ]
    };
  },
  methods: {
    addClass: function(item) {
      let now = new Date().valueOf();

      //第一次点击
      if (this.lastTime == 0) {
        this.current = item.text;
        this.$emit("treeClick", item);
        this.lastTime = now;
      } else {
        if (now - this.lastTime > 1000) {
          //重置上一次点击时间，2000是我自己设置的2秒间隔，根据自己的需要更改
          this.current = item.text;
          setTimeout(() => {
            this.$emit("treeClick", item);
          }, 100);
          this.lastTime = now;
        } else {
        }
      }
    }
  },
  mounted() {}
};
</script>


<style scoped>
.shuli {
  margin: 0 auto;
  width: 20px;
  line-height: 24px;
  border: 1px solid #333;
}
.menutree {
  width: 100%;
  padding: 0;
}
.el-menu {
  background: none;
  border: none;
}
.warp-tree {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: auto;
  line-height: normal;
  justify-content: center;
  width: 100%;
   height: 10%;
   min-height: 80px;
}
.el-menu-vertical-demo {
  height: 100%;
  width: 100%;
  padding: 0 0px;
}
.hotspot {
  background: url("../../../../assets/bigscreen/hotspot.png") center no-repeat;
  background-size: 100% 100%;
  height: 13%;
}
.pm25 {
  background: url("../../../../assets/bigscreen/pm25.png") center no-repeat;
  background-size: 100% 100%;
  height: 10%;
}
.PM10 {
  background: url("../../../../assets/bigscreen/pm10.png") center no-repeat;
  background-size: 100% 100%;
  height: 10%;
}
.fire {
  background: url("../../../../assets/bigscreen/fire.png") center no-repeat;
  background-size: 100% 100%;
  height: 10%;
}
.floor {
  background: url("../../../../assets/bigscreen/floor.png") center no-repeat;
  background-size: 100% 100%;
  height: 13%;
}
.bare {
  background: url("../../../../assets/bigscreen/bare.png") center no-repeat;
  background-size: 100% 100%;
  height: 10%;
}
.warp .activeimg.hotspot {
  background: url("../../../../assets/bigscreen/activehotspot.png") center
    no-repeat;
  background-size: 100% 100%;
}
.warp .activeimg.PM10 {
  background: url("../../../../assets/bigscreen/activepm10.png") center
    no-repeat;
  background-size: 100% 100%;
}
.warp .activeimg.pm25 {
  background: url("../../../../assets/bigscreen/activepm25.png") center
    no-repeat;
  background-size: 100% 100%;
}
.warp .activeimg.fire {
  background: url("../../../../assets/bigscreen/activefire.png") center
    no-repeat;
  background-size: 100% 100%;
}
.warp .activeimg.floor {
  background: url("../../../../assets/bigscreen/activefloor.png") center
    no-repeat;
  background-size: 100% 100%;
}
.warp .activeimg.bare {
  background: url("../../../../assets/bigscreen/activebare.png") center
    no-repeat;
  background-size: 100% 100%;
}
.menu-wrap .el-menu-item:hover,
.el-menu-item:focus {
  background: none !important;
}
.menu-wrap .el-menu-item:hover {
  background: none !important;
}
.menu-wrap .el-submenu__title:hover {
  background: none !important;
}
.menu-wrap .el-menu-item.is-active {
  background: none !important;
}
.menu-wrap .el-submenu__title.is-active {
  background: none !important;
}
.foer{
  font-size: 16px;
}
.icorer{
  height:48px;
  width:48px

}

</style>
