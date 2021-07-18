import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ListOfStocks from "../views/ListOfStocks";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/lsusa',
    name: 'ListStocksUS',
    component: ListOfStocks
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
