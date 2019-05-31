<template>
  <div id="app" :class="footerLock?'footerLock':''">
    <header class="Allheader">
      <img src="../static/img/logo.png" class="logo hoverCursor" @click="()=>this.$router.push({name:'index'})"/>
      <router-link tag="span" :to="{name:'index'}" :class="comm?'header_title':'header_title2'">首页</router-link>
      <router-link tag="span" :to="{name:'community'}" :class="comm?'header_title':'header_title2'">在线社区</router-link>
      <router-link tag="span" :to="{name:'sourcepage'}" :class="comm?'header_title':'header_title2'">共享资源</router-link>
      <!--<router-link tag="span" :to="{name:'community'}" :class="comm?'header_title':'header_title2'">技术支持</router-link>-->
      <div class="header-right">
        <router-link tag="span" :to="{name:'technology'}" :class="comm?'header_title':'header_title2'">技术支持</router-link>
        <router-link v-if="!isLogin" tag="span" :to="{name:'regist',query:{redirect: hostname&&hostname}}" :class="comm?'header_title':'header_title2'">登录/注册</router-link>
        <el-dropdown v-else :hide-on-click="false">
          <span :class="comm?'header_title el-dropdown-link':'header_title2 el-dropdown-link'">
            <!--<el-badge is-dot>-->
            {{userName}}
            <!--</el-badge>-->
            <el-tag type="success" size="mini" style="font-size: 10px;margin:0;position: relative;right: -65px;top: -15px;">学生</el-tag>
              <img :src="headimg"
                   style="width: 40px;height:40px;border-radius: 100%;margin-left:0px;border: 1px solid #ddd;cursor: pointer"/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-edit" @click.native="goInfo"> 编辑信息</el-dropdown-item>
            <!--<el-dropdown-item>-->
              <!--<el-icon class="el-icon-chat-dot-round"></el-icon>-->
              <!--回复我的-->
            <!--</el-dropdown-item>-->
            <el-dropdown-item @click.native="exit">
              <el-icon class="el-icon-switch-button" v-if="clickExit"></el-icon>
              <el-icon class="el-icon-loading" v-else></el-icon>
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <router-view/>
    <div class="footer" v-if="!comm">
      <div style="display: flex;flex-direction: column;height:100%;justify-content: space-around;align-items: center">
        <p>
          《数学建模》课程师生互动平台
        </p>
        <p>
          2019 © B15060101
        </p>
        <p>
          <span style="margin-right: 10px">指导教师：张素芹</span> 作者专业：计算机科学与技术
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'App',
    data() {
      return {
        clickExit: true
      }
    },
    computed: {
      ...mapState('FirstData', {
        isLogin: state => state.Data.isLogin,
        userName: state => state.Data.userName,
        headimg: state => state.Data.headimg,
        comm: state => state.Data.comm,
        footerLock: state => state.Data.footerLock,
        hostname: state => state.Data.hostname,
      })
    },
    methods: {
      ...mapMutations('FirstData', [
        'save'
      ]),
      //退出登录
      async exit() {
        //改变icon
        this.clickExit = false
        await this.$utils.sleep(500)
        //改变全局登录状态 和用户名
        this.save({isLogin: false, userName: ''})
        sessionStorage.removeItem('number')
        this.clickExit = true
        //设置主机名 保证登录返回
        this.save({hostname:location.hostname })
      },
      //编辑信息
      goInfo(){
        this.$router.push({name:'info'})
      }

    },
    async created() {
      //为每次刷新保证vuex数据存在
      let number = sessionStorage.getItem('number')
      if (number) {
        const {uid,username,userclass,headimg,sex,college,phone,power} = await this.$api.post(`/user/getuser?number=${number}`)
         this.save({uid,userName: username, isLogin: true,headimg,number,sex,college,userclass,phone,power})
      }
    },
    mounted() {
      //监听滚轮事件
      document.addEventListener('scroll', (e) => {
        let header = document.querySelector('.Allheader')
        if (document.documentElement.scrollTop > 0) {
          header.style.background = 'rgba(0,0,0,.3)'
          return
        }
        header.style.background = 'none'
      })
    }
  }
</script>

<style scoped lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    background: transparent;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-between;

    header {
      display: flex;
      padding: 6px 3rem;
      position: fixed;
      z-index: 999;
      top: 0;
      width: 100%;
      transition: all .3s;
      align-items: center;
      color: #fff;

      .logo {
        width: 4rem;
        height: 4rem;
        margin-right: 2rem;
      }

      span {
        font-size: 16px;
        font-weight: bold;
        margin: 0 2rem;
        white-space: nowrap;
        cursor: pointer;
      }

      .header-right {
        margin-left: auto;
        display: flex;
        align-items: center;

        .el-dropdown-link {
          display: flex;
          align-items: center;
          color: #ffffff;
        }
      }
    }

    .footer {
      width: 100%;
      height: 13vh;
      text-align: center;
      padding: 10px 0;
      background: rgba(0, 0, 0, .8);

      p {
        margin-bottom: 5px;
        color: #aaa;
        margin-top: 8px;
      }
    }
  }
  .header_title:hover{
    color: #333!important;
  }
  .header_title{
    color: #666!important;
  }
  .header_title2:hover{
    color: #4459AA!important;
  }
  .footerLock{
    overflow: hidden!important;
  }
</style>
