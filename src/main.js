import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // en

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
import { debounce } from '@/utils'
Vue.directive('debounce', {
  // 绑定的值为el，和binding
  // binding的值为指令绑定的值,binding中有哪些值，可以去vue官网中查看自定义指令
  bind(el, binding) {
    let execFunc
    // 在函数传参与不传参调用的时候，打印出来的binding.value是不同的
    // 打印binding.value可以帮助理解为什么有传参和不传参的区别
    if (binding.value instanceof Array) {
      // 函数传参
      const [func, time = 500] = binding.value
      execFunc = debounce(func, time)
    } else {
      // 函数不传参
      execFunc = debounce(binding.value, 500)
    }
    el.addEventListener('click', execFunc)
  }
})

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
