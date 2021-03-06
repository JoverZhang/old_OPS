import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
// import Home from '@/components/Home/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/components/Home/Home'),
      children: [
        {
          path: 'main',
          name: 'Main',
          component: () => import('@/components/Home/Main')
        },
        {
          path: 'checkMaterial',
          name: 'CheckMaterial',
          component: () => import('@/components/Home/CheckMaterial/CheckMaterial')
        },
        {
          path: 'mix',
          name: 'Mix',
          component: () => import('@/components/Home/Mix')
        },
        {
          path: 'checkStorage',
          name: 'CheckStorage',
          component: () => import('@/components/Home/CheckStorage/CheckStorage')
        }, {
          path: 'workList',
          name: 'WorkList',
          component: () => import('@/components/Home/WorkList')
        }

      ]
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/components/Infinite-Scroll')
    }
  ]
})
