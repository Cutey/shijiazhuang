<template>
    <!-- 菜单树 -->
    <el-submenu v-if="menu.children && menu.children.length >= 1" :index="menu.path">
        <template slot="title">
            <i :class="[menu.meta.iconImg? menu.meta.iconImg+' '+'menu-icon':'nav_icon']"></i>
            <span slot="title">{{menu.meta.title}}</span>
        </template>
        <menuItem v-for="(item,index) in menu.children" :key="index" :menu="item"></menuItem>
    </el-submenu>
    <el-menu-item v-else :index="menu.path" :class="[menu.path? '':'nav_not_pageurl']" v-show='!menu.hidden'>
        <i :class="[menu.meta.iconImg? menu.meta.iconImg+' '+'menu-icon':'nav_icon']"></i>
        <span slot="title">{{menu.meta.title}}</span>
    </el-menu-item>
</template>

<script>
    export default {
        name: "menuItem",
        props: {
            menu: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style scoped>

</style>
