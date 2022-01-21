import request from '@/utils/request'

export function editEviCard(data,url) {
    return request({
      url: url,
      method: 'post',
      data: data
    })
}
  
export function upateWordAndPdf(data) {
  return request({
    url: 'api/pm/upateWordAndPdf',
    method: 'post',
    data: data
  })
}