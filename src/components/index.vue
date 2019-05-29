<template>
  <div class="all">
    <main>
      <img src="../../static/img/classinOnline.png" class="centerImg" style="animation: fadeIndown 1s"/>
      <p class="centerP">专业 · 创新 · 开放</p>
      <div class="indexBtn" @click="goLogin">立即加入</div>
      <div class="swiper-container swiperContainer">
        <div class="swiper-wrapper swiperWrapper">
          <div class="swiper-slide swiperWrapper" v-for="(s,i) in bannerList">
            <img :src="s"/>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'index',
    data() {
      return {
        bannerList: ['./static/img/swiper1.jpg', './static/img/swiper2.jpg', './static/img/swiper3.jpg']
      }
    },
    computed:{
      ...mapState('FirstData', {
        isLogin: state => state.Data.isLogin
      })
    },
    methods: {
      //首页轮播图
      _initSwiper() {
        let his = this
        //初始化
        his.myswiper = new this.Swiper('.swiperContainer', {
          autoplay: {
            disableOnInteraction: false,
            delay: 2500,
          },
          effect: 'fade',//渐入渐出
          speed: 1000,//速度
          autoHeight: true,//自动适应高度
          loop: true,//循环
          observer: true,
          observeParents: true,
          //监听事件
          on: {
            transitionStart: function () {
            }
          },
        })
      },
      //进入社区 //判断
      goLogin(){
        if(this.isLogin){
          this.$router.push({name:"community"})
        }
        else{
          this.$router.push({name:"regist"})
        }
      }
    },
    async created() {

    },
    //初始化轮播图
    mounted() {
      this._initSwiper()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .all {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
    height: 100%;

    header {
      display: flex;
      padding: 10px 2rem;
      position: absolute;
      z-index: 10;
      top: 0;
      width: 100%;
      align-items: center;
      color: #fff;

      .logo {
        width: 8rem;
        height: 4rem;
        margin-right: 2rem;
      }

      span {
        font-size: 16px;
        font-weight: bold;
        margin: 0 2rem;
        cursor: pointer;
      }

      .header-right {
        margin-left: auto;
      }
    }

    main {
      position: relative;

      .centerImg {
        opacity: 1;
        position: absolute;
        z-index: 10;
        top: 20rem;
        width: 45rem;
        left: 50%;
        transform: translateX(-50%);
      }

      .centerP {
        position: absolute;
        font-size: 30px;
        z-index: 10;
        left: 50%;
        color: #fff;
        transform: translateX(-50%);
        top: 28rem;
      }

      .indexBtn {
        position: absolute;
        cursor: pointer;
        background: rgba(0,0,0,.2);
        padding: 10px 15px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        z-index: 10;
        left: 50%;
        color: #fff;
        transform: translateX(-50%);
        top: 35rem;
      }

      .swiperWrapper {
        width: 100%;
        height: 100vh;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
<style>
  @keyframes fadeIndown {
    0% {
      opacity: 0;
      transform: translateY(-100%) translateX(-50%);;
    }
    100% {
      opacity: 1;
      transform: translateY(0) translateX(-50%);
    }
  }
</style>
