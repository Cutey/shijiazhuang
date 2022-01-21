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
        <div class="time-axis-box">
            <div class="time-axis">
                <div id="axis-box" class="axis-box" @mouseover="timeAxisMouseOver($event)"
                     @mouseleave="timeAxisMouseLeave($event)" @click="timeAxisClick">
                    <div id="hover-time-slide" class="hover-time-slide time-slide">00:00</div>
                    <div id="axis-slide">
                        <div id="time-slide" class="time-slide">00:00</div>
                    </div>
                </div>
                <div class="time-box">
                    <ul>
                        <li class="time-item" v-for="(item,index) in dateArray" :key="index">{{item}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "timeAxis",
        props: {
            day: {
                type: Number,
                default: 7
            },
            timeLength: {
                type: Number,
                default: 1
            },
            speed: {
                type: Number,
                default: 1000
            }
        },
        data() {
            return {
                activeBtn: 'play',
                dateArray: [],
                //计算总时间长度
                totalTimeLength: null,
                //获取时间轴
                axisBox: null,
                //获取时间轴长度
                axisWidth: null,
                //获取时间滑块
                timeSlide: null,
                //获取时间轴滑块
                axisSlide: null,
                //计算滑块移动长度
                moveLength: null,
                //时间滑块时长
                timeText: 0,
                //定时器
                intervalCount: null,
                //时间计算
                timeCount: 0,
                //获取hover时间滑块
                hoverTimeSlide: null,
                //hover时间滑块left值
                hoverTimeSlideLeft: null,
                //hover时间滑块时间文本
                hoverTimeSlideTextTime: null,
                //获取日期元素宽度
                timeItemWidth: null,
                //鼠标指向时间轴获取日期索引
                mouseDateIndex: 0
            }
        },
        mounted() {
            this.$nextTick(() => {
                let that = this;
                this.initDate();
                setTimeout(function () {
                    that.timeAxisDoc();
                }, 500)

            });
        },
        methods: {
            //获取时间轴元素
            timeAxisDoc() {
                let that = this;
                //获取时间轴
                that.axisBox = document.getElementById('axis-box');
                //获取时间滑块
                that.timeSlide = document.getElementById('time-slide');
                //获取时间轴滑块
                that.axisSlide = document.getElementById('axis-slide');
                //获取hover时间滑块
                that.hoverTimeSlide = document.getElementById('hover-time-slide');
                //获取日期元素
                let timeItem = document.getElementsByClassName('time-item')[0];
                //获取日期元素宽度
                that.timeItemWidth = timeItem.offsetWidth;
                //获取时间轴长度
                that.axisWidth = that.axisBox.offsetWidth;
                //计算总时间时长
                that.totalTimeLength = 10 / this.timeLength * this.day;
                //计算滑块移动步长
                that.moveLength = that.axisWidth / that.totalTimeLength;

            },
            //播放
            playBtn() {
                let that = this;
                that.activeBtn = 'pause';
                //时间移动方法
                this.timeMove();
            },
            //暂停c
            pauseBtn() {
                this.activeBtn = 'play';
                // clearTimeout(this.intervalCount);
                // this.intervalCount = null
            },
            //停止
            stopTimeMove() {
                let that = this;
                clearTimeout(that.intervalCount);
                that.intervalCount = null
                //设置时间轴滑块宽度为初始宽度
                that.axisSlide.style.width = 0 + 'px';
                //将按钮状态设置为播放
                that.activeBtn = 'play';
                //初始时间计算
                that.timeCount = 0;
                //初始时间滑块
                that.timeSlide.innerText = '08:00';
                //时间滑块时长
                that.timeText =8;
            },
            //初始化时间轴日期
            initDate() {
                let myDate = new Date(); //获取今天日期
                myDate.setDate(myDate.getDate() - this.day + 1);
                for (let i = 0; i < this.day; i++) {
                    let day = myDate.getDate();
                    let mon = myDate.getMonth() + 1;
                    let year = myDate.getFullYear();
                    let dateTemp = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
                    this.dateArray.push(dateTemp);
                    myDate.setDate(myDate.getDate() + 1);
                }
            },
            //定时方法
            timeMove() {
                    let that = this;
                     //获取时间轴滑块宽度
                    let axisSlideWidth = that.axisSlide.offsetWidth;
                     //设置时间滑块文本
                        that.timeText = that.timeText + that.timeLength;
                    //当时间轴滑块宽度大于时间轴总宽度,移除定时器
                    if (axisSlideWidth >= that.axisWidth) {
                        //停止移动
                        that.stopTimeMove();
                        return;
                    }else{
                        
                    if (that.timeText === 19) {
                        that.timeText = 8;
                        ++that.timeCount; //时间计数自增
                    }
                      that.timeSlide.innerText = (that.timeText < 10 ? ('0' + that.timeText + ':00') : that.timeText + ':00');
                    //设置时间轴滑块宽度
                    that.axisSlide.style.width = axisSlideWidth + that.moveLength + 'px';
                      if (that.timeCount < that.dateArray.length && that.activeBtn =='pause') {
                          
                        //获取数组中日期加上时间(时分秒00:00:00)
                        let time = that.dateArray[that.timeCount] + ' ' + that.timeSlide.innerText + ':00';
                        var myFirstPromise = new Promise(function(resolve, reject){
                                
                               that.intervalCount = setTimeout(function(){
                                   resolve("成功!"); //代码正常执行！
                                }, that.speed)
                            });
                            myFirstPromise.then(function(successMessage){
                                that.$emit('timeAxisMapData', time, that.intervalCount, 'I');
                            });
                        
                    } else if(that.activeBtn !=='pause'){
                       
                    }else{
                         //停止移动
                        that.stopTimeMove();
                        return;
                    }

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
                //计算时间轴到屏幕之间距离
                let axisBox = (window.innerWidth - that.axisBox.offsetWidth) / 2;
                //计算hover时间滑块left值
                that.hoverTimeSlideLeft = x - axisBox - that.axisBox.offsetLeft;
                //设置hover时间滑块left值
                that.hoverTimeSlide.style.left = that.hoverTimeSlideLeft + 'px';
                //计算hover时间滑块移动步长显示时间
                let ht = Math.floor((that.hoverTimeSlideLeft % that.timeItemWidth) / that.moveLength);
                that.hoverTimeSlideTextTime = (ht * that.timeLength)+8;
                //设置时间
                that.hoverTimeSlide.innerText = (that.hoverTimeSlideTextTime < 10 ? ('0' + that.hoverTimeSlideTextTime + ':00') : that.hoverTimeSlideTextTime + ':00');
                //计算鼠标指向时间轴位置,获取年月日索引
                that.mouseDateIndex = parseInt(that.hoverTimeSlideLeft / that.timeItemWidth);
            },
            //时间轴点击事件
            timeAxisClick() {
                let that = this;
                 window.clearTimeout(that.intervalCount);
                that.intervalCount = null
                this.activeBtn = 'play';
                //时间轴滑块宽度
                that.axisSlide.style.width = that.hoverTimeSlideLeft + 'px';
                //时间
                that.timeText = that.hoverTimeSlideTextTime;
                //日期计数器
                that.timeCount = that.mouseDateIndex;
                that.timeSlide.innerText = (that.timeText < 10 ? ('0' + that.timeText + ':00') : that.timeText + ':00');
                let time = that.dateArray[that.timeCount] + ' ' + that.timeSlide.innerText + ':00';
                //调用地图展示方法
                that.$emit('timeAxisMapData', time, that.intervalCount, 'C');
            },
            //初始化时间轴时间滑块位置
            initTimeSlide(curTime) {
                let that = this;
                let dateIndex = null;//记录日期位置
                let dataDate = curTime.split(' ');//空格截取日期及时间
                if (this.dateArray.length > 0) {
                    for (let i = 0; i < this.dateArray.length; i++) {
                        if (dataDate[0] == this.dateArray[i]) {
                            dateIndex = i;
                            break;
                        }
                    }

                    that.timeCount = dateIndex
                    //将时间分割
                    let times = dataDate[1].split(':');
                    //获取小时整数
                    let h = parseInt(times[0])-1;
                    that.timeText = h
                    //获取日期元素
                    let timeItem = document.getElementsByClassName('time-item')[0];
                    //获取时间轴滑块
                    let axisSlide = document.getElementById('axis-slide');
                    //获取时间滑块
                    let timeSlide = document.getElementById('time-slide');

                    //获取元素宽度
                    let itemWidth = timeItem.offsetWidth;
                    //计算小时步长
                    let moveLength = (itemWidth / 10 * that.timeLength) * (h-8);
                    //总长度
                    let moveCountLenght = itemWidth * dateIndex + moveLength;
                    //设置时间轴滑块
                    axisSlide.style.width = moveCountLenght + 'px';
                    //设置时间
                    timeSlide.innerText = times[0]+':'+times[1];
                }

            }
        }
    }
</script>

<style lang="scss" scoped>
    #time-axis-wrap {
        position: absolute;
        bottom: 10px;
        width: 1120px;
        left: 0;
        right: 0;
        margin: 0 auto;
        padding: 0px 25px 0 15px;
        background: rgba(0, 41, 58, 0.9);
        border: 1px solid #036db9;
        border-radius: 50px;
        display: flex;
        height: 80px;

        .btn-box {
            display: flex;
            align-items: center;

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
            padding: 11px 0 10px 20px;
            position: relative;
            align-items: flex-end;
            justify-content: center;

            .time-slide {
                width: 45px;
                height: 20px;
                position: absolute;
                //left: 5px;
                background: #046f99;
                top: -27px;
                border-radius: 4px;
                color: #fff;
                line-height: 20px;
                text-align: center;
                transform: translateX(50%);
                right: 0;
            }

            .time-slide::after {
                content: '';
                position: absolute;
                left: 15px;
                top: 100%;
                border-top: 6px solid #046f99;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
            }

            .hover-time-slide {
                left: 60px;
                background: rgba(255, 255, 255, 0.9);
                transform: translateX(-50%);
                color: #333;
                display: none;
                z-index: 11;
            }

            .hover-time-slide:after {
                border-top: 6px solid rgba(255, 255, 255, 0.9);
            }

            .time-axis {
                display: flex;
                flex-flow: column;
                height: 38px;

                .axis-box {
                    background: #fff;
                    border-radius: 50px;
                    height: 10px;
                    position: relative;
                    cursor: pointer;

                    #axis-slide {
                        position: absolute;
                        border-radius: 50px;
                        height: 10px;
                        background: #046f99;
                        transition: width .3s;
                    }
                }

                .time-box {
                    flex: 1;
                    display: flex;

                    ul {
                        display: flex;
                        flex: 1;
                        color: #fff;
                        justify-content: space-between;
                        margin-top: 10px;

                        li {
                            position: relative;
                            justify-content: center;
                            display: flex;
                            border-left: 1px solid;
                            width: 144px;
                        }

                        li:last-child {
                            border-right: 1px solid;
                        }
                    }
                }
            }
        }
    }
</style>
