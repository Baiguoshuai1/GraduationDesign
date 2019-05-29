// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import store from './store/store.js'
import $api from './api/api'
import Swiper from 'swiper'
import utils from '../vue-util'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/base.css'
import 'swiper/dist/css/swiper.min.css'
import './assets/css/theme.scss'

Vue.use(element);
Vue.prototype.Swiper = Swiper;
Vue.prototype.$notify= function (options,duration=1200) {
  element.Notification({...options,duration})
}
Vue.prototype.$message = function (msg,type,duration=1200) {
  element.Message({message: msg,duration,type,})
}
Vue.prototype.$utils=utils
Vue.prototype.$confirm=element.MessageBox.confirm
Vue.prototype.$api=$api
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render(creat){
    return creat(App)
  }
})
