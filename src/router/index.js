import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
// import Callback from '@/components/Callback'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    { // current implementation does not use /callback, and .handleAuthentication() is called from within /home
      path: '/callback',
      name: 'Callback',
      component: Home
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})

export default router
