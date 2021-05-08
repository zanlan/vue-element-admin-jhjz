import request from '@/utils/request'

export function updatePwd(data) {
  return request({
    url: 'oms/user/updatePwd',
    method: 'post',
    data
  })
}
