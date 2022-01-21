<template>
    <div id="time-axis-wrap">
        <div class="btn-box">
            <button v-if="activeBtn === 'play'" @click="playBtn">
                <i class="fa fa-play-circle fa-2x" aria-hidden="true"></i>
            </button>
            <button v-if="activeBtn === 'pause'" @click="pauseBtn">
                <i class="fa fa-pause-circle fa-2x" aria-hidden="true"></i>
            </button>
        </div>
        <div id="time-axis-box" class="time-axis-box" @mouseover="timeAxisMouseOver($event)" @mouseleave="timeAxisMouseLeave($event)" @click="timeAxisClick">
            <div class="time-axis">
                <div id="axis-box" class="axis-box">

                </div>
                <div id="move-axis-slide">

                </div>
                <div id="hover-time-slide" class="hover-time-slide time-slide">00:00</div>
                <div class="time-box">
                    <ul v-for="(items,index) in timeArray" :key="index">
                        <li class="time-item" v-for="(item,index) in items" :key="index"
                            :style="{'background':item.g?'transparent':'#aaa'}">{{item.t}}
                        </li>
                    </ul>
                </div>
                <div class="date-box">
                    <ul>
                        <li class="date-item" :class="{'dateItem':timeItemWidth == null}" v-for="(item,index) in showDateArray" :key="index">{{item}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "newTimeAxis",
        props: {},
        data() {
            return {
                activeBtn: 'play',
                showDateArray:[],
                dateArray: [],
                timeArray: [],
                //获取时间轴元素
                axisBox: null,
                //获取移动时间轴元素
                moveAxisBox:null,
                //获取hover时间滑块
                hoverTimeSlide: null,
                hoverTimeSlideLeft:null,
                //设置滑块时间
                hoverTimeSlideText:null,
                hoverDateIndex:null,
                //日期元素宽度
                dateItemWidth:null,
                //时间元素宽度
                timeItemWidth:null,
                //播放标拾
                playFlag: true,
                //定时器
                intervalCount: null,
            }
        },
        mounted() {

        },
        methods: {
            //初始化
            initTimeSlide(dateTimes) {
                let date = '';
                let time = '';
                let datesCount = 0;//记录日期总数
                let timesCount = 0;//记录时间总数
                this.showDateArray = [];
                this.dateArray = [];
                this.timeArray = [];
                if (dateTimes && dateTimes.days && dateTimes.days.length > 0) { //日期
                    for(let i=0;i<dateTimes.days.length;i++){
                        let week = this.getDateDay(dateTimes.days[i]);
                        this.showDateArray.push(dateTimes.days[i]+'('+week+')');
                    }
                    this.dateArray = dateTimes.days;
                    date = dateTimes.days[dateTimes.days.length - 1];
                    datesCount = dateTimes.days.length;
                }
                if (dateTimes && dateTimes.hours && dateTimes.hours.length > 0) {//时间
                    for (let i = 0; i < this.dateArray.length; i++) {
                        let times = [];
                        for (let j = 8; j <= 18; j++) {
                            let obj = {};
                            if (j < 10) {
                                obj.t = '0' + j;
                            } else {
                                obj.t = j + '';
                            }
                            obj.g = dateTimes.hours[i].includes(obj.t); //查看是否包含当前时间,包含为true,不包否为false.用于时间轴上时间刻度置灰
                            times.push(obj);
                            timesCount ++;
                        }
                        this.timeArray.push(times);
                    }
                    let lastIndex = dateTimes.hours.length - 1;//hours为二维数据,获取数据的长度-1角标
                    let times = dateTimes.hours[lastIndex];//获取最后一行数组
                    time = times[times.length - 1];//获取列数组
                }
                let dateTime = date + (time?' '+time+':00:00':'');
                this.$parent.getDateTimeData(dateTime);

                //获取时间轴元素
                this.axisBox = document.getElementById('time-axis-box');
                //获取移动时间轴元素
                this.moveAxisBox = document.getElementById('move-axis-slide');
                //获取hover时间滑块
                this.hoverTimeSlide = document.getElementById('hover-time-slide');
                //时间轴宽度
                let axisBoxWidth = this.axisBox.offsetWidth;
                //日期每个元素的宽度
                this.dateItemWidth = axisBoxWidth / datesCount;
                if(time){
                    //时间每个元素的宽度
                    this.timeItemWidth = axisBoxWidth / timesCount;
                    let t = parseInt(time);
                    timesCount= timesCount-(18-t);
                    //设置移动时间轴宽度
                    this.moveAxisBox.style.width = timesCount * this.timeItemWidth + 'px';
                }else{
                    //时间每个元素的宽度滞空
                    this.timeItemWidth = null;
                    //设置移动时间轴宽度
                    this.moveAxisBox.style.width = datesCount * this.dateItemWidth + 'px';
                }
            },

            //时间轴鼠标移入事件
            timeAxisMouseOver(e) {
                e.stopPropagation();
                let that = this;
                //hover时间滑块显示
                that.hoverTimeSlide.style.display = 'block';
                window.addEventListener('mousemove', that.hoverTimeSlideMove, false);
            },
            //时间轴鼠标移出事件
            timeAxisMouseLeave(e) {
                e.stopPropagation();
                let that = this;
                //hover时间滑块隐藏
                that.hoverTimeSlide.style.display = 'none';
                window.removeEventListener('mousemove', that.hoverTimeSlideMove, false);
            },
            //鼠标移动到时间轴设置hover时间滑块left值
            hoverTimeSlideMove(event) {
                let that = this;
                let e = event || window.event;
                let x = e.clientX;
                //计算hover时间滑块left值
                that.hoverTimeSlideLeft = x - that.axisBox.offsetLeft-15;
                //设置hover时间滑块left值
                that.hoverTimeSlide.style.left = that.hoverTimeSlideLeft + 'px';
                if(that.timeItemWidth){
                    //计算hover时间滑块移动步长显示时间
                    let ht = Math.floor((that.hoverTimeSlideLeft % that.dateItemWidth) / that.timeItemWidth);
                    that.hoverTimeSlideText = ht + 8;
                    that.hoverTimeSlide.innerText = (that.hoverTimeSlideText < 10 ? ('0' + that.hoverTimeSlideText + ':00') : that.hoverTimeSlideText + ':00');
                    //计算鼠标指向时间轴位置,获取年月日索引
                    that.hoverDateIndex = parseInt(that.hoverTimeSlideLeft / that.dateItemWidth);
                    if(!that.timeArray[that.hoverDateIndex][ht].g){
                        that.hoverTimeSlide.innerText = '该时间节点暂无数据';
                    }
                }else{
                    //计算鼠标指向时间轴位置,获取年月日索引
                    that.hoverDateIndex = parseInt(that.hoverTimeSlideLeft / that.dateItemWidth);
                    that.hoverTimeSlideText = that.dateArray[that.hoverDateIndex];
                    that.hoverTimeSlide.innerText = that.dateArray[that.hoverDateIndex];
                }
            },
            //时间轴点击事件
            timeAxisClick() {
                let that = this;
                let dateTime = '';
                if(that.timeItemWidth){
                    let time = (that.hoverTimeSlideText < 10 ? ('0' + that.hoverTimeSlideText + ':00') : that.hoverTimeSlideText + ':00');
                    //时间轴滑块宽度
                    that.moveAxisBox.style.width = (that.hoverDateIndex * 11 + that.hoverTimeSlideText - 8 + 1 ) * that.timeItemWidth + 'px';
                    dateTime = that.dateArray[that.hoverDateIndex] + ' ' + time + ':00';
                }else{
                    dateTime = that.dateArray[that.hoverDateIndex];
                    that.moveAxisBox.style.width = (that.hoverDateIndex + 1) * that.dateItemWidth + 'px';
                }
                this.$parent.getDateTimeData(dateTime);
            },

            //播放
            playBtn() {
                let that = this;
                that.activeBtn = 'pause';
                //时间移动方法
                this.intervalTimer();
            },
            //停止
            pauseBtn() {
                this.activeBtn = 'play';
                this.cancelInterval();
            },
            //定时移动时间轴方法
            timeMove(){
                let that = this;
                let dateTime = '';
                //获取时间轴滑块宽度
                let moveAxisBoxWidth = that.moveAxisBox.offsetWidth;
                //当时间轴滑块宽度大于时间轴总宽度,移除定时器
                if (moveAxisBoxWidth >= that.axisBox.offsetWidth) {
                    //停止移动
                    that.pauseBtn();
                    this.$parent.getFactorTypeDate();//加载数据
                    return;
                }else{
                    if(that.timeItemWidth){
                        //计算hover时间滑块移动步长显示时间
                        let ht = Math.floor((moveAxisBoxWidth % that.dateItemWidth) / that.timeItemWidth);
                        let hoverTimeSlideText = ht + 8;
                        //计算鼠标指向时间轴位置,获取年月日索引
                        let hoverDateIndex = parseInt(moveAxisBoxWidth / that.dateItemWidth);
                        let time = (hoverTimeSlideText < 10 ? ('0' + hoverTimeSlideText + ':00') : hoverTimeSlideText + ':00');
                        dateTime = that.dateArray[hoverDateIndex] + ' ' + time + ':00';
                        //设置时间轴滑块宽度
                        that.moveAxisBox.style.width = moveAxisBoxWidth + that.timeItemWidth + 'px';
                    }else{

                        //计算鼠标指向时间轴位置,获取年月日索引
                        let hoverDateIndex = parseInt(moveAxisBoxWidth / that.dateItemWidth);
                        dateTime = that.dateArray[hoverDateIndex];
                        //设置时间轴滑块宽度
                        that.moveAxisBox.style.width = moveAxisBoxWidth + that.dateItemWidth + 'px';
                    }
                    this.$parent.getDateTimeData(dateTime);
                }
            },
            //定时执行
            intervalTimer() {
                this.intervalCount = setInterval(() => {
                    if (!this.playFlag) {
                        return;
                    }
                    this.playFlag = false;
                    this.timeMove();
                    this.playFlag = true;
                }, 2500);
            },
            //取消定时执行
            cancelInterval() {
                clearInterval(this.intervalCount);
                this.intervalCount = null;
                this.playFlag = true;
            },
            //获取星期
            getDateDay(date){
                let str = '';
                let week = new Date(date).getDay();
                if (week == 0) {
                    str = "周日";
                } else if (week == 1) {
                    str = "周一";
                } else if (week == 2) {
                    str = "周二";
                } else if (week == 3) {
                    str = "周三";
                } else if (week == 4) {
                    str = "周四";
                } else if (week == 5) {
                    str = "周五";
                } else if (week == 6) {
                    str = "周六";
                }
                return str;
            }
        }
    }
</script>

<style lang="scss" scoped>
    #time-axis-wrap {
        position: absolute;
        bottom: 0px;
        width: 81.2%;
        left: 0;
        background: rgba(0, 41, 58, 0.9);
        display: flex;

        .btn-box {
            display: flex;
            align-items: center;
            padding: 0 5px 0 5px;
            button {
                background: rgba(255, 255, 255, 0);
                border: 0;
                color: #fff;
                cursor: pointer;
            }
        }

        .time-axis-box {
            display: flex;
            flex: 1;
            //padding: 0px 0 0px 20px;
            position: relative;
            align-items: flex-end;
            justify-content: center;

            .time-slide {
                width: max-content;
                height: 20px;
                padding: 0 5px;
                font-size: 14px;
                position: absolute;
                //left: 5px;
                background: #046f99;
                top: -27px;
                border-radius: 4px;
                color: #fff;
                line-height: 20px;
                text-align: center;
                transform: translateX(50%);
            }

            .time-slide::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-top: 6px solid #046f99;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
            }

            .hover-time-slide {
                left: 0px;
                transform: translateX(-50%);
                color: #fff;
                display: none;
                z-index: 11;
            }

            .hover-time-slide:after {

            }

            .time-axis {
                display: flex;
                flex: 1;
                flex-flow: column;
                position: relative;
                cursor: pointer;
                .axis-box {
                    background: #e1e1e1;
                    height: 10px;
                }

                #move-axis-slide {
                    position: absolute;
                    height: 10px;
                    background: #046f99;
                    transition: width .3s;
                }

                .time-box {
                    flex: 1;
                    display: flex;

                    ul {
                        display: flex;
                        flex: 1;
                        border-bottom: 1px solid #c5c5c5;

                        li {
                            font-size: 14px;
                            position: relative;
                            border-left: 1px solid #cccc;
                            flex: 1;
                            text-align: center;
                            color: #fff;
                        }
                    }
                }

                .date-box {
                    flex: 1;
                    display: flex;

                    ul {
                        display: flex;
                        flex: 1;

                        li {
                            position: relative;
                            border-left: 1px solid #cccc;
                            flex: 1;
                            padding: 5px 0;
                            text-align: center;
                            color: #fff;
                        }

                        li:last-child {
                            border-right: 1px solid #cccc;
                        }
                        .dateItem{
                            padding: 14px 0px 13px 0px;
                        }
                    }
                }
            }
        }
    }
</style>
