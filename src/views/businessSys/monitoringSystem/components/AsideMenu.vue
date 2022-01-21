<template>
    <div class="menu-wrap">
        <!--菜单树-->
        <el-menu ref="AsideMenu" :default-active="onRoutes"
                 background-color="#01222F"
                 hide-timeout
                 text-color="#fff"
                 :collapse-transition="false"
                 :unique-opened="true" router>
            <!-- 菜单树组件，动态加载菜单 -->
            <menu-item v-for="(item,index) in menuItem" :key="index" :menu="item" ></menu-item>
        </el-menu>
    </div>
</template>

<script>
    import MenuItem from "./menuItem"

    export default {
        name: "AsideMenu",
        computed: {
            menuItem() {
                if (this.$store.state.permission.businessSysSubMenu) {
                    console.log(JSON.stringify(this.$store.state.permission.businessSysSubMenu))
                    return this.$store.state.permission.businessSysSubMenu;
                }
            },
            onRoutes() {
                if (this.$route.path) {
                    return this.$route.path;
                }
            }
        },
        components: {
            MenuItem
        }
    }
</script>

<style lang="scss">
    .menu-wrap {
        width: 300px;
        height: 100%;
        background-color: rgb(1, 34, 47);
        border: 1px solid #036db9;

        .el-menu {
            border-right: 0;

            .el-submenu__title {
                color: rgb(168, 251, 244) !important;
                font-size: 18px;
                background-color: #033548 !important;
            }

            .el-menu-item {
                font-size: 16px;
                border-bottom: 2px solid #2C4853;
            }

            .el-menu-item.is-active {
                color: #fff;
                background-color: #046F99 !important;
            }

            .menu-icon {
                color: #a8fbf4;
                margin-right: 5px;
            }
        }
    }


</style>
