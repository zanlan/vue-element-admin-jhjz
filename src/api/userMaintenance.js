import request from '@/utils/request'

export function queryList(params) {
  return request({
    url: 'oms/user/queryList',
    method: 'get',
    params
  })
}
export function getRoles(params) {
  return request({
    url: 'oms/user/queryUnHoldRole',
    method: 'get',
    params
  })
}
export function updateRole(data) {
  return request({
    url: 'oms/user/updateRole',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: 'oms/user/add',
    method: 'post',
    data
  })
}
export function updateStatus(data) {
  return request({
    url: 'oms/user/updateStatus',
    method: 'post',
    data
  })
}
export function syncRole(data) {
  return request({
    url: 'oms/user/syncRole',
    method: 'post',
    data
  })
}
export function resetPwd(data) {
  return request({
    url: 'oms/user/resetPwd',
    method: 'post',
    data
  })
}

