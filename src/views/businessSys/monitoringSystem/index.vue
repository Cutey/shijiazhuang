<!--遥感监测系统-->
<template>
    <div id="ms-wrap">
        <!--导航-->
        <headerNav/>
        <div class="ms-main-wrap">
            <transition name="fade-transform" mode="out-in">
                <router-view :key="key"/>
            </transition>
        </div>
    </div>
</template>
<script>

    import headerNav from './components/nav'
    export default {
        name:'index',
        data(){
            return {

            }
        },
        computed: {
            key() {
                return this.$route.path
            }
        },
        components:{
            headerNav
        }
    }
</script>
<style lang="scss" scoped>
    #ms-wrap{
        height: 100%;
        background: #000;
        min-width: 1366px;
        overflow-x: auto;
    }
    .ms-main-wrap{
        width: 100%;
        height: calc(100% - 100px);
        padding: 20px 15px;
        overflow: hidden;
    }
</style>
<style lang="scss">
    .ms-main-wrap .el-form-item__label{
        color: #fff;
    }
    .active-btn {
        background: url('../../../assets/image/businessSys/monitoringSystem/activeBtn.png') !important;
        color: #ade909 !important;
        background-size: 100% 100% !important;
    }
    /*表格*/
    .ms-main-wrap .el-table{
        background-color: #01222f;
        color: #fff;
    }
    .ms-main-wrap .el-table::before{
    background-color: rgba(230,235,245,0.56);
    }
    .ms-main-wrap .el-table tbody tr:hover>td {
        background-color:#01222f;
    }
    .ms-main-wrap .el-table .el-table__header-wrapper th{
        background-color: #01222f;
        color: #046f99;
    }
    .ms-main-wrap .el-table th.is-leaf, .el-table td {
        border-bottom: 1px solid rgba(206,210,218,0.32);
    }
    .ms-main-wrap .el-table tr {
        background-color: #01222f;
    }
    /*分页*/
    .page-wrap {
        .el-pagination__total{
            color: #fff;
        }
        .el-pagination__jump{
            color: #fff;
        }
    }

    /*弹窗*/
    .ms-main-wrap .el-dialog {
        background: #183d4c;
        display: flex;
        flex-direction: column;
        margin:0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        /*height:600px;*/
        max-height:calc(100% - 30px);
        max-width:calc(100% - 30px);
        .el-dialog__title {
            color: #fff;
        }

        .el-dialog__headerbtn .el-dialog__close {
            color: #fff;
        }

        .upload-wrap {
            .el-upload-list {
                max-height: 100px;
                overflow-y: auto;
            }
        }
    }
</style>
