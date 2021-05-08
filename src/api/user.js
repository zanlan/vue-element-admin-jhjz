import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'oms/login',
    method: 'post',
    data
  })
}

export function getInfo(params) {
  return request({
    url: 'oms/user/getUserInfo',
    method: 'post'
  })
}

export function logout() {
  // return request({
  //   url: '/vue-admin-template/user/logout',
  //   method: 'post'
  // })
  return Promise.resolve()
}
