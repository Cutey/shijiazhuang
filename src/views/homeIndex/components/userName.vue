<template>
    <div class="user-name">
        <i class="fa fa-user-circle fa-lg" aria-hidden="true"></i>
        <el-dropdown>
            <span class="el-dropdown-link">
                {{userName}}
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    export default {
        name: "userName",
        props:{
            userName:String
        },
        methods:{
            //退出
            async logout() {
                this.$confirm('确定注销并退出系统吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('LogOut').then(() => {
                        location.reload()
                    })
                })
            }
        }

    }
</script>

<style scoped>
    .user-name{
        color: #a8fbf4;
    }
    .el-dropdown-link {
        color: #a8fbf4;
        cursor: pointer;
        font-size: 16px;
    }
</style>
