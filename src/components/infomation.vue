<template>
  <div class="information">
    <div class="bgBox">
      <img src="../../static/img/002.jpg" class="bgIMg"/>
    </div>
    <div class="content" v-loading="loading" element-loading-background="rgba(0,0,0,0.1)">
      <div class="imgbox">
        <el-upload
          class="avatar-uploader"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarFail"
          :action="'http://47.103.9.9:18023/user/headimg?uid='+uid"
          :limit="1"
          ref="upload"
          :multiple="false"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload">
          <div style="display: flex;align-items: center;justify-content:center;" class="dd">
            <div style="border: 1px solid #ddd;border-radius: 100%;width: 45px;height: 45px;margin-right: 10px;" v-loading="photoLoading" element-loading-spinner="el-icon-loading"  element-loading-background="rgba(255,255,255,0)">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
            </div>
            <span class="des">更换头像</span>
          </div>
        </el-upload>
      </div>
      <el-form ref="form" :model="form">
        <el-form-item v-for="(i,s) in form" :label="i.label" :prop="i.label" :key="s"
                      style="display: flex;justify-content: left;margin-left:50%;transform:translateX(-30%);white-space:nowrap"
                      label-width="70px">
          <el-input size="small" v-model="i.value" style="width: 150px" :show-password="i.label.includes('密码')?true:null"
                    :disabled="(i.label=='手机号'||i.label.includes('码'))?false:true"></el-input>
          <el-button size="small" v-if="i.label=='验证码'" v-show="sendAuthCode" @click="getRandom">获取验证码</el-button>
          <el-button size="small" v-if="i.label=='验证码'" v-show="!sendAuthCode">
            <span class="auth_text_blue">{{auth_time}}</span> 秒后重新发送
          </el-button>
        </el-form-item>
      </el-form>
      <el-button @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'

  export default {
    name: "infomation",
    data() {
      return {
        url: '',
        imageUrl:'',
        loading: false,
        photoLoading:false,
        sendAuthCode: true,/*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
        auth_time: 0, /*倒计时 计数器*/
        form: {
          number: {label: '学号', value: '', remind: ''},
          username: {label: '姓名', value: '', remind: ''},
          college: {label: '学院', value: '', remind: ''},
          sex: {label: '性别', value: '', remind: ''},
          userclass: {label: '班级', value: '', remind: ''},
          phone: {label: '手机号', value: '', remind: '手机号不能为空'},
          random: {label: '验证码', value: '', remind: '请输入验证码'},
          oldpassword: {label: '当前密码', value: '', remind: '请输入当前密码'},
          newpassword: {label: '新密码', value: '', remind: '请输入新密码'},
          newpassword2: {label: '确认密码', value: '', remind: '请再次输入密码'},

        }
      }
    },
    computed: {
      ...mapState('FirstData', {
        isLogin:state=>state.Data.isLogin,
        uid: state => state.Data.uid,
        number: state => state.Data.number,
        headimg: state => state.Data.headimg
      })
    },
    methods: {
      ...mapMutations('FirstData', [
        'save'
      ]),
      //上传头像前的钩子
      beforeAvatarUpload(file) {
        if(!this.isLogin) {
          //重新登录
          this.$message('登录超时', 'warning')
          this.save({isLogin:false})
          this.$router.push({name:'regist', query: { redirect: location.hostname }})
          return false;
        }
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        const isSpecil=file.name.includes(`,`)
        //判断文件名称
        if (isSpecil) {
          this.$message('请正确命名文件名称！', 'error');
          return false
        }
        //判断文件类型
        if (!isJPG) {
          this.$message('上传头像图片只能是 JPG/PNG 格式!', 'error');
          return false
        }
        //判断大小
        if (!isLt2M) {
          this.$message('上传头像图片大小不能超过 2MB!', 'error');
          return false
        }
        //将文件转换为本地url路径 展示在页面上
        this.imageUrl = URL.createObjectURL(file);
         this.photoLoading = true
      },
      //上传成功回调函数
      async handleAvatarSuccess(e,file){
        await this.$utils.sleep(550)
        this.$message('上传成功','success')
        //清空
        this.$refs.upload.clearFiles()
        let number = sessionStorage.getItem('number')
        if (number) {
          const {uid,username,userclass,headimg,sex,college,phone} = await this.$api.post(`/user/getuser?number=${number}`)
          this.save({uid,userName: username, isLogin: true,headimg,number,sex,college,userclass,phone})
          sessionStorage.setItem('headimg',headimg)
        }

        this.photoLoading = false

      },
      //上传失败回调函数
      async handleAvatarFail(){
        await this.$utils.sleep(550)
        this.$refs.upload.clearFiles()
        this.$message('上传失败','error')
        this.photoLoading = false
      },
      //获取手机验证码
      async getRandom() {
        const {value: phone} = this.form.phone
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
      //提交信息
      async submit() {
        if(!this.isLogin) {
          //重新登录
          this.$message('登录超时', 'warning')
          this.save({isLogin:false})
          this.$router.push({name:'regist', query: { redirect: location.hostname }})
          return false;
        }
        const {uid, form} = this
        for (let key in form) {
          if (form[key].value == '') {
            this.$message(form[key].remind, 'error')
            return
          }
          if (form[key].label == '手机号') {
            //验证手机号
            let TEL_REGEXP = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
            if (!TEL_REGEXP.test(form[key].value)) {
              this.$message('请输入正确的手机号码', 'error');
              return
            }
          }
          //验证密码
          if (form[key].label == '新密码' && form[key].value.length < 6) {
            this.$message('密码长度不能小于6位', 'error');
            return
          }
          if (form[key].label == '确认密码' && (form[key].value != form.newpassword.value)) {
            this.$message('两次密码不一致', 'error');
            return
          }
        }
        try {
          this.loading = true
          await this.$utils.sleep(450)
          //请求参数
          const params = {
            newpassword: form.newpassword.value,
            number: form.number.value,
            oldpassword: form.oldpassword.value,
            phone: form.phone.value,
            random: form.random.value
          }
          //更新密码
          const promise2 = await this.$api.post(`/user/updatepassword`, {
            json: params
          })

          if (promise2.erro) {
            this.$message('修改失败', 'error')
            this.loading = false
            return
          }
          this.$message('修改成功', 'success')
          this.loading = false
          await this.$utils.sleep(1000)
          //重新登录
          this.$message('登录超时', 'warning')
          this.save({isLogin:false})
          sessionStorage.removeItem('number')
          this.$router.push({name:'regist'})
        } catch (e) {
          console.log(e)
        } finally {

        }
      }
    },
    async created() {
      //获取头像
      let headimg=sessionStorage.getItem('headimg')
      if(headimg){
        this.imageUrl=headimg
      }else {
        this.imageUrl=this.headimg
      }
      let number = sessionStorage.getItem('number')
      const {form} = this
      //重新获取信息
      const info = await this.$api.post(`/user/getuser?number=${number}`)
      for (let key in form) {
        if (info[key]) {
          form[key].value = info[key]
        }
      }
    },

  }
</script>
<style lang="scss">
  .dd{
    .el-icon-loading{
      margin-top: 30%;
    }
  }

</style>
<style scoped lang="scss">

  .information {
    position: relative;
    height: 85vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .bgBox {
      width: 100%;
      height: 100%;
    }

    .bgIMg {
      width: 100%;
      height: 100%;
    }

    .content {
      background: rgba(255, 255, 255, .96);
      width: 60%;
      padding: 20px;
      color: #fff;
      margin-top: 80px;
      border-radius: 8px;
      position: absolute;
      top: 0;

      .avatar {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }

      .des {
        color: #666;
      }

      .imgbox {
        width: 100%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 12px;
      }
    }

  }
</style>
