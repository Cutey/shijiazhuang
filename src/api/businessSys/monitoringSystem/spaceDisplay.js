import request from '@/utils/request'

//区域数据
export function areaList(query){
    return request({
        url:'/api/pm/areaList',
        method:'get',
        params:query
    })
}
//获取最新有热点网格数据的日期
export function hostDate(query) {
    return request({
        url:'/map/newHostDate',
        method:'get',
        params:query
    })
}
//热点网格数据
export function hotPointHandler(query) {
    return request({
        url:'/map/ldsHotPointHandler',
        method:'get',
        params:query
    })
}
//pm25及pm10数据
export function selectPm(query) {
    return request({
        url:'/map/selectPm',
        method:'get',
        params:query
    })
}

//热点信息反馈
export function feedBack(query) {
    return request({
        url:'/api/pm/addFeedBack',
        method:'post',
        data:query
    })
}

//获取各类型时间组
export function factorTypeDate(query) {
    return request({
        url:'/map/getHotPointAndTmPngNewTime',
        method:'get',
        params:query
    })
}
//获取地图数据
export function mapData(query) {
    return request({
        url:'/map/getHotPointAndTmPngData',
        method:'get',
        params:query
    })
}
