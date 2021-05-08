import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: 'oms/fund/private/reservation/queryList',
    method: 'post',
    data
  })
}
export function queryCityList(params) {
  return request({
    url: 'oms/fund/private/reservation/queryCityList',
    method: 'get',
    params
  })
}
