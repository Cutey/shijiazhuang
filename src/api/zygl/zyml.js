
import request from '@/utils/request'
// 查询资源目录列表
export function getDResourceType(query) {
    return request({
      url: 'dresourcetype/getDResourceType',
      method: 'get',
      params: query
    })
}
  
// 删除资源目录列表
export function deleteDResourceType(query) {
    return request({
      url: 'dresourcetype/deleteDResourceType',
      method: 'get',
      params: query
    })
}
  
// 更新资源目录列表
export function insertDResourceType(query) {
    return request({
      url: 'dresourcetype/insertDResourceType',
      method: 'POST',
      params: query
    })
}
  
// 更新资源目录列表
export function updateDResourceType(query) {
  return request({
    url: 'dresourcetype/updateDResourceType',
    method: 'POST',
    params: query
  })
}
  
  