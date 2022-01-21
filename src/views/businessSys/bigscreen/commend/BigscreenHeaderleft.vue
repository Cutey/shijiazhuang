<template>
  <div id="header-nav-wrap">
    <div class="header-right-box">
      <div class="top">
        <weatherInfo />
        <sysTime />
        <a class="home-index">
          <el-tooltip
            class="item"
            effect="dark"
            content="首页"
            placement="bottom"
            style
            popper-class="draw_shareder"
          >
            <i class="fa fa-home fa-lg" aria-hidden="true" @click="$router.push('/homeIndex')"></i>
          </el-tooltip>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import weatherInfo from "../../../homeIndex/components/weatherInfo";
import sysTime from "../../../homeIndex/components/sysTime";
import userName from "../../../homeIndex/components/userName";

export default {
  name: "headerNav",
  data() {
    return {
      activeMenu: 0
    };
  },
  components: {
    weatherInfo,
    sysTime,
    userName
  },
  computed: {
    userName() {
      if (this.$store.state.user.name) {
        return this.$store.state.user.name;
      } else {
        return false;
      }
    },
    businessSysMenu() {
      if (this.$store.state.permission.businessSysMenu) {
        return this.$store.state.permission.businessSysMenu;
      }
    },
    onRoutes() {
      if (this.$route.path) {
        return this.$route.path;
      }
    }
  },
  methods: {
    //导航路由
  }
};
</script>

<style lang="scss" scoped>
#header-nav-wrap {
      height: 100%;
    display: flex;
    justify-content: center;
    width: auto;
    align-items: flex-end;
    // padding: 0 20px;

  .header-right-box {
    height: 100%;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: flex-end;
    padding-right: 10px;
    padding-left: 40px;

    .top {
      line-height: 30px;
    height: 100%;
    display: flex;
    align-items: flex-end;
    width: 100%;
    justify-content: center;

      /deep/ .weather {
        width: 25px;
      }

      .home-index {
        // margin: 0 10px;
        color: #a8fbf4;
      }
    }
  }
}

 @media screen and (max-width: 1366px) {
        #header-nav-wrap .header-right-box{
            right: 0%;
        }
    }
  @media screen and (max-width: 1036px) {
        #header-nav-wrap .header-right-box .top  .sys-time{
            font-size: 12px
        }
    }
  // @media screen and (max-width: 800px) {
  //       #header-nav-wrap .header-right-box .top  .sys-time{
  //           font-size: 8px
  //       }
  //   }
  // @media screen and (max-width: 800px) {
  //       #header-nav-wrap .header-right-box .top  .sys-time{
  //           display: none;
  //       }
  //   }
</style>
