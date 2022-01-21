
import request from '@/utils/request'

//获取列表
export function getpeopleList(data){
    return request({
        url: 'Mobile/products/filePicListTureColor',
        method: 'post',
        params:data
      })
}
//新增
export function getpeopleadd(data){
    return request({
        url: 'ManagerController/insert',
        method: 'post',
        data:data
      })
}
//huoqu
export function getpeopleupdate(data){
    return request({
        url: 'ManagerController/list',
        method: 'GET',
        params:data
      })
}


//修改
export function getpeoplerevamp(data){
    return request({
        url: 'ManagerController/update',
        method: 'post',
        data:data
      })
}