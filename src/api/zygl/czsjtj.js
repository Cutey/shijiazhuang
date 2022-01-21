import request from '@/utils/request'

// 查询产品文件列表
export function getDPmPoint(query) {
    return request({
      url: 'dpmstatistic/getDPmStatistic',
      method: 'get',
      params: query
    })
}

// 插入产品文件
export function insertDPmPoint(query) {
    return request({
      url: 'dpmstatistic/insertDPmStatistic',
      method: 'post',
      params: query
    })
}

// 删除产品文件
export function deleteDPmPoint(query) {
    return request({
      url: 'dpmstatistic/deleteDPmStatistic',
      method: 'post',
      params: query
    })
}

// 修改产品文件
export function updateDPmPoint(query) {
    return request({
      url: 'dpmstatistic/updateDPmStatistic',
      method: 'post',
      params: query
    })
}

