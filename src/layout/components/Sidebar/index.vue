<template>
    <div :class="{'has-logo':showLogo}" :style="{'background':settings.theme}">
        <logo v-if="showLogo" :collapse="isCollapse" :logoColor="settings.logoBoxColor"  />
        <el-scrollbar  wrap-class="scrollbar-wrapper"> 
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="settings.theme"
                :text-color="variables.menuText"
                :unique-opened="true"
                :active-text-color="'#fff'"
                :collapse-transition="false"
                mode="vertical"
            >
                <sidebar-item
                    v-for="(route, index) in permission_routes"
                    :key="route.path  + index"
                    :item="route"
                    :base-path="route.path"
                    :style="{'background-color':settings.theme}"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
    components: { SidebarItem, Logo },
    computed: {
        ...mapState(["settings"]),
        ...mapGetters(["permission_routes", "sidebar"]),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        theme() {
            return this.$store.state.settings.theme;
        },
       
       
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.sidebar.opened;
        }
    },
    mounted(){

    }
};
</script>
