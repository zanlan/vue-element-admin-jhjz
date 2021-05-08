import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'

export const defaultRoute = [
  {
    path: '/login',
    id: '登录',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    id: '找不到',
    component: () => import('@/views/404'),
    hidden: true
  }
]

export const constantRoutes = [
  {
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
  },
  {
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
  },
  {
    path: '/selectedFund',
    component: Layout,
    id: '精选基金设置',
    children: [
      {
        path: 'index',
        name: 'SelectedFund',
        component: () => import('@/views/selectedFund/index'),
        meta: { title: '精选基金设置', icon: 'selected' }
      }
    ]
  },

  {
    path: '/informationSettings',
    component: Layout,
    id: '私募产品信息设置',
    children: [
      {
        path: 'index',
        name: 'InformationSettings',
        component: () => import('@/views/informationSettings/index'),
        meta: { title: '私募产品信息设置', icon: 'information' }
      }
    ]
  },
  {
    path: '/netWorth',
    component: Layout,
    id: '私募产品净值维护',
    children: [
      {
        path: 'index',
        name: 'NetWorth',
        component: () => import('@/views/netWorth/index'),
        meta: { title: '私募产品净值维护', icon: 'worth' }
      }
    ]
  },
  {
    path: '/customerAppointment',
    component: Layout,
    id: '客户预约信息查询',
    children: [
      {
        path: 'index',
        name: 'CustomerAppointment',
        component: () => import('@/views/customerAppointment/index'),
        meta: { title: '客户预约信息查询', icon: 'customer' }
      }
    ]
  },
  {
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
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: defaultRoute
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
