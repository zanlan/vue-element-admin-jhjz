<template>
  <div class="notfind">
    <div class="wrap-nofind">
      <div class="nofind-title">哎呀，出错了！您访问的页面不存在...</div>
      <img :src="img" alt="" srcset="">
      <div class="nofind-title bottom-titie">您可以通过以下方式继续访问：</div>
      <el-button type="primary" @click="goback">返回上一页</el-button>
      <el-button type="success" @click="goindex">进入首页</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  data() {
    return {
      img: require('@/assets/images/404.png')
    }
  },
  methods: {
    goback() {
      history.go(-1)
    },
    goindex() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
  .notfind{
    width: 100vw;
    height: 100vh;
    position: relative;
    .wrap-nofind{
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 600px;
      height: 500px;
      transform: translateY(-50px);
      img{
        margin: 30px 0;
        width: 320px;
        height: 270px;
      }
      .nofind-title{
        font-size: 16px;
        font-weight: 400;
        color: #82B4FF;
        line-height: 22px;
      }
      .bottom-titie{
        margin-bottom: 20px;
      }
    }
  }
</style>
