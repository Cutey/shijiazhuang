import request from '@/utils/request'

// 查询产品文件列表
export function getProducer(query) {
    return request({
      url: 'producer/getProducer',
      method: 'get',
      params: query
    })
}

// 插入产品文件
export function insertProducer(query) {
    return request({
      url: 'producer/insertProducer',
      method: 'post',
      params: query
    })
}

// 删除产品文件
export function deleteProducer(query) {
    return request({
      url: 'producer/deleteProducer',
      method: 'post',
      params: query
    })
}

// 删除产品文件
export function updateProducer(query) {
    return request({
      url: 'producer/updateProducer',
      method: 'post',
      params: query
    })
}


// 查询资源文件列表
export function getDResourceTypeKV(query) {
    return request({
      url: 'dresourcetype/getDResourceTypeKV',
      method: 'get',
    })
  }