import router, { constantRoutes, defaultRoute } from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  if (hasToken) {
    console.log('有token')
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          store.dispatch('user/getInfo').then(res => {
            const roles = res.roles
            let arr = []
            roles.forEach(item => {
              if (item.permissions.length > 0) {
                item.permissions.forEach(item2 => {
                  if (item2) {
                    arr.push(item2.permsName)
                  }
                })
              }
            })
            arr = Array.from(new Set(arr))
            let brr = constantRoutes.filter(item => {
              return arr.includes(item.id)
            })
            // 密码重置后 或者新用户 初次登陆 要有一个修改密码页面
            if (res.isUnsafeStatus == 1) {
              brr = [{
                path: '/changePassword',
                id: '修改密码',
                component: Layout,
                children: [
                  {
                    path: 'index',
                    name: 'ChangePassword',
                    component: () => import('@/views/changePassword/index'),
                    meta: { title: '修改密码', icon: 'settings' }
                  }
                ]
              }]
            }
            console.log(brr)

            // 对于超级管理员
            if (res.isUnsafeStatus == 0 && res.isSuperAdmin == 1) {
              // 如果查询到brr内没有角色维护，则添加角色维护
              let flag1 = false
              brr.forEach(item => {
                if (item.id == '角色维护') {
                  flag1 = true
                }
              })
              console.log(flag1, 'flag11')
              if (!flag1) {
                brr.unshift({
                  path: '/roleMaintenance',
                  component: Layout,
                  id: '角色维护',
                  children: [
                    {
                      path: 'index',
                      name: 'RoleMaintenance',
                      component: () => import('@/views/roleMaintenance/index'),
                      meta: { title: '角色维护', icon: 'role' }
                    }
                  ]
                })
              }
              // 如果查询到brr内没有用户维护，则添加用户维护
              let flag2 = false
              brr.forEach(item => {
                if (item.id == '用户维护') {
                  flag2 = true
                }
              })
              console.log(flag2, 'flag22')
              if (!flag2) {
                console.log(brr)
                brr.unshift({
                  path: '/userMaintenance',
                  component: Layout,
                  id: '用户维护',
                  children: [
                    {
                      path: 'index',
                      name: 'UserMaintenance',
                      component: () => import('@/views/userMaintenance/index'),
                      meta: { title: '用户维护', icon: 'maintain' }
                    }
                  ]
                })
                console.log(brr)
              }
            }
            // 有菜单权限
            const common404 = { path: '*', id: '通用路径', redirect: '/404', hidden: true }
            if (brr.length > 0) {
              brr[0].redirect = brr[0].path
              const str = brr[0].redirect.slice(1)
              brr[0].path = '/'
              brr[0].children[0].path = str
              console.log(brr)
              router.options.routes = [...defaultRoute, ...brr, common404]
              router.addRoutes([...brr, common404])
              next({ ...to, replace: true })
            } else {
              // 没有菜单权限
              router.options.routes = [...defaultRoute, ...brr, common404]
              router.addRoutes([...brr, common404])
              Message({
                showClose: true,
                type: 'error',
                message: '您还没有权限'
              })
              this.$store.dispatch('user/logout')
              router.push({ path: '/login' })
              next({ ...to, replace: true })
            }
            // {
            //   path: '/userMaintenance',
            //   component: Layout,
            //   id : '用户维护',
            //   children: [
            //     {
            //       path: 'index',
            //       name: 'UserMaintenance',
            //       component: () => import('@/views/userMaintenance/index'),
            //       meta: { title: '用户维护', icon: 'maintain' }
            //     }
            //   ]
            // },
            // {
            //   path: '/',
            //   id:'用户维护',
            //   component: Layout,
            //   redirect: '/userMaintenance',
            //   children: [{
            //     path: 'userMaintenance',
            //     name: 'UserMaintenance',
            //     component: () => import('@/views/userMaintenance/index'),
            //     meta: { title: '用户维护', icon: 'maintain' }
            //   }]
            // },
          })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    console.log('没有token')
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
