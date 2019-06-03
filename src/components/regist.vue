<template>
  <div class="regist">
    <header>
      <img src="../../static/img/register-person.jpg">
      <img src="../../static/img/forgetcon.png" class="centerImg">
    </header>
    <main>
      <div class="center" v-loading="loading" element-loading-background="rgba(0,0,0,0)">
        <div v-if="showregist">
          <div class="hang"><!--:data="formData"-->
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :limit="1"
              ref="upload"
              :multiple="false"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload">
              <div style="display: flex;align-items: center;justify-content:center;">
                <div style="border: 1px solid #ddd;border-radius: 100%;width: 50px;height: 50px">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                </div>
                <span>上传头像</span>
              </div>
            </el-upload>
          </div>
          <div class="hang" v-for="(i,s) in Data" :key="s">
            <span>{{i.key}}</span>
            <div class="rightInput">
              <el-select v-if="i.key=='性别'" v-model="i.value" size="small" :placeholder="i.placeholder" class="input">
                <el-option value='男' label="男"></el-option>
                <el-option value='女' label="女"></el-option>
              </el-select>
              <el-select v-else-if="i.key=='所属院系'" v-model="i.value" size="small" :placeholder="i.placeholder"
                         class="input">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div v-else-if="i.key=='验证码'">
                <el-input v-model="i.value" placeholder="请输入验证码" size="small"
                          style="width: 115px;margin-right: 5px"></el-input>
                <el-button size="small" style="width: 60px;" v-show="sendAuthCode" @click="getRandom">获取</el-button>
                <el-button size="small" style="width: 60px;margin: 0" v-show="!sendAuthCode"><span style="margin:0">{{auth_time}}</span> 秒</el-button>
              </div>
              <el-autocomplete v-else-if="i.key=='班级'" v-model="i.value" :placeholder="i.placeholder"
                               :fetch-suggestions="querySearch" size="small" clearable class="input"></el-autocomplete>
              <el-input v-else v-model="i.value" :placeholder="i.placeholder" v-focus="i.key=='学号'?true:null"
                        :autofocus="i.key=='学号'?true:null" size="small" clearable class="input"
                        :show-password="(i.key=='密码'||i.key=='确认密码')?true:null"></el-input>
            </div>
          </div>
          <div class="hang">
            <el-button type="success" style="width: 160px;margin-left: 60px;margin-top: 80px" @click="submit">注册
            </el-button>
          </div>
        </div>
        <div v-else style="display: flex;align-items: center;margin-bottom: 60px" class="loginBox">
          <div style="display:flex;align-items:center;margin-right: 20px;width: 50px;height: 50px;border-radius: 100%;" v-loading="loginPhoto" element-loading-spinner="el-icon-loading"  element-loading-background="rgba(255,255,255,0.9)">
              <img :src="headimg" v-loading="true" v-if="headimg"
                   style="border-radius: 100%;border:none;width: 100%;height:100%;">
          </div>
          <div style="display: flex;justify-content:space-between ;flex-direction: column">
            <div class="hang" style="margin-bottom:30px">
              <span>学号</span>
              <el-input size="small" v-model="userName" @blur="getHeadimg"	clearable v-focus="true" autofocus="autofocus"></el-input>
            </div>
            <div class="hang" style="margin-bottom: 0">
              <span>密码</span>
              <el-input size="small" v-model="password" show-password ></el-input>
            </div>
          </div>
          <span @click="login" style="margin-top: auto">
            <el-icon class="el-icon-right"></el-icon>
          </span>
        </div>
        <div style="position: absolute;right:30px;bottom:15px;cursor: pointer"
             @click="()=>{this.showregist=!this.showregist}">{{this.showregist?'立即登录':'立即注册'}}
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'

  export default {
    name: "regist",
    directives: {
      focus: {
        inserted: function (el, {value}) {
          if (value) {
            el.querySelector('input').focus()
          }
        }
      }
    },
    data() {
      return {
        userName: null,
        password: null,
        imageUrl: null,
        imgFile: null,
        loading: false,
        uploadUrl: '',
        showregist: false,
        passwordFocus:false,
        loginPhoto:false,
        sendAuthCode:true,/*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
        auth_time: 0, /*倒计时 计数器*/
        options: [
          {
            value: '信息与工程学院',
            label: '信息与工程学院'
          }, {
            value: '商学院',
            label: '商学院'
          }, {
            value: '设计与创意学院',
            label: '设计与创意学院'
          }, {
            value: '通识教育学院',
            label: '通识教育学院'
          }],
        Data: [
          {key: "学号", value: '', placeholder: 'B15060101', msg: '请输入学号', keyName: 'number'},
          {key: "姓名", value: '', placeholder: '姓名', msg: '请输入姓名', keyName: 'username'},
          {key: "性别", value: '', placeholder: '请选择性别', msg: '请选择性别', keyName: 'sex'},
          {key: "班级", value: '', placeholder: 'B150601', msg: '请输入班级', keyName: 'userclass'},
          {key: "所属院系", value: '', placeholder: '请选择院系', msg: '请选择院系', keyName: 'college'},
          {key: "密码", value: '', placeholder: '请输入密码', msg: '请输入密码', keyName: 'password'},
          {key: "确认密码", value: '', placeholder: '再次输入密码', msg: '请再次输入密码'},
          {key: "手机号码", value: '', placeholder: '请输入手机号', msg: '请输入手机号', keyName: 'phone'},
          {key: "验证码", value: '', placeholder: '请输入验证码', msg: '请输入验证码', keyName: 'random'},
          {key: "管理员识别码", value: '', placeholder: '注册为管理员', keyName: 'vip'},
        ],
        formData: {
          dd: 1
        }
      }
    },
    computed:{
      ...mapState('FirstData', {
        isLogin: state => state.Data.isLogin,
        headimg: state => state.Data.headimg,
      })
    },
    methods: {
      ...mapMutations('FirstData', [
        'save'
      ]),
      //上传头像前的钩子
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        const filename=file.name
        if(filename.includes(`,`)){
          this.$message('请正确命名文件名称！', 'error');
          return false
        }
        if (!isJPG) {
          this.$message('上传头像图片只能是 JPG/PNG 格式!', 'error');
          return false
        }
        if (!isLt2M) {
          this.$message('上传头像图片大小不能超过 2MB!', 'error');
          return false
        }
        this.imgFile = file
        //将文件转换为本地url路径 展示在页面上
        this.imageUrl = URL.createObjectURL(file);
        return false
      },

      //手动提交注册信息
      async submit() {
        const {Data,imgFile} = this
        if(imgFile==null||imgFile==''){
          this.$message('请上传头像', 'error');
          return
        }
        //遍历
        Data.map((i, s) => {
          const reg = /^[0-9]*$/  // 验证数字
          //验证每一个input是否为空
          if ((i.value == '' || i.value == '')&&i.keyName!='vip') {
            this.$message(i.msg, 'error');
            throw ''
          }
          //验证学号和班级
          if (i.key == '学号' || i.key == '班级') {
            const temp = i.value.substr(1)
            if ((i.key == '学号' && (i.value.length != 9 || i.value[0] != 'B' || !reg.test(temp))) || (i.key == '班级' && (i.value.length != 7 || i.value[0] != 'B' || !reg.test(temp)))) {
              this.$message(i.key == '学号' ? '请输入正确学号' : '请输入正确班级', 'error');
              throw ''
            }
          }
          //验证密码
          if (i.key == '密码' && i.value.length < 6) {
            this.$message('密码长度不能小于6位', 'error');
            throw ''
          }
          if (i.key == '确认密码' && (i.value != Data[5].value)) {
            this.$message('两次密码不一致', 'error');
            throw ''
          }
          if (i.keyName) {
            this.formData[i.keyName] = i.value
          }
        })
        this.$confirm('注册后不可更改基本信息（可更改密码）, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success',
          customClass:'bbbconfirm'
        }).then(async () => {
          try {
            let formData = new FormData();
            let that = this
            let data = encodeURIComponent(JSON.stringify(this.formData))
            formData.append('file', that.imgFile);
            console.log('当前图片文件是', this.imgFile, '表单数据是', data)
            this.loading = true
            this.$utils.sleep(450)
            //注册
            const res = await this.$api.post(`/user/regist?userRequest=${data}`, {
              json: formData,
              headers: {'Content-Type': 'multipart/form-data'}
            })//
            if (res.erro) {
              this.$message(res.message, 'error')
              return
            }
            this.$message('注册成功', 'success')
            this.$utils.sleep(500)
            this.showregist = false
            //const res= this.$refs.upload.$children[0].post(this.imgFile)
          } catch (e) {
            console.log(e)
          } finally {
            this.loading = false
          }
        })

      },

      //获取手机验证码
      async getRandom() {
        const {Data} = this
        const phone = Data[Data.length - 3].value
        //验证手机号
        let TEL_REGEXP = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
        if (phone == '') {
          this.$message('请输入手机号码', 'error');
          return
        }
        if (!TEL_REGEXP.test(phone)) {
          this.$message('请输入正确的手机号码', 'error');
          return
        }
        //发送请求
        await this.$api.get(`/sms/sendSms`, {query: {phone}})
        this.sendAuthCode = false;
        this.auth_time = 60;
        let auth_timetimer = setInterval(() => {
          this.auth_time--;
          if (this.auth_time <= 0) {
            this.sendAuthCode = true;
            clearInterval(auth_timetimer);
          }
        }, 1000)
      },

      //当学号输入后自动匹配班级
      async querySearch(queryString, cb) {
        let results = [{value: this.Data[0].value.substring(0, 7)}]
        await this.$utils.sleep(400)
        cb(results);
      },

      //登录
      async login() {
        const {userName, password} = this
        if (userName == '') {
          this.$message('学号不能为空', 'error');
          return
        }
        if (password == '') {
          this.$message('密码不能为空', 'error');
          return
        }

        try {
          this.loading = true
          //登录请求
          const login = await this.$api.post(`/user/login?number=${userName}&password=${password}`)
          console.log(login)
          const{uid,headimg,userclass,college,number,sex,username,power} = login
          await this.$utils.sleep(400)
          //登录失败
          if (login.erro) {
            this.$notify({
              title: login.message,
              message: '账号或密码错误',
              type: 'error'
            });
            this.password = ''
            //继续获焦
            this.passwordFocus='autofocus'
            return
          }
          //登录成功
          this.$notify({
            title: '登录成功',
            message: '欢迎登录',
            type: 'success'
          });
          //为以后userid验证
          sessionStorage.setItem('number', number)
          sessionStorage.setItem('headimg', headimg)
          this.save({uid,userName: username, isLogin: true,headimg,number,sex,college,power,userclass})

          //返回进入此页面的上一个页面
          if(this.$route.query.redirect == location.hostname){
            this.$router.go(-1)
          }else {
            this.$router.replace({name: 'index'})
          }
        } finally {
          this.loading = false
        }
      },

      //获取头像
     async getHeadimg(){
        const {userName} = this
        if(userName==''|| userName==null){
          return
        }
        try {
          this.loginPhoto=true
          await this.$utils.sleep(400)
          const {headimg} = await this.$api.get(`/user/getheadimg?number=${userName}`)
          if(headimg){
            this.save({headimg})
          }
        }catch (e) {}
        finally {
          this.loginPhoto=false
        }
      }
    },
    created() {
        if(this.isLogin){
          this.$router.go(-1)
        }
    },
    mounted(){
      this.save({footerLock: false})
    },
    destroyed() {
      this.save({footerLock: true})
    }
  }
</script>
<style lang="scss">
  .loginBox .el-input--small .el-input__inner {
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;

  }

  .el-icon-right {
    margin-left: 30px;
    cursor: pointer;
    font-size: 25px;
    color: #aaa;
    border-radius: 100%;
    border: 1px solid #aaa;
    margin-top: auto;
  }

  .el-icon-right:hover {
    color: #333;
    border-color: #333;
  }
  .loginBox{
    .el-icon-loading{
      margin-top: 30%;
    }
  }
</style>
<style scoped lang="scss">
  .regist {
    width: 100%;

    header {
      position: relative;
      width: 100%;
      height: 30rem;

      img {
        width: 100%;
        height: 100%;
      }

      .centerImg {
        width: 60rem;
        height: 10rem;
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }

    main {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      margin-bottom: 20px;

      .center {
        margin-top: -50px;
        position: relative;
        z-index: 130;
        border-radius: 8px;
        width: 60%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: #fff;
        padding: 40px;
        //margin-bottom: 60px;
        box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.1);

        .hang {
          //width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;

          .avatar {
            width: 100%;
            height: 100%;
            border-radius: 100%;
          }

          span {
            text-align: right;
            width: 76px;
            white-space: nowrap;
            margin-right: 20px;
          }

          .rightInput {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .input {
            width: 180px;
          }
        }

      }
    }
  }
</style>
