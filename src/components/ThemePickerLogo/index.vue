<template>
  <el-color-picker
    v-model="logoColor"
    :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d', ]"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script>
//const version = require('element-ui/package.json').version // element-ui version from node_modules
const ORIGINAL_THEME = '#409EFF' // default color

export default {
  name:'logoColor',
  data() {
    return {
     
      logoColor: '#ccc'
    }
  },
  computed: {
    logoColors() {
      //return this.$store.state.settings.logoBoxColor
    }
  },
  watch: {
    // logoColors:{
    //   handler:function(val,old){
    //     this.logoColor = val
        
    //   },
    //   immediate:true  
    // },
    logoColor(val){
      
      this.$emit('change', val)
    }
  },

  methods: {
    
  }
}
</script>

<style>
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
