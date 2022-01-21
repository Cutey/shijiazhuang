import request from '@/utils/request'

// 获取路由
export const getRouters = (data) => {
  return request({
    url: '/getRouters?sysTypes='+data,
    method: 'get',
  })
}
