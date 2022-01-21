<!--统计分析-->
<template>
    <div id="statistics-box">
        <AsideMenu/>
        <div class="content-right">
            <transition name="fade-transform" mode="out-in">
                <router-view :key="key"/>
            </transition>
        </div>
    </div>
</template>

<script>
    import AsideMenu from '../../components/AsideMenu'

    export default {
        name: "index",
        data() {
            return {}
        },
        components: {
            AsideMenu
        },
        computed: {
            key() {
                return this.$route.path
            }
        }
    }
</script>


<style lang="scss" scoped>
    #statistics-box {
        display: flex;
        height: 100%;
        width: 100%;
        .content-right{
            flex: 1;
            margin-left: 20px;
            width: 83%;
        }
    }
</style>
<style lang="scss">
    .content-right .el-form-item__label{
        color: #fff;
    }
    .content-right .el-select__tags{
        height: 30px;
        overflow: hidden;
    }
</style>
