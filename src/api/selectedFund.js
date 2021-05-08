import request from '@/utils/request'

export function queryAllList(params) {
  return request({
    url: 'oms/fund/mutual/queryAllList',
    method: 'get',
    params
  })
}

export function addChosen(data) {
  return request({
    url: 'oms/fund/mutual/addChosen',
    method: 'post',
    data
  })
}

export function queryChosenList(data) {
  return request({
    url: 'oms/fund/mutual/queryChosenList',
    method: 'post',
    data
  })
}

export function updateChosenDisplayOrder(data) {
  return request({
    url: 'oms/fund/mutual/updateChosenDisplayOrder',
    method: 'post',
    data
  })
}
export function deleteChosen(data) {
  return request({
    url: 'oms/fund/mutual/deleteChosen',
    method: 'post',
    data
  })
}
export function updateChosenDisplayOrderBatch(data) {
  return request({
    url: 'oms/fund/mutual/updateChosenDisplayOrderBatch',
    method: 'post',
    data
  })
}
export function queryAllChosenFund(params) {
  return request({
    url: 'oms/fund/mutual/queryAllChosenFund',
    method: 'get',
    params
  })
}
