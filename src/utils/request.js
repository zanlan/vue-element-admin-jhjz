import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'
import { isBlob, getFileName } from '@/utils'
const service = axios.create({
  // baseURL: 'https://qomsser.jhjzfund.com/', // url = base url + request url
  // baseURL: 'http://10.101.81.212:8092/', // url = base url + request url
  // baseURL: 'http://10.101.81.207:8092/', // url = base url + request url
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  response => {
    // 每次请求新的接口，重置token信息
    const token = response.headers.authorization
    if (token) {
      setToken(token)
    }
    const res = response.data
    if (isBlob(res)) {
      const name = getFileName(response)
      return { name, data: res }
    }
    if (res.code != 1) {
      // 上传重复数据了  需要返回res
      if (res.data && res.data.duplicateList && res.data.duplicateList.length > 0) {
        return res
      }
      // 删除有关联用户的角色时，提示用户是否强制删除  需要返回res
      if (res.code === '00100010001') {
        return res
      }
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code == 1011) {
        MessageBox.confirm('登录信息失效，请重新登录', '登录提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        }).catch(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        return Promise.reject(new Error(res.message || 'Error'))
      }
    } else {
      return res
    }
  },
  error => {
    Message({
      showClose: true,
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
