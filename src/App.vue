<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App'
}
</script>
<style>
    @import "./assets/styles/font.css";
    .app-wrapper .app-container .fa-eye{
      margin-right: 5px;
    }

     .ol-scale-line {
            /* 比例尺背景颜色 */
            background: rgba(0, 60, 136, .7);
            bottom: 300px !important;
            left: 91% !important;
            z-index: 999;
            width: auto;
        }
 
        .ol-scale-line-inner {
            /* 比例尺边框样式 */
            border: 1px solid #eee;
            border-top: none;
            /* 比例尺文字大小 */
            font-size: 10px;
            /* 比例尺文字颜色 */
            color: #eee;
            /* 比例尺宽高为动态计算，若需要固定宽度，将最大最小宽度设置为相同即可 */
               height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 600;
        }
</style>

<style scoped>
.slide-fade-enter-active {
 transition: all .8s ease;
}
.slide-fade-leave-active {
 transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
 transform: translateX(-200px);
 transition: all 0s ease;
 opacity: 0;
}
</style>
