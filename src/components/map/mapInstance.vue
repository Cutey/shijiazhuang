<template>
    <div id="map-container-wrap">
        <!--地图容器-->
        <div :id="container" class="map-container-box"> 
            <div id="map" ref="map" >

            </div>
        </div>
        <!--地图工具条-->
        <!--<mapToolBar/>-->
        <!--气泡框-->
        <div id="popup" class="ol-popup">
            <div>
                <a href="#" id="popup-closer" class="ol-popup-closer">
                    <i class="el-icon-close close-btn"></i>
                </a>
            </div>
            <div id="popup-content">

            </div>
        </div>
    </div>
</template>

<script>
    import mapUtil from "@/utils/map";
    import mapToolBar from "./mapToolBar";
    import boundary from "../../../public/data/shijiazhuang.json";
    import {Overlay} from "ol";
    export default {
        name: "mapInstance",
        props: {
            container: {
                type: String,
                default: "container"
            },
            baseMapName: {
                type: String,
                default: "img"
            }
        },
        data() {
            return {
                mapInstance: null,
                mapPopup: null,
            }
        },
        components: {
            mapToolBar
        },
        mounted() {
            this.$nextTick(() => {

                //初始化地图
                this.mapInstance = mapUtil.initMap(this.container);
                //加载地图底图,默认为img
                mapUtil.switchLayer(this.baseMapName);
                //加载边界
                this.createBoundary();
                //初始化气泡框
                this.mapInitPopup();
            });
        },
        methods: {
            //容器尺寸
            mapContainerSize() {
                //获取导航高度
                let navBarHeight = document.getElementsByClassName('navbar')[0].offsetHeight;
                //判断tags容器是否显示,获取标签容器高度
                if (this.$store.state.settings.tagsView) {
                    let tagsHeight = document.getElementById('tags-view-container').offsetHeight;
                    if (tagsHeight) {
                        navBarHeight = navBarHeight + tagsHeight;
                    }
                }
                mapUtil.setMapHeight(navBarHeight);
            },
            //添加边界图层
            createBoundary() {
                let feature = mapUtil.createFeature('polygon', 'boundaryFeature', boundary.features[0].geometry.coordinates);
                mapUtil.createLayer(feature, 'boundaryLayer', 1);
                return feature;
            },
            //初始化气泡框
            mapInitPopup() {
                let popupId = document.getElementById('popup');
                this.mapPopup = new Overlay({
                    element: popupId,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                this.mapInstance.addOverlay(this.mapPopup);//将气泡框添加到地图
                this.closerPopup();
            },
            /**
             * 属性信息组装添加到气泡框
             * @param attributes 已组装属性信息
             */
            attrAddPopup(attributes) {
                let content = document.getElementById('popup-content');
                content.innerHTML = attributes;
                this.closerPopup();
            },
            //气泡框关闭按钮
            closerPopup() {
                let that = this;
                let closer = document.getElementById('popup-closer');
                closer.onclick = function () {
                    //地图复位
                    mapUtil.restoreView();
                    //隐藏气泡框
                    that.mapPopup.setPosition(undefined);
                };
            }
        }
    }
</script>

<style scoped>
    /*气泡框*/
    .ol-popup {
        position: absolute;
        left: 21px;
        min-width: 360px;
        /* min-height: 180px; */
        top: 14px;
    }
    .ol-popup:after {
        content: " ";
        position: absolute;
        transform: rotate(35deg);
        width: 25px;
        height: 2px;
        background: rgba(0,41,58,0.9);
        top: -8px;
        left: -21px;
    }
    #popup-content {
        margin: 0px 0 0 0px;
        padding: 10px;
        border: 1px solid #046F99;
        background: rgba(0,41,58,0.9);
    }

    .ol-popup-closer {
        text-decoration: none;
        position: absolute;
        top: 9px;
        right: 10px;
        font-size: 20px;
    }

    .close-btn:hover {
        color: red;
    }

    .close-btn {
        color: #fff;
    }

    /* .ol-popup-closer:after {
       content: "✖";
   } */
   

</style>
