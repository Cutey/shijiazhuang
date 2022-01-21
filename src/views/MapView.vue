<template>
    <mapView :container="mapContainer" :baseMapName="mapBaseName"/>
</template>

<script>
    import mapView from "@/components/map/mapInstance"
    import mapUtil from "@/utils/map";
    export default {
        name: "MapView",
        data() {
            return {
                //地图初始化id
                mapContainer: "HumanActivityContainer",
                //地图底图
                mapBaseName: "img"
            }
        },
        components: {
            mapView
        },
        mounted() {
            this.$nextTick(()=>{
                //初始化地图容器高度
                this.mapContainerSize();
                //当浏览器改变时,改变地图容器高度
                window.addEventListener("resize", this.mapContainerSize);
            })
        },
        beforeDestroy() {
            // 页面一关闭，销毁监听事件
            window.removeEventListener("resize", this.mapContainerSize);
        },
        computed: {
            needTagsView() {
                return this.$store.state.settings.tagsView;
            },
            sidebar() {
                return this.$store.state.app.sidebar.opened;
            }
        },
        watch: {
            //监听tags容器状态
            needTagsView(val) {
                this.mapContainerSize();
            },
            //监听菜单树是否折叠
            sidebar(val) {
                this.mapContainerSize();
            }
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
            }
        }
    }
</script>

<style scoped>

</style>
