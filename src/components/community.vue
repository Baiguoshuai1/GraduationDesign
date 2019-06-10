<template>
  <div class="communityPage">
    <!--左侧tab-->
    <div class="leftSlider">
      <div class="hang" @click="requestData('base')">
        <el-badge :is-dot="isDot" class="item">
          <el-icon class="el-icon-bell"></el-icon>
        </el-badge>
        <span>公告</span>
      </div>
      <div class="hang" @click="requestData('all')">
        <el-badge :is-dot="false" class="item">
          <el-icon class="el-icon-s-promotion"></el-icon>
        </el-badge>
        <span>全部动态</span>
      </div>
      <div class="hang" @click="requestData('me')">
        <el-badge :is-dot="false" class="item">
          <el-icon class="el-icon-lollipop"></el-icon>
        </el-badge>
        <span>与我相关</span>
      </div>
      <div class="hang">
        <el-badge :is-dot="false" class="item">
          <el-icon class="el-icon-monitor"></el-icon>
        </el-badge>
        <a href="http://jsj.bxait.cn/index.php?m=content&c=index&a=lists&catid=36" target="_blank">北信课堂</a>
      </div>
      <div class="hang" @click="()=>$router.push({name:'sourcepage'})">
        <el-badge :is-dot="false" class="item">
          <el-icon class="el-icon-link"></el-icon>
        </el-badge>
        <span>共享资源</span>
      </div>
    </div>
    <!--中间内容-->
    <div class="rightContent">
      <div class="content">
        <!--中间头部-->
        <div class="content_header">
          <!--发表-->
          <div style="display: flex;flex-direction: column;flex: 60%;position: relative">
            <!--标题-->
            <el-input
              class="title"
              resize="none"
              clearable
              prefix-icon="el-icon-edit"
              maxlength="10"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 1}"
              placeholder="我是标题"
              v-model="title"
              autofocus
              show-word-limit
              v-focus="true"
            >
            </el-input>
            <!--发表内容-->
            <el-input
              class="textarea"
              resize="none"
              clearable
              prefix-icon="el-icon-edit"
              maxlength="220"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 3}"
              placeholder="说点什么吧"
              v-model="textarea"
              show-word-limit
            >
            </el-input>
            <div style="position: absolute;right: 10px;bottom: 47px;cursor:pointer;color: #888;font-size: 16px">
              <input id='file' type="file" name="fileupload" style="display: none"></input>
              <label for="file" style="cursor:pointer;">
                <el-icon class="el-icon-picture-outline" ></el-icon>
              </label>
            </div>
          </div>
          <!--发表按钮-->
          <div style="display:flex;align-items: center;justify-content: space-between;flex: 1">
            <el-button type="" plain class="btn" size="mini" @click="submitTxt('帖子')" :loading="subtxtloading">发表</el-button>
            <el-button type="" plain class="btn" size="mini" @click="submitTxt('公告')" :loading="subtxtloading2">发公告</el-button>
          </div>
        </div>
        <!--刷新按钮-->
        <div class="refreshBox" @click="refresh" v-if="listContent.length>0">
          <el-icon class="el-icon-refresh-left"></el-icon>
        </div>
        <!--动态内容-->
        <div v-loading="contentLoading"
             style=" width: 100%;height:100%;overflow: auto;margin-top: 20px;position: relative"
             element-loading-background="rgba(0,0,0,.1)">

          <!--单个帖子无内容时-->
          <div class="article_content" v-if="listContent.length==0&&showType!='base'&&showType!='one'"
               style="padding-top: 100px">
            暂无内容
          </div>
          <!--全部帖子-->
          <div class="article_content" v-else-if="showType=='all'"
               ref="contentBox">
            <!--帖子列表-->
            <div class="article_list" v-for="(i,s) in listContent" >
              <div class="list_content" @click="requestData('one',i.aid)">
                <!--标题-->
                <span class="list_title" >{{i.title}}</span>
                <!--<span class='list_content_txt'>{{i.content}}</span>-->
                <img v-if="i.pictureUrl" :src="i.pictureUrl" class="list_content_img"/>
              </div>
              <!--底部发布者个人信息-->
              <div class="list_bottom">
                <img :src="i.author.headimg">
                <span class="">{{i.author.username}}</span>
                <el-icon class="el-icon-male list_author" v-if="i.author.sex=='男'" style="color:#888;"></el-icon>
                <el-icon class="el-icon-female list_author" v-else-if="i.author.sex=='女'" style="color: pink"></el-icon>
                <span class="list_author">{{i.author.college}}</span>
                <span class="list_date">{{$utils.formatDateTime(new Date(i.date))}}</span>
                <span class="list_date interactive" style="margin-left: 20px;cursor: pointer"
                      @click="requestData('one',i.aid)"><el-icon class="el-icon-chat-round"></el-icon> {{i.countArti}}</span>
                <span class="list_date interactive" style="margin-left: 12px;position:relative;top: 1px"
                      @click="thumbsup(i.aid)"><el-icon class="el-icon-lollipop"></el-icon> {{i.thumbsup==0?null:i.thumbsup}}</span>
              </div>
            </div>
          </div>

          <!--点开单个帖子-->
          <div class="article_content one" v-else-if="showType=='one'">

            <div style="width:100%">
              <!--标题-->
              <div class="one_title">
                {{oneData.title}}
              </div>
              <!--顶部个人信息-->
              <div class="list_bottom">
                <img :src="oneData.author.headimg">
                <span class="list_author">{{oneData.author.username}}</span>
                <el-icon class="el-icon-male list_author" v-if="oneData.author.sex=='男'" style="color:#888;"></el-icon>
                <el-icon class="el-icon-female list_author" v-else-if="oneData.author.sex=='女'" style="color: pink"></el-icon>
                <span class="list_author">{{oneData.author.college}}</span>
                <span class="list_date">{{$utils.formatDateTime(new Date(oneData.date))}}</span>
                <span class="list_date interactive" style="margin-left: auto;font-size: 14px;cursor: pointer" @click=""><el-icon
                  class="el-icon-chat-round"></el-icon> {{oneData.countArti}}</span>
                <span class="list_date interactive" style="margin-left: 12px;font-size:14px;position:relative;top: 1px"
                      @click="thumbsup(oneData.aid)"><el-icon class="el-icon-lollipop"></el-icon> {{oneData.thumbsup==0?null:oneData.thumbsup}}</span>
                <span class="interactive" style="margin-left: 15px;" @click="deleteArticle(oneData.aid)"><el-icon class="el-icon-delete"></el-icon></span>
              </div>
              <!--发布内容详情-->
              <div class="one_content">
                <span>
                   {{oneData.content}}
                </span>
                <div v-if="oneData.pictureUrl" style="margin-top: 20px">
                  <img :src="oneData.pictureUrl" style="width: 300px;height: 200px;border-radius: 5px">
                </div>
              </div>
              <!--评论输入-->
              <div class="openComm">
                <el-input
                  class="textarea"
                  resize="none"
                  clearable
                  prefix-icon="el-icon-edit"
                  maxlength="220"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 3}"
                  placeholder="夸他帅"
                  v-model="commTxt"
                  autofocus
                  show-word-limit
                >
                </el-input>
                <el-button type="info" @click="openComm" size="mini" style="margin-left: auto;margin-top: 5px">评论
                </el-button>
              </div>
            </div>

            <!--评论区-->
            <div class="one_commBox" v-for="(i,s) in CommentList">
              <el-divider content-position="left">回帖</el-divider>
              <span style="padding: 10px 0">{{i.content}}</span>
              <!--评论者信息-->
              <div class="list_bottom">
                <img :src="i.replyer.headimg">
                <span class="list_author">{{i.replyer.username}}</span>
                <el-icon class="el-icon-male list_author" v-if="i.replyer.sex=='男'" style="color:#888;"></el-icon>
                <el-icon class="el-icon-female list_author" v-else-if="i.replyer.sex=='女'" style="color: pink"></el-icon>
                <span class="list_author">{{i.replyer.college}}</span>
                <span class="list_date">{{$utils.formatDateTime(new Date(i.date))}}</span>
                <span class="list_date interactive" style="margin-left: 15px;font-size: 10px;cursor: pointer"
                      @click="openFid(i.aid,i.cid,i.replyer.uid)"><el-icon
                  class="el-icon-chat-round"></el-icon> {{i.countcomm}}</span>
                <span class="list_date interactive" style="margin-left: 12px;font-size:10px;position:relative;top: 1px"
                      @click="thumbsup('',i.cid)"><el-icon class="el-icon-lollipop"></el-icon> {{i.thumbsup==0?null:i.thumbsup}}</span>
              </div>
              <!--楼中楼评论详情-->
              <div v-for="(ii,s) in FloorData" v-if="ii.cid==i.cid">
                <!--分割线-->
                <el-divider content-position="left" style="width: 200px">
                  <el-icon class="el-icon-caret-top"></el-icon>
                  {{ii.floorReplyera.username}} 回复 {{i.replyer.username}}
                </el-divider>
                <!--内容-->
                <span style="padding: 10px 0">{{ii.content}}</span>
                <!--楼中楼评论者信息-->
                <div class="list_bottom">
                  <img :src="ii.floorReplyera.headimg">
                  <span class="list_author">{{ii.floorReplyera.username}}</span>
                  <el-icon class="el-icon-male list_author" v-if="ii.floorReplyera.sex=='男'" style="color:#888;"></el-icon>
                  <el-icon class="el-icon-female list_author" v-else-if="ii.floorReplyera.sex=='女'" style="color: pink"></el-icon>
                  <span class="list_author">{{ii.floorReplyera.college}}</span>
                  <span class="list_date">{{$utils.formatDateTime(new Date(ii.date))}}</span>
                  <!--<span class="list_date interactive" style="margin-left: 15px;font-size: 10px;cursor: pointer"-->
                  <!--@click="openFid"><el-icon class="el-icon-chat-round"></el-icon> 1</span>-->
                  <span class="list_date interactive"
                        style="margin-left: 12px;font-size:10px;position:relative;top: 1px"
                        @click="thumbsup('','',ii.fid)"><el-icon class="el-icon-lollipop"></el-icon> {{ii.thumbsup==0?null:ii.thumbsup}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--右侧新闻列表-->
    <div class="newContent">

      <!--官网通道 -->
      <div class="new1Box">
        <div class="new_header">本周通道</div>
        <div class="new_content">
          <a class="" href="http://www.bxait.cn" target="_blank">西安工业大学北方信息工程学院官网</a>
          <a href="http://aao.bxait.cn/education" target="_blank">西安工业大学北方信息工程成绩系统</a>
          <a href="http://kch.bxait.cn" target="_blank">鹿苑学堂</a>
          <a href="https://mp.weixin.qq.com" target="_blank">打卡小程序</a>
        </div>
      </div>

      <!--小程序码通道-->
      <div class="new1Box new2box">
        <div class="new_header">离校打卡小程序</div>
        <div class="new_content">
          <img src="../../static/img/appletCode.jpg"/>
          <a class="code_detail" target="_blank" href="https://mp.weixin.qq.com/cgi-bin/wx?token=&lang=zh_CN">详情
            <el-icon class="el-icon-paperclip"></el-icon>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapMutations, mapState} from 'vuex'
  let file=null
  export default {
    name: "community",
    data() {
      return {
        title: "",
        textarea: '',//输入框内容
        listContent: [],//列表动态数据
        subtxtloading: false,//发表loading
        subtxtloading2: false,//发表公告loading
        contentLoading: false,//内容加载loading
        type: '',    //当前请求类型
        showType: 'all',//展示类型
        CommentList: [],//单个数据的评论
        FloorData: [],//单个数据的楼中楼信息
        oneData: {},//单个数据
        aid: '',//点开的帖子aid,
        commTxt: '',//评论内容,
        contentImgFile:null
      }
    },
    watch: {
      path: {
        //监听访问路径 改变请求
        handler: async function (val, old) {
          //判断登录
          if ((this.uid == '' || !this.isLogin) && this.path.includes('uid')) {
            this.$message('请先登录', 'warning') //发表前登录
            this.path = '/article/list?currentPage=1' //
            return
          }
          this.contentLoading = true
          await this.$utils.sleep(400)
          this.requestData()
        },
        deep: true
      }
    },
    directives: {
      //自动获取焦点
      focus: {
        inserted: function (el, {value}) {
          if (value) {
            el.querySelector('textarea').focus()
          }
        }
      }
    },
    computed: {
      //获取FirstData数据仓库
      ...mapState('FirstData', {
        isLogin: state => state.Data.isLogin,//是否登录
        uid: state => state.Data.uid,//作者唯一id
        number: state => state.Data.number,//学号
        isDot:state => state.Data.isDot,//是否点击查看了公告
        power:state => state.Data.power,//是否管理员

      })
    },
    methods: {
      ...mapMutations('FirstData', [
        'save'
      ]),
      //刷新
      async refresh() {
        //回到顶部
        return new Promise(async (resolve, reject) => {
          const dom = this.$refs.contentBox
          console.log(dom)
          if (dom !== undefined) {
            dom.style.overflow = 'hidden'
            await new Promise((resolve, reject) => {
              var scrollToptimer = setInterval(() => {
                let top = dom.scrollTop
                const speed = top / 80;
                if (top != 0) {
                  this.$refs.contentBox.scrollTop -= speed;
                } else {
                  resolve()
                  clearInterval(scrollToptimer);
                }
              })
            }, 30)
          }
          //防止触摸穿透
          this.contentLoading = true
          await this.$utils.sleep(400)
          this.requestData(this.type, this.aid)
          if (dom) {
            this.$refs.contentBox.style.overflow = 'auto'
          }
          resolve()
        })
      },
      //请求数据
      async requestData(type, aid, first) {
        this.contentLoading = true
        this.type = type
        try {
          if (!first) {
            await this.$utils.sleep(200)
          }
          //请求全部数据
          if (type == 'all') {
            const {topArticle, articlePageBean} = await this.$api.get(`/article/list?lable=帖子`)
            this.listContent = articlePageBean.list
            this.showType = 'all'

          } else if (type == 'me') {
            //请求自己相关数据
            const {userArticle} = await this.$api.get(`/user/manager?uid=${this.uid}`)
            this.listContent = userArticle
            this.showType = 'all'

          } else if (type == 'base') {
            //关闭红点提示
            this.save({isDot:false})
            const {topArticle, articlePageBean} = await this.$api.get(`/article/list?lable=公告`)
            this.listContent = articlePageBean.list
            this.showType = 'all'

          } else if (type == 'one') {
            this.aid = aid
            const res = await this.$api.get(`/article/details?aid=${aid}`)
            this.oneData = res.Article//单个数据的信息
            this.CommentList = res.CommentList//单个数据的评论信息
            this.FloorData = res.Floor//单个数据的楼中楼评论信息
            console.log(this.CommentList)
            this.showType = 'one'
          }

        } finally {
          this.contentLoading = false
        }
      },
      //发表内容
      async submitTxt(Announcement) {
        const {uid, title, textarea, isLogin} = this
        if (uid == '' || !isLogin) {
          this.$message('请先登录', 'warning')
          return
        }
        if (textarea.length == 0) {
          this.$message('信息不能为空', 'error')
          return
        }
        //是否是标签
        var pattern = /<\/?[a-zA-Z]+(\s+[a-zA-Z]+=".*")*>/g;
        const isHtml = textarea.match(pattern)
        if (isHtml) {
          this.$message('小样，还想输脚本？', 'error')
          this.textarea = ''
          return
        }
        try {
          if(Announcement=='公告'){
            this.subtxtloading2 = true
          }else {
            this.subtxtloading = true
          }
          // let imgFile=this.contentImgFile
          // console.log(this,imgFile)
          let formData = new FormData();
          formData.append('file', file);
          //请求发表帖子接口
          const res = await this.$api.post(`/article/add?title=${title}&content=${textarea}&uid=${uid}&lable=${Announcement}`,{json: formData,headers:{'Content-Type': 'multipart/form-data'}})
          await this.$utils.sleep(400)
          //成功
          if (res.data && res.data.includes('成功')) {
            this.$message('发表成功', 'success')
            this.textarea = ''
            this.title = ''
            this.requestData(this.type, '', true)
          } else {
            this.$message(res.message, 'error')
          }
        } finally {
          this.subtxtloading = false
          this.subtxtloading2 = false
        }

      },
      //点赞
      async thumbsup(aid = null, cid = null, fid = null) {
        const {uid, isLogin} = this
        if (uid == '' || !isLogin) {
          this.$message('请先登录', 'warning')
          return
        }
        let params = {
          aid: aid,
          cid: cid,
          fid: fid,
          number: this.number
        }
        const res = await this.$api.post(`/article/thumbsup`, {json: params})
        if (res == '点赞成功') {
          this.requestData(this.type, this.aid, true)
        }
      },
      //删帖
      async deleteArticle(aid){
        if(this.power==0){
          this.$message('管理员才可以删帖哦,好不容易有了数据','error')
          return
        }
        const res=await this.$api.post(`/article/delete?aid=${aid}`)
        if(res.data.includes(`成功`)){
          this.$message('删除成功','success')
          //返回
          this.requestData('all')
        }else{
          this.$message('删除失败','error')
        }
      },
      //评论
      async openComm(aid) {
        const {uid, isLogin} = this
        if (uid == '' || !isLogin) {
          this.$message('请先登录', 'warning')
          return
        }
        if (this.commTxt == '') {
          this.$message('输入不能为空', 'error')
          return
        }
        const res = await this.$api.post(`/article/addcomment?content=${this.commTxt}&aid=${this.oneData.aid}&uid=${this.uid}`)
        if (res.data.includes(`成功`)) {
          await this.refresh()
          this.$message('评论成功', 'success')
          this.commTxt = ''
        } else {
          this.$message('评论失败', 'error')
        }
      },
      //楼中楼评论
      openFid(aid, cid, uidb) {
        this.$prompt('回复', {
          dangerouslyUseHTMLString: true,
          showInput: true,
          inputType: 'textarea',
          inputPlaceholder: '怼他',
          showClose: false,
          showCancelButton: false,
          confirmButtonText: '发送'
        }).then(async ({value}) => {
          const {uid, isLogin} = this
          if (uid == '' || !isLogin) {
            this.$message('请先登录', 'warning')
            return
          }
          if (!value || !value.length > 0) {
            this.$message('输入不能为空', 'error')
            return
          }
          const res = await this.$api.post(`/article/floor/add?aid=${aid}&cid=${cid}&content=${value}&uida=${this.uid}&uidb=${uidb}`)
          if (res.data.includes('成功')) {
            await this.refresh()
            this.$message('回复成功', 'success')
          } else {
            this.$message('回复失败', 'error')
          }
        }).catch(() => {
        });
      }

    },
    //请求数据
    async created() {
      this.requestData('all', '', true)
    },
    mounted() {
      //改变标题栏颜色
      this.save({comm: true})
      var uploadinput=document.getElementById("file");
      uploadinput.addEventListener("change",function (e) {
        console.log(e.target.files)
        this.contentImgFile=e.target.files[0]
        file=e.target.files[0]
      });
    },
    //组建销毁 改变标题栏颜色
    destroyed() {
      this.save({comm: false})
    }
  }
</script>

<style scoped lang="scss">
  .communityPage {
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
    background-image: url("../../static/img/shanshui.jpg");
    background-size: 100%;

    .leftSlider {
      background-color: #fff;
      box-shadow: 1px 1px 12px rgba(0, 0, 0, .1);
      padding: 15px;
      padding-top: 40px;
      width: 15rem;
      height: 25rem;
      border-radius: 6px;
      margin-top: 90px;
      margin-left: auto;

      .hang {
        margin-bottom: 30px;
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        span, a {
          margin-left: 4px;
        }
      }

      a:hover {
        color: #4459AA;
      }

      .hang:hover {
        color: #4459AA;
      }
    }

    .rightContent {
      display: flex;
      width: 50%;
      margin-top: 90px;
      justify-content: space-between;
      margin-left: 5rem;

      .content {
        display: flex;
        width: 100%;
        flex-direction: column;
        position: relative;
        align-items: flex-start;

        .refreshBox {
          position: absolute;
          right: 20px;
          top: 140px;
          z-index: 100;
          font-size: 18px;
          cursor: pointer;

          .el-icon-refresh-left:hover {
            color: #4459AA;
          }
        }

        .content_header {
          display: flex;
          width: 100%;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: flex-end;

          .btn {
            margin-left: 10px;
          }
        }

        .article_content {
          display: flex;
          width: 100%;
          height: 100%;
          flex-direction: column;
          background-color: #fff;
          padding: 15px 20px;
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          overflow: auto;

          .article_list {
            background: #fff;
            padding: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;

            .list_content {
              width: 100%;
              display: flex;
              flex-direction: column;
              text-align: left;
              min-height: 30px;
              padding-bottom: 16px;
              cursor: pointer;

              .list_title {
                font-size: 15px;
                font-weight: 400;
                padding-bottom: 30px;
                cursor: pointer;
              }

              .list_content_txt {
                font-size: 14px;
                color: #333;
              }

              .list_content_img {
                width: 300px;
                height: 200px;
                border-radius: 5px;
                // box-shadow: 1px 1px 8px rgba(0,0,0,.1);
              }
            }

            .list_bottom {
              width: 100%;
              display: flex;
              justify-content: flex-end;
              align-items: center;

              img {
                width: 16px;
                height: 16px;
                border-radius: 100%;
                margin-right: 5px;
                // margin-left: auto;
              }

              span {
                color: #888;
                font-size: 10px;
              }

              .list_author {
                margin-right: 6px;
              }

              .interactive:hover {
                color: #4459AA;
                cursor: pointer;
                // font-weight: bold;
              }
            }
          }
        }

        .one {
          display: flex;
          text-align: left;
          padding: 30px;

          .openComm {
            display: flex;
            margin-top: 5px;
            flex-direction: column;
            align-items: flex-end;
          }

          .one_title {
            font-size: 18px;
            font-weight: bold;

          }

          .list_bottom {
            margin-top: 10px;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-right: 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;

            img {
              width: 30px;
              height: 30px;
              border-radius: 8px;
              margin-right: 10px;
              // margin-left: auto;
            }

            span {
              color: #888;
              font-size: 14px;
            }

            .list_author {
              margin-right: 6px;
            }

            .interactive:hover {
              color: #4459AA;
              cursor: pointer;
              // font-weight: bold;
            }
          }

          .one_content {
            padding: 30px 0;
            font-size: 14px;
            letter-spacing: 1px;
            line-height: 2;
            text-indent: 30px;
          }

          .one_commBox {
           // display: flex;
            flex-direction: column;

            .list_bottom {
              margin-top: 0px;
              width: 100%;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              border-bottom: 0;

              img {
                width: 16px;
                height: 16px;
                border-radius: 100%;
                margin-right: 5px;
                // margin-left: auto;
              }

              span {
                color: #888;
                font-size: 10px;
              }

              .list_author {
                margin-right: 6px;
              }

              .interactive:hover {
                color: #4459AA;
                cursor: pointer;
                // font-weight: bold;
              }
            }
          }
        }
      }

      .title {
        width: 40%;
        margin-bottom: 4px;
      }

      .textarea {
        width: 100%;
      }
    }

    .newContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: auto;
      margin-top: 90px;
      margin-right: 60px;

      .new1Box {
        display: flex;
        width: 280px;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        color: #333;
        background-color: rgba(255, 255, 255, 1);
        padding: 20px 30px;
        border-radius: 6px;
        margin-bottom: 40px;

        .new_header {
          font-size: 16px;
          font-weight: 400;
          width: 100%;
          margin-bottom: 8px;
          padding-bottom: 2px;
          border-bottom: 1px solid #cccccc;
        }

        .new_content {
          width: 100%;
          display: flex;
          flex-direction: column;

          a {
            margin-bottom: 8px;
            cursor: pointer;
          }

          a:hover {
            color: #4459AA;
          }

          img {
            width: 80px;
            height: 80px;
            background: transparent;
            //margin-left: auto;
          }
        }
      }

      .new2box {
        background-color: #fff;

        .new_content {
          flex-direction: row;
          // justify-content: center;
          padding: 15px 0;

          .code_detail {
            margin-top: auto;
            margin-left: 10px;
          }

        }
      }
    }
    .el-icon-picture-outline:hover{
      color: #4459aa!important;
    }
  }
</style>
<style>
  .el-textarea__inner {
    border: 1px solid #DCDFE6 !important;
  }
</style>
