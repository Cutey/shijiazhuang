<template>
    <div id="header-nav-wrap">
        <div class="header-right-box">
            <div class="top">
                <weatherInfo/>
                <sysTime/>
                <a class="home-index"><i class="fa fa-home fa-lg" aria-hidden="true"
                                         @click="$router.push('/homeIndex')"></i></a>
                <userName v-if="userName" :userName="userName"/>

            </div>
            <div class="bottom">
                <div class="nav-menu-box">
                    <div class="nav-menu"
                         v-for="(item,index) in businessSysMenu" :key="index"
                         :class="{'activeMenu':index ===  activeMenu,onRoutes}"
                         @click="navRouter(index)">{{item.meta.title}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import weatherInfo from '../../../homeIndex/components/weatherInfo'
    import sysTime from '../../../homeIndex/components/sysTime'
    import userName from '../../../homeIndex/components/userName'

    export default {
        name: "headerNav",
        data() {
            return {
                activeMenu: 0
            }
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
                if(this.$route.path.split('/').length === 6){
                    this.setSbuMenu(2);
                    return this.activeMenu = 2;
                }else{
                    let sysMenu = this.$store.state.permission.businessSysMenu;
                    for (let i = 0; i < sysMenu.length; i++) {
                        if (this.$route.meta.title == sysMenu[i].meta.title) {
                            return this.activeMenu = i;
                            break;
                        }
                    }
                }
            }
        },
        methods: {
            //导航路由
            navRouter(index) {
                this.activeMenu = index;
                let menu = this.setSbuMenu(index);
                if (menu.children) {
                    //当前菜单如有子菜单,跳转子菜单第一个页面
                    this.$router.push({path: menu.children[0].children[0].path});
                } else {
                    this.$router.push({path: menu.path})
                }
            },
            //将导航子菜单保存
            setSbuMenu(index){
                //获取该系统菜单
                let sysMenu = this.$store.state.permission.businessSysMenu;
                //获取当前点击的菜单
                let menu = sysMenu[index];
                if(menu.children){
                    //存储子菜单
                    this.$store.dispatch('BusinessSysSbuMenu',menu.children);
                }
                return menu
            }
        }
    }
</script>

<style lang="scss" scoped>
    #header-nav-wrap {
        background: url('../../../../../src/assets/image/businessSys/monitoringSystem/indexnew.png') no-repeat;
        background-size: 100% 100%;
        height: 100px;
        display: flex;
        justify-content: flex-end;

        .header-right-box {
            display: flex;
            flex: 1;
            flex-direction: column;
            .top {
                height: 35%;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 15px;
                font-size: 14px;
                /deep/ .weather {
                    width: 25px;
                }

                .home-index {
                    margin: 0 10px;
                    color: #a8fbf4;
                }
            }

            .bottom {
                height: 65%;
                display: flex;
                color: #fff;
                justify-content: flex-end;
                .nav-menu-box{
                    display: flex;
                    align-items: flex-end;
                    flex: 0 0 51%;
                    .nav-menu {
                        background: url('../../../../../src/assets/image/businessSys/monitoringSystem/navMenu.png') no-repeat;
                        background-size: 100% 100%;
                        width: 20%;
                        height: 80%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 15px;
                        cursor: pointer;
                        position: relative;
                    }

                    .nav-menu:hover {
                        color: #ade909;
                        background: url('../../../../../src/assets/image/businessSys/monitoringSystem/hoverMenu.png') no-repeat;
                        background-size: 100% 100%;
                    }

                    .activeMenu {
                        color: #ade909;
                        background: url('../../../../assets/image/businessSys/monitoringSystem/active.png') no-repeat !important;
                        background-size: 100% 100% !important;
                    }
                }

            }
        }
    }
</style>
