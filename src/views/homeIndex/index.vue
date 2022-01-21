<template>
    <div id="home-index-wrap">
        <div class="home-header-box">
            <div class="home-header-top home-header-left">
                <!-- <weatherInfo/> -->
                <!--天气-->
            </div>
            <div class="home-header-top home-header-right">
                <sysTime/>
                <!--时间-->
                <userName v-if="userName" :userName="userName"/>
                <button v-else @click="sysMenu()">请登录</button>
            </div>
        </div>
        <div class="home-body-box">
            <ul>
                <li
                    v-for="(item,index) in sys"
                    :key="index"
                    v-hasPermi="[item.perms]"
                    @click="sysMenu(item.menuId,item.perms,item.path,item.isFrame)"
                >
                    <div class="sys-box">
                        <div
                            class="sys-front"
                            :style="{backgroundImage:'url('+item.uploadImage+')'}"
                            style="background-repeat: no-repeat;background-size: contain"
                        >
                            <div class="inner" v-if="item.menuName.length <9">
                                <p>{{item.menuName}}</p>
                            </div>
                            <div class="inner" v-else>
                                    <p>{{item.menuNamespan}}</p>
                                    <span>{{item.menuNamepspan}}</span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import weatherInfo from "./components/weatherInfo";
    import sysTime from "./components/sysTime";
    import userName from "./components/userName";
    import {getToken} from "@/utils/auth";
    import {getSystem} from "@/api/homeIndex";
    import {checkPermi, checkRole} from "@/utils/permission"; // 权限判断函数
    export default {
        name: "index",
        data() {
            return {
                sys: [],
                businessSys: null
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
            }
        },
        mounted() {
            this.$nextTick(() => {
                let that = this;
                that.getSys(); //获取各业务系统
            });
        },
        methods: {
            //获取各业务系统
            getSys() {
                return new Promise((resolve, reject) => {
                    getSystem()
                        .then(res => {
                            if (res.data.length > 0) {
                                this.sys = res.data;
                                for (let i = 0; i < this.sys.length; i++) {
                                    this.sys[i].uploadImage =process.env.VUE_APP_BASE_API + this.sys[i].uploadImage;
                                    console.log()
                                    if(this.sys[i].menuName.length >= 9){
                                       
                                        this.sys[i].menuNamespan = this.sys[i].menuName.slice(0,4)
                                        this.sys[i].menuNamepspan = this.sys[i].menuName.slice(4,this.sys[i].menuName.length)
                                         console.log(this.sys[i])
                                    }
                                }
                                resolve();
                            }
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            },
            //各系统事件
            sysMenu(sysId, sysPerms, sysPath, isFrame) {
                if (getToken()) {
                    //判断用户菜单权限集合长度
                    if (this.$store.state.user.permissions.length > 0) {
                        let permi = false;
                        if ("*:*:*" === this.$store.state.user.permissions[0]) {
                            //全部权限
                            permi = true;
                        } else {
                            permi = checkPermi([sysPerms]); //校验用户权限
                        }
                        if (permi) {
                            //外部链接
                            if (isFrame == "0") {
                                window.open(sysPath);
                                // window.location.href=sysPath
                                return;
                            }
                            if ("sysManage" === sysPath) {
                                let sysManagePath =
                                    this.$store.state.permission.addRoutes[0].path +
                                    "/" +
                                    this.$store.state.permission.addRoutes[0].children[0].path;
                                this.$router.push(sysManagePath); //跳转后台管理系统页面
                            } else {
                                //获取业务菜单对象
                                if (!this.businessSys) {
                                    for (let i = 0;i < this.$store.state.permission.addRoutes.length;i++) {
                                        if (
                                            "BusinessSys" ===
                                            this.$store.state.permission.addRoutes[i].name
                                        ) {
                                            this.businessSys = this.$store.state.permission.addRoutes[
                                                i
                                                ];
                                        }
                                    }
                                }
                                if (this.businessSys) {
                                    let subSys = this.businessSys.children;
                                    for (let i = 0; i < subSys.length; i++) {
                                        if (subSys[i].path === sysPath && subSys[i].children) {
                                            //存储该业务系统菜单
                                            this.$store.dispatch("BusinessSys", subSys[i].children);
                                            //有子菜单跳转第一个子菜单页面
                                            this.$router.push({path: subSys[i].children[0].path});
                                        } else if (subSys[i].path === sysPath) {
                                            this.$router.push({path: subSys[i].path});
                                        }
                                    }
                                }
                            }
                        } else {
                            //提示用户没有权限
                            this.msgInfo("暂无该系统权限");
                        }
                    }
                } else {
                    this.$router.push("/login"); //跳转登录页面
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    #home-index-wrap {
        background: url("../../assets/image/homeIndex/bg.png") no-repeat;
        background-size: 100% 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        min-width: 1366px;
        overflow-x: auto;
        .home-header-box {
            display: flex;
            flex: 0 0 15%;
            height: 15%;
            color: #a8fbf4;
            .home-header-top {
                display: flex;
                flex: 1;
                height: 40%;
                padding: 0px 20px;
                align-items: center;
                font-family: "lcd";
            }

            .home-header-center {
                height: 81%;
                align-items: flex-end;
                justify-content: center;
            }

            .home-header-right {
                font-family: "Microsoft YaHei";
                justify-content: flex-end;

                .el-dropdown-link {
                    color: #a8fbf4;
                    cursor: pointer;
                    font-size: 16px;
                }

                button {
                    border: 1px solid #a8fbf4;
                    background: rgba(255, 255, 255, 0);
                    color: #a8fbf4;
                    padding: 5px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
        }

        .home-body-box {
            flex: 0 0 80%;
            height: 80%;
            display: flex;
            justify-content: center;
            align-items: center;

            ul {
                list-style-type: none;
                display: flex;
                justify-content: center;
                width: 85%;
                height: 45%;
                padding: 0;

                li {
                    width: 20%;
                    cursor: pointer;
                    padding: 0 15px;

                    .sys-box {
                        //margin: 0px 15px;
                        height: 100%;
                        /* 3D变形
                        -webkit-transform-style: preserve-3d;
                        transform-style: preserve-3d;
                        -webkit-perspective: 1000px;
                        perspective: 1000px;*/

                        .sys-front {
                            /*-webkit-transform: rotateY(0deg);
                                            transform: rotateY(0deg);
                                            -webkit-transform-style: preserve-3d;
                                            transform-style: preserve-3d;*/

                            transform: scale(1, 1);
                            transition: 0.5s all ease;
                        }

                        .sys-back {
                            position: absolute;
                            top: 0;
                            width: 100%;
                            -webkit-transform: rotateY(180deg);
                            transform: rotateY(180deg);
                            -webkit-transform-style: preserve-3d;
                            transform-style: preserve-3d;
                        }

                        .sys-front,
                        .sys-back {
                            height: 100%;
                            background-size: cover;
                            background-position: center;
                            text-align: center;
                            color: #a8fbf4;
                            /* -webkit-transition: -webkit-transform .7s cubic-bezier(0.4, 0.2, 0.2, 1);
                                            transition: -webkit-transform .7s cubic-bezier(0.4, 0.2, 0.2, 1);
                                            -o-transition: transform .7s cubic-bezier(0.4, 0.2, 0.2, 1);
                                            transition: transform .7s cubic-bezier(0.4, 0.2, 0.2, 1);
                                            -webkit-backface-visibility: hidden;
                                            backface-visibility: hidden;*/
                        }

                        .inner {
                            -webkit-transform: translateY(-50%) translateZ(60px) scale(0.94);
                            transform: translateY(-50%) translateZ(60px) scale(0.94);
                            top: 70%;
                            position: absolute;
                            width: 100%;
                            font-size: 1.5rem;
                            height: 100px;
                            padding: 0 30px;
                            letter-spacing: 0.1rem;
                        }

                        &:hover .sys-front {
                            /* height: 110%;
                                            width: 110%;
                                            margin-top: -5%;
                                            margin-left: -5%;
                                            -webkit-transform: rotateY(-180deg);
                                            transform: rotateY(-180deg);
                                            -webkit-transform-style: preserve-3d;
                                            transform-style: preserve-3d;*/
                            transform: scale(1.05, 1.05);
                        }

                        // &:hover .sys-back {
                        //     -webkit-transform: rotateY(0deg);
                        //     transform: rotateY(0deg);
                        //     -webkit-transform-style: preserve-3d;
                        //     transform-style: preserve-3d;
                        // }
                    }
                }
            }
        }
    }

    /*@media screen and (max-width: 1900px) {
        #home-index-wrap .home-body-box ul {
            width: 90%;
        }
        #home-index-wrap .home-body-box ul li .sys-box .inner {
            font-size: 1.6rem;
        }
    }*/
    @media screen and (max-width: 1600px) {
        #home-index-wrap .home-body-box ul {
            /*width: 90%;*/
        }
        #home-index-wrap .home-body-box ul li .sys-box .inner {
            font-size: 1.4rem;
        }
    }

    @media screen and (max-width: 1366px) {
        #home-index-wrap .home-body-box ul {
            width: 100%;
        }
        #home-index-wrap .home-body-box ul li .sys-box .inner {
            font-size: 1.3rem;
        }
    }
</style>
