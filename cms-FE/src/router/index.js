import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * 基础路由
 * 所有权限的用户，都能访问
 */

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },

  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },

  // {
  //   hidden: true,
  //   path: '/version',
  //   name: 'Verison',
  //   component: () => import('@/views/version'),
  //   meta: { title: '版本信息' },
  // },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '主页', icon: 'el-icon-s-home' },
      },
    ],
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    meta: {
      title: '用户管理',
      icon: 'el-icon-user',
    },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理' },
      },
    ],
  },

  {
    path: '/note',
    component: Layout,
    redirect: '/note/list',
    meta: {
      title: '文章管理',
      icon: 'el-icon-menu',
    },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/note/list'),
        meta: { title: '文章管理' },
      },
    ],
  },
]

/**
 * 动态（异步）路由
 * 根据 roles 来设置访问权限
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    meta: {
      roles: null,
      icon: 'lock',
      tag: 'permission',
    },
    children: [
      {
        path: '',
        name: 'permission',
        component: () => import('@/views/permission/index'),
        meta: { title: '权限' },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true,
    meta: {
      roles: null,
    },
  },
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    // base: env.routerPath,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
