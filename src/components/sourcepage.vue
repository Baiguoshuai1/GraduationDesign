<template>
    <div class="sourcepage">
      <div style="">
        <el-container>
          <el-header>《数学建模》课程互动平台教学共享资源目录</el-header>
          <el-main>
            <div style="display: flex;justify-content: space-between;width: 100%;margin-bottom: 10px;color: #999;padding-left: 10px;font-size: 17px">
              <span><el-icon class="el-icon-notebook-2"></el-icon></span>
              <div>
                <span style="width: 110px;display: inline-block;text-align: center;"><el-icon class="el-icon-time"></el-icon></span>
                <span style="display:inline-block;padding:0;width: 70px;text-align: center"><el-icon class="el-icon-user"></el-icon></span>
              </div>
            </div>
           <div class="hang">
              <el-link type="info" href="http://bbb-36256.oss-cn-hangzhou.aliyuncs.com/AngularJS%E5%8F%82%E8%80%83%E6%89%8B%E5%86%8C%20%E4%B8%AD%E6%96%87CHM%E7%89%88.rar">《Angular JS 参考手册》</el-link>
              <div class="rightBox">
                <span class="uploadtime" style="display: inline-block;width: 100px;white-space: nowrap;text-align: left">5月12日 21:30</span>
                <span class="username" style="display:inline-block;width: 70px;text-align:center;white-space: nowrap">白国帅</span>
              </div>
            </div>
            <div class="hang">
              <el-link type="info" href="http://bbb-36256.oss-cn-hangzhou.aliyuncs.com/NodeExpress_jb51.rar">《Node JS Express初识》</el-link>
              <div class="rightBox">
                <span class="uploadtime" style="display: inline-block;width: 100px;white-space: nowrap;text-align: left">5月12日 21:31</span>
                <span class="username" style="display:inline-block;width: 70px;text-align:center;white-space: nowrap">白国帅</span>
              </div>

            </div>
            <div class="hang">
              <el-link type="info" href="http://bbb-36256.oss-cn-hangzhou.aliyuncs.com/React%20%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B%E4%B8%AD%E6%96%87pdf%E6%A0%BC%E5%BC%8F.rar">《React 入门教程》</el-link>
              <div class="rightBox">
                <span class="uploadtime" style="display: inline-block;width: 100px;white-space: nowrap;text-align: left">5月12日 21:32</span>
                <span class="username" style="display:inline-block;width: 70px;text-align:center;white-space: nowrap">白国帅</span>
              </div>

            </div>
            <div class="hang">
              <el-link type="info" href="http://bbb-36256.oss-cn-hangzhou.aliyuncs.com/Vue2.0-ProgressiveWeb_jb51.rar">《Vue 2.0》</el-link>
              <div class="rightBox">
                <span class="uploadtime" style="display: inline-block;width: 100px;white-space: nowrap;text-align: left">5月18日 17:34</span>
                <span class="username" style="display:inline-block;width: 70px;text-align:center;white-space: nowrap">白国帅</span>
              </div>

            </div>
            <div class="hang">
              <el-link type="info" href="http://bbb-36256.oss-cn-hangzhou.aliyuncs.com/mysql%E5%87%BD%E6%95%B0%E5%A4%A7%E5%85%A8%20%E4%B8%AD%E6%96%87PDF%E7%89%88.rar">《Mysql 函数大全》</el-link>
              <div class="rightBox">
                <span class="uploadtime" style="display: inline-block;width: 100px;white-space: nowrap;text-align: left">5月18日 20:12</span>
                <span class="username" style="display:inline-block;width: 70px;text-align:center;white-space: nowrap">白国帅</span>
              </div>

            </div>
            <div class="hang" v-for="(i,s) in fileList" >
              <el-link type="info" :href="i.filePath">《{{i.fileName}}》</el-link>
              <div class="rightBox">
                <span class="uploadtime" style="display: inline-block;width: 100px;white-space: nowrap;text-align: left">{{$utils.formatDateTime(new Date(i.date))}}</span>
                <span class="username" style="display:inline-block;width: 70px;text-align:center;white-space: nowrap">{{i.number}}</span>
              </div>
            </div>
          </el-main>
          <div>
            <el-upload
              class="upload-demo"
              :action="'http://47.103.9.9:18023/fileUpLoad/upload?username='+this.username"
              :multiple="false"
              :limit="1"
              :on-exceed="handleExceed"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :before-upload="beforeAvatarUpload"
            >
              <el-button size="small" type="primary" style="margin-top: 20px">上传文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过30MB</div>
            </el-upload>
          </div>
        </el-container>
      </div>
    </div>
</template>

<script>
  import {mapMutations, mapState} from 'vuex'
  export default {
     name: "sourcepage",
      data(){
          return{
              fileList:[]
          }
      },
    computed: {
      //获取FirstData数据仓库
      ...mapState('FirstData', {
        number: state => state.Data.number,//学号
        isLogin: state => state.Data.isLogin,
        username: state => state.Data.userName,
        uid: state => state.Data.uid,
      })
    },
    methods:{
      ...mapMutations('FirstData', [
        'save'
      ]),
      beforeAvatarUpload(file) {
        const {uid, isLogin} = this
        if (uid == '' || !isLogin) {
          this.$message('请先登录', 'warning')
          return false;
        }
        if(!this.isLogin) {
          //重新登录
          this.$message('登录超时', 'warning')
          this.save({isLogin:false})
          this.$router.push({name:'regist', query: { redirect: location.hostname }})
          return false;
        }
        console.log(file,file.size / 1024 / 1024,file.name)
        const isJPG = true//file.type === 'application/zip'||file.type === 'application/x-zip-compressed';
        const isLt2M = file.size / 1024 / 1024 < 30;
        const isSpecil=file.name.includes(`,`)
        //判断文件名称
        if (isSpecil) {
          this.$message('请正确命名文件名称！', 'error');
          return false
        }
        //判断文件类型
        if (!isJPG) {
          this.$message('上传文件只能是 zip 格式!', 'error');
          return false
        }
        //判断大小
        if (!isLt2M) {
          this.$message('文件大小不能超过 30MB!', 'error');
          return false
        }
      },
      handleExceed(files, fileList) {
        this.$message(`当前限制选择 1 个文件,请删除文件列表`,'warning');
      },
      uploadSuccess(){
        this.$message(`上传成功`,'success');
        this.requestData()
      },
      uploadError(){
        this.$message(`上传失败`,'error');
      },
      async requestData(){
        try {
          const res=await this.$api.get(`/fileUpLoad/fileList`)
          this.fileList=res
          console.log(res)
        }catch (err) {
          console.log(err)
        }
      },
    },
     created() {
      this.requestData()
    }
  }

</script>

<style scoped lang="scss">
    .sourcepage{
      width: 100%;
      height: 100%;
      background: url("../../static/img/002.jpg") no-repeat fixed  center;
      background-size: cover;
      display: flex;
      justify-content: center;
    }
    .el-header {
      width: 650px;
      background-color: #ddd;
      color: #333;
      text-align: center;
      line-height: 60px;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    }
    .el-main {
      width: 650px;
      background-color: #fff;
      color: #333;
      overflow: auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      a{
        margin-bottom: 16px;
        padding-bottom: 5px;
      }
      .hang{
        display: flex;
        width: 100%;
        justify-content: center;
        .rightBox{
         display: flex;
          margin-left: auto;
          span{
            color: #999;
            font-size: 10px;
          }
        }

      }
    }
    .el-container {
      margin-top: 25%;
      border-radius: 6px;
      height: 38rem;
    }
</style>
