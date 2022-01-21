<template>
    <div class="sys-time">
        <i class="split-line"></i>
        <span>{{nowDate}}</span>
        <i class="split-line"></i>
        <span>{{nowWeek}}</span>
        <i class="split-line"></i>
        <span>{{nowTime}}</span>
        <i class="split-line"></i>
    </div>
</template>

<script>
    export default {
        name: "sysTime",
        data() {
            return {
                nowTime: '',
                nowDate: '',
                nowWeek: ''
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.nowTimes(); //时间
            });
        },
        methods: {
            //显示当前时间（年月日时分秒）
            timeFormate(timeStamp) {
                let year = new Date(timeStamp).getFullYear();
                let month = new Date(timeStamp).getMonth() + 1 < 10 ? "0" + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1;
                let date = new Date(timeStamp).getDate() < 10 ? "0" + new Date(timeStamp).getDate() : new Date(timeStamp).getDate();
                let hh = new Date(timeStamp).getHours() < 10 ? "0" + new Date(timeStamp).getHours() : new Date(timeStamp).getHours();
                let mm = new Date(timeStamp).getMinutes() < 10 ? "0" + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes();
                let ss = new Date(timeStamp).getSeconds() < 10 ? "0" + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds();
                let week = new Date().getDay();
                if (week == 1) {
                    this.nowWeek = "星期一";
                } else if (week == 2) {
                    this.nowWeek = "星期二";
                } else if (week == 3) {
                    this.nowWeek = "星期三";
                } else if (week == 4) {
                    this.nowWeek = "星期四";
                } else if (week == 5) {
                    this.nowWeek = "星期五";
                } else if (week == 6) {
                    this.nowWeek = "星期六";
                } else {
                    this.nowWeek = "星期日";
                }
                // this.nowTime = year + "-" + month + "-" + date +" |"+" "+hh+":"+mm+':'+ss ;
                this.nowTime = hh + ":" + mm + ':' + ss;
                this.nowDate = year + "年" + month + "月" + date + "日";
            },
            nowTimes() {
                this.timeFormate(new Date());
                setInterval(this.nowTimes, 1000);
                this.clear();
            },
            clear() {
                clearInterval(this.nowTimes)
                this.nowTimes = null;
            },
        }
    }
</script>

<style scoped>
    .sys-time {
        color: #a8fbf4;
        font-family: 'lcd';
        font-size: 16px;
    }

    .split-line {
        margin-right: 10px;
    }
</style>
