<template>
    <div class="technology">
        <div class="bbox" >
          <div style="margin-bottom: 15px;display: flex;align-items: center;color:#a6a9ad">
            <el-icon class="el-icon-message" style="margin-right: 5px"></el-icon>
            <el-link href="https://github.com/Baiguoshuai1" target="_blank" type="info" >Kevin_bbb@github.com</el-link>
          </div>
          <div style="display: flex;align-items: center;color:#a6a9ad">
            <el-icon class="el-icon-message" style="margin-right: 5px"></el-icon>
            <el-link href="http://mail.hichina.com/alimail/" target="_blank" type="info">guoshuai.bai@palmaplus.com</el-link>
          </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "technology"
    }
</script>

<style scoped lang="scss">
    .technology{
      width: 100%;
      height: 100%;
      background: url("../../static/img/002.jpg") no-repeat fixed;
      background-size: cover;
      display: flex;
      justify-content: center;
      .bbox{
        margin-top: 12%;
        width: 500px;
        height: 300px;
        color: #fff;
        border-radius: 6px;
        background-color: rgba(255,255,255,.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        a{
        //  color: #fff;
        }
      }
    }
</style>
