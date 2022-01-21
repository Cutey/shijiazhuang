
import request from '@/utils/request'

// 查询企业信息列表
export function getDEnterpriseIndustry(query) {
    return request({
      url: 'denterpriseindustry/getDEnterpriseIndustry',
      method: 'get',
      params: query
    })
}

// 插入企业信息
export function insertDEnterpriseIndustry(query) {
    return request({
      url: 'denterpriseindustry/insertDEnterpriseIndustry',
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

export function getDEnterpriseIndustryKV(query) {
  return request({
    url: 'denterpriseindustry/getDEnterpriseIndustryKV',
    method: 'get',
  
  })
}


//删除企业信息
export function deleteDEnterpriseIndustry(query) {
    return request({
      url: 'denterpriseindustry/deleteDEnterpriseIndustry',
      method: 'post',
      params: query
    })
}