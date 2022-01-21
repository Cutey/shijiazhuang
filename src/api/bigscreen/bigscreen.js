import request from '@/utils/request'
import $ from "jquery"


// 查询定时任务调度列表
export function getpie(data) {
    return request({
        url: 'map/newHostDate',
        method: 'get',
        params: data
    })
}

//   获取热点网格的地图数据
export function gethotspotMap(data) {
    return request({
        url: 'map/ldsHotPointHandler',
        method: 'post',
        params: data
    })
}

// 获取企业类型的数据
export function getgridTypeList(data) {
    return request({
        url: 'map/gridTypeList',
        method: 'post',
        params: data
    })
}
//获取热点网格的企业个数
export function getcounty(data) {
    return request({
        url: 'map/countyEnterpriseHandler',
        method: 'post',
        params: data
    })
}

//获取热点网格的分布
export function getgridList(data) {
    return request({
        url: 'api/pm/gridList',
        method: 'get',
        params: data
    })
}

//火点接口
export function getStatistic(data) {
    return request({
        url: 'map/selectNewCityStatistic',
        method: 'post',
        params: data
    })
}

//站点接口
export function getselectPoint(data) {
    return request({
        url: 'map/selectPoint',
        method: 'post',
        params: data
    })
}

//pm接口  
export function getselectPm(data) {
    return request({
        url: 'map/selectPm',
        method: 'post',
        params: data
    })
}

export function getscrollingTips(data) {
    return request({
        url: 'map/scrollingTips',
        method: 'get',
        params: data
    })
}

export function getbareDate(data) {
    return request({
        url: 'map/selectBareLand',
        method: 'get',
        params: data
    })
}