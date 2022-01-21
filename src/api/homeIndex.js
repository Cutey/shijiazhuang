import request from '@/utils/request'
// 获取各系统
export function getSystem() {
    return request({
        url: '/getIndexMenue',
        method: 'get'
    })
}
