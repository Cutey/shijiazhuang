<!--业务系统布局容器-->
<template>
    <section class="business-main">
        <keep-alive>
            <router-view/>
        </keep-alive>
    </section>
</template>

<script>
    export default {
        name: "Business"
    }
</script>

<style>
    .business-main {
        height: 100%;
    }
    button:focus {
        outline: none;
    }
    ul{
        margin: 0;
        padding: 0;
    }
    li{
        list-style-type: none;
    }
</style>
