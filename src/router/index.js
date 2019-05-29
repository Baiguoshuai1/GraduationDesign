import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import regist from '@/components/regist'
import info from '@/components/infomation'
import community from '@/components/community'
import sourcepage from '@/components/sourcepage'
import technology from '@/components/technology'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: index
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/regist',
      name: 'regist',
      component: regist,
    //  meta:{requireAuth:true}
    },
    {
      path: '/info',
      name: 'info',
      component: info
    },
    {
      path: '/community',
      name: 'community',
      component: community
    },
    {
      path: '/sourcepage',
      name: 'sourcepage',
      component: sourcepage
    },
    {
      path: '/technology',
      name: 'technology',
      component: technology
    },
  ],
  scrollBehavior(to,from,savedPosition){
    if(savedPosition){
      return savedPosition;
    }else{
      return {x:0,y:0}
    }
  }
})
// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
// router.beforeEach((to, from, next) => {
//   //console.log('跳转',to.matched,to.fullPath,to.matched.some(m => m.meta.requireAuth))
//   // 对路由进行验证
//   let token = sessionStorage.getItem('userId');// token存在条件
//   if (!to.matched.some(m => m.meta.requireAuth)) {
//     if(!token){
//       next({
//         path: '/login',  // 验证失败要跳转的页面
//         query: {
//           // redirect: to.fullPath// 要传的参数
//         }
//       })
//     }else{
//       next();
//     }
//   }else {
//     next();// 调用 next()
//   }
// });
export default router
