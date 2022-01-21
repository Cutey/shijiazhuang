import request from '@/utils/request'

// 查询产品文件列表
export function getDPmPoint(query) {
    return request({
      url: 'hotpointdata/getHotPointData',
      method: 'get',
      params: query
    })
}

// 插入产品文件
export function insertDPmPoint(query) {
    return request({
      url: 'hotpointdata/insertHotPointData',
      method: 'post',
      params: query
    })
}

// 删除产品文件
export function deleteDPmPoint(query) {
    return request({
      url: 'hotpointdata/deleteHotPointData',
      method: 'post',
      params: query
    })
}

// 修改产品文件
export function updateDPmPoint(query) {
    return request({
      url: 'hotpointdata/updateHotPointData',
      method: 'post',
      params: query
    })
}

