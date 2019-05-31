
const state={//要设置的全局访问的state对象
  Data:{
    uid:"",//唯一id
    userName:'',//用户姓名
    isLogin:false,//登录状态
    headimg:null,//头像
    number:'',//学号
    sex:'',//性别
    power:0,//是否管理员
    phone:null,//手机号
    college:'',//院系
    userclass:'',//班级
    comm:false,//改变社区标题栏字体颜色
    footerLock:true,
    hostname:null,//主机名 用来保存超时登录返回
    isDot:true//是否点开公告
  }
};
const mutations = {
  save(state,payload){
    console.log('我是可通用修改state的子对象所有数据的mutations方法！',payload)
    state.Data={...state.Data,...payload}
  }
};
const actions = {
  changeName(context,datas){   //通过mutations修改数据,此方法内可做异步操作
    console.log('我是修改名字actions！')
    context.commit('saveName',datas)
    // setTimeout(()=>{ //一般做异步ajax请求
    //   context.commit('newData',datas)
    // }，1000)
  },
  save(context,datas){
    console.log('我是通过dispatch的通用修改的actions',datas)
    context.commit('save',datas)
  }
};

export default {
  namespaced:true,//用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  //getters,
  mutations,
  actions
}
