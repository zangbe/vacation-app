import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import store from '../store/index'

Vue.use(VueRouter)

const requireAuth = () => (from, to, next) => {
  if (store.state.accessToken) {
    next();
  } else {
    next('/');
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    beforeEnter: requireAuth(),
  },
  {
    path: '*',
    name: 'NotFound',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
