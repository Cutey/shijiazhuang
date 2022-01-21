<template>
    <div class="weather-info" v-if="hasweather">
        <i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>
        <i class="split-line"></i>
        <span>石家庄</span>
        <i class="split-line"></i>
        <img :src="weatherImg" class="weather"/>
        <i class="split-line"></i>
        <span class="week">{{weather}}</span>
    </div>
</template>

<script>
    import $ from "jquery";

    export default {
        name: "weatherInfo",
        data() {
            return {
                weather: '',
                weatherImg: '',
                hasweather:false
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.queryWeatherInfo();//天气
            });
        },
        methods: {
            //天气信息
            queryWeatherInfo: function () {
                let that = this;
                $.ajax({
                    type: 'GET',
                    url: 'https://www.tianqiapi.com/api/',
                    data: 'version=v6&city=石家庄&appid=39927915&appsecret=Ws83rr3o',
                    dataType: 'JSON',
                    error: function () {
                        that.hasweather=false
                        // alert('网络错误');
                    },
                    success: function (result) {
                        that.hasweather=true
                        that.weather = result['tem1'] + "℃ ~ " + result['tem2'] + "℃";
                        that.weatherImg = require('@/assets/image/weather/' + result['wea_img'] + '.png');
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .weather-info {
        display: flex;
        align-items: center;
        color: #a8fbf4;
        font-family: 'lcd';
        font-size: 16px;
    }
    .weather {
        width: 40px;
    }
    .split-line {
        margin-right: 10px;
    }
</style>
