import request from '@/utils/request'
export function queryAllList(params) {
  return request({
    url: 'oms/fund/private/queryAllList',
    method: 'get',
    params
  })
}
export function update(data) {
  return request({
    url: 'oms/fund/private/update',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: 'oms/fund/private/add',
    method: 'post',
    data
  })
}
export function deleteOne(data) {
  return request({
    url: 'oms/fund/private/delete',
    method: 'post',
    data
  })
}
