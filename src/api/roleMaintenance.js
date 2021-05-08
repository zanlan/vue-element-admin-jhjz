import request from '@/utils/request'

export function queryList(params) {
  return request({
    url: 'oms/role/queryList',
    method: 'get',
    params
  })
}
export function queryPermission(params) {
  return request({
    url: 'oms/role/queryPermission',
    method: 'get',
    params
  })
}
export function updatePermission(data) {
  return request({
    url: 'oms/role/updatePermission',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: 'oms/role/add',
    method: 'post',
    data
  })
}
export function deleteOne(data) {
  return request({
    url: 'oms/role/delete',
    method: 'post',
    data
  })
}
