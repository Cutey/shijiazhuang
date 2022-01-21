import request from '@/utils/request'

// 查询资源文件列表
export function getResources(query) {
    return request({
      url: 'resources/getResources',
      method: 'get',
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
// 插入资源文件
export function insertResources(query) {
    return request({
      url: 'resources/insertResources',
      method: 'post',
      params: query
    })
}
// 删除资源文件
export function deleteResources(query) {
    return request({
      url: 'resources/deleteResources',
      method: 'post',
      params: query
    })
}

// 修改资源文件
export function updateResources(query) {
    return request({
      url: 'resources/updateResources',
      method: 'post',
      params: query
    })
}


