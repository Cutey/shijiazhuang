import request from '@/utils/request'

//获取国控站点数据
export function statePmData(query){
    return request({
        url: '/api/pm/statePmData',
        method: 'get',
        params: query
    })
};
//获取省控站点数据
export function provincePmData(query){
    return request({
        url:'/api/pm/provincePmData',
        method:'get',
        params:query
    });
}
//获取热点网格数据
export function gridList(query){
    return request({
        url:'/api/pm/gridList',
        method:'get',
        params:query
    });
}
//日报数据及轮播数据
export function reportData(query) {
    return request({
        url:'/api/pm/productsList',
        method:'get',
        params:query
    })
}
//日报数据及轮播数据
export function upateOKByWordAndPdf(query) {
    return request({
        url:'/api/pm/upateOKByWordAndPdf',
        method:'post',
        params:query
    })
}
