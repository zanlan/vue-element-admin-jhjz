import request from '@/utils/request'
export function queryAllListNewWorth(data) {
  return request({
    url: 'oms/fund/private/nav/queryPrivateNavList',
    method: 'post',
    data
  })
}
export function deleteOne(data) {
  return request({
    url: 'oms/fund/private/nav/delete',
    method: 'post',
    data
  })
}
export function addOne(data) {
  return request({
    url: 'oms/fund/private/nav/add',
    method: 'post',
    data
  })
}
export function updateOne(data) {
  return request({
    url: 'oms/fund/private/nav/update',
    method: 'post',
    data
  })
}
export function fileUpload(data) {
  return request.post('oms/fund/private/nav/import', data, { timeout: 120 * 1000 })
}
export function download() {
  return request({
    url: 'oms/fund/private/nav/downloadTemplate',
    method: 'get',
    responseType: 'blob',
    timeout: 120 * 1000
  })
}
