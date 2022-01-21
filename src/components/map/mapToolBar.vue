<template>
  <div id="mapToolBar">
    <el-tooltip
      class="item"
      effect="dark"
    content="复位"
      placement="left"
      style
      popper-class="draw_share"
    >
      <el-button class="map-tool-bar-btn restore-btn" @click="restore"></el-button>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      content="全屏"
      placement="left"
      style
      popper-class="draw_share"
    >
      <el-button class="map-tool-bar-btn full-btn" @click="full"></el-button>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      content="卫星图"
      placement="left"
      style
      popper-class="draw_share"
    >
      <el-button class="map-tool-bar-btn img-btn" @click="switchBaseLyr('img')"></el-button>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      content="矢量图"
      placement="left"
      style
      popper-class="draw_share"
    >
      <el-button class="map-tool-bar-btn vec-btn" @click="switchBaseLyr('vec')"></el-button>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      content="地形图"
      placement="left"
      style
      popper-class="draw_share"
    >
      <el-button class="map-tool-bar-btn ter-btn" @click="switchBaseLyr('ter')"></el-button>
    </el-tooltip>
  </div>
</template>

<script>
import mapUtil from "@/utils/map";
import screenfull from "screenfull";
export default {
  name: "mapToolBar",
  data() {
    return {
      baseMapName: "img",
      isFullscreen: false
    };
  },
  methods: {
    //设置地图底图展示方式,矢量,地形,影像
    switchBaseLyr(lyrType) {
      mapUtil.switchLayer(lyrType);
    },
    //地图复位
    restore() {
      mapUtil.restoreView();
    },
    full() {
      if (!screenfull.enabled) {
        this.$message({
          message: "you browser can not work",
          type: "warning"
        });
        return false;
      }
      screenfull.toggle();
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on("change", this.change);
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off("change", this.change);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#mapToolBar {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 999;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 41px;
  justify-content: center;
  .map-tool-bar-btn {
    width: 41px;
    height: 41px;
    margin-top: 20px;
    border: 0;
  }
  .restore-btn {
    background: url(../../assets/bigscreen/restore.png) no-repeat;
    margin-left: 10px;
  }
  .img-btn {
    background: url(../../assets/bigscreen/img.png) no-repeat;
  }
  .vec-btn {
    background: url(../../assets/bigscreen/vec.png) no-repeat;
  }
  .ter-btn {
    background: url(../../assets/bigscreen/ter.png) no-repeat;
  }
  .full-btn {
    background: url(../../assets/bigscreen/full.png) no-repeat;
  }
}
</style>
