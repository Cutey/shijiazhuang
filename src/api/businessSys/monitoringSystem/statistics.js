import request from '@/utils/request'

//区域站点
export function getPoint(query) {
    return request({
        url:'/api/pm/pointList',
        method:'get',
        params:query
    })
}
//空间对比
export function spacePmData(query) {
    return request({
        url: '/api/pm/spacePmData',
        method: 'get',
        params: query
    })
}

//时间对比
export function timePmData(query) {
    return request({
        url:'/api/pm/timePmData',
        method: 'get',
        params: query
    })
}

//反馈信息列表
export function feedBackList(query) {
    return request({
        url:'/api/pm/hotPointFeedBackList',
        method:'get',
        params:query
    })
}

//反馈信息列表下载
export function exportFeedBack(query) {
    return request({
        url:'/api/pm/exportFeedBackList',
        method:'get',
        params:query
    })
}

//反馈信息统计
export function fbStatistics(query) {
    return request({
        url:'/api/pm/fbStatistics',
        method:'get',
        params:query
    })
}
