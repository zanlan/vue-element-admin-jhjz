<template>
  <div class="login-container">
    <div class="login-content">
      <div class="left-image" />
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="right-login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title">金海九州官网后台系统</div>
        <el-form-item prop="username">
          <div class="lable-text">用户编号</div>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户编号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <div class="lable-text">密码</div>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
        <el-button
          v-debounce="handleLogin"
          :loading="loading"
          type="primary"
          style="width: 100%;height:48px;background:#1E5EFF;"
        >登录</el-button>
      </el-form>
      <!-- @click.native.prevent="handleLogin" -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (/^\d{6}$/.test(value)) {
        callback()
      } else {
        callback(new Error('您的用户编号或者密码错误，请重新输入'))
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (/^\w{8,16}$/.test(value) && !/^[a-zA-z]{8,16}$/.test(value) && !/^\d{8,16}$/.test(value) && !value.match('_')) {
        callback()
      } else {
        callback(new Error('请输入8~16位数字和字母，不能为纯数字或者字母'))
      }
    }
    return {
      loginForm: {
        // username: '100033',
        // password: 'jcK566K4m85t'
        // username: '100001',
        // password: 'hebiao123'
        username: '',
        password: ''
        // username: '200000',
        // password: 'dC9nI0p6q7Y47e'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const { username, password } = this.loginForm
          this.loading = true
          // store/modules/user.js下login
          const data = new FormData()
          data.append('userNo', username)
          data.append('userPassword', password)
          this.$store
            .dispatch('user/login', data)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
              // location.reload()
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.login-container {
  .el-input {
    .el-input__inner {
      height: 48px;
      line-height: 48px;
    }
  }
  .el-form-item {
    margin-bottom: 20px;
  }
  .el-button {
    margin-top: 38px;
    font-size: 16px;
  }
}
</style>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$white: #fff;

.login-container {
  min-height: 100%;
  width: 100%;
  background-image: url("../../assets/images/login-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;
  position: relative;
  .login-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    justify-content: space-around;
    overflow: hidden;
    width: 899px;
    height: 630px;
    background: $white;
    box-shadow: 0px 5px 10px 0px rgba(0, 36, 128, 0.32),
      0px 1px 4px 0px rgba(21, 34, 50, 0.08);
    border-radius: 6px;
    .left-image {
      width: 437px;
      height: 630px;
      background-image: url("../../assets/images/login-content.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .right-login-form {
      width: 462px;
      height: 630px;
      padding: 88px 64px;
      position: relative;
      .lable-text {
        font-size: 14px;
        color: #5a607f;
        line-height: 20px;
        margin-bottom: 3px;
      }
    }
    .tips {
      font-size: 14px;
      color: $white;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title {
      font-weight: 400;
      color: #131523;
      font-size: 32px;
      margin-bottom: 68px;
      text-align: center;
      font-weight: 400;
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 28px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
