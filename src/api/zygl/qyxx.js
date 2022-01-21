
import request from '@/utils/request'

// 查询企业信息列表
export function getDEnterpriseInfo(query) {
    return request({
      url: 'denterpriseinfo/getDEnterpriseInfo',
      method: 'get',
      params: query
    })
}

// 插入企业信息
export function insertDEnterpriseInfo(query) {
    return request({
      url: 'denterpriseinfo/insertDEnterpriseInfo',
      method: 'post',
      params: query
    })
}


//修改企业信息
export function updateDEnterpriseInfo(query) {
    return request({
      url: 'denterpriseinfo/updateDEnterpriseInfo',
      method: 'post',
      params: query
    })
}


//删除企业信息
export function deleteDEnterpriseInfo(query) {
    return request({
      url: 'denterpriseinfo/deleteDEnterpriseInfo',
      method: 'post',
      params: query
    })
}


export function getDEnterpriseIndustryKV(query) {
  return request({
    url: 'denterpriseindustry/getDEnterpriseIndustryKV',
    method: 'get',
  
  })
}