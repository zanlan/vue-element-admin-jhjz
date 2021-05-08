<template>
  <div class="change-password-container">
    <div class="table-content">
      <el-form v-if="isShowChange" ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="change-ruleForm">
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="ruleForm.pass" placeholder="请输入新密码" class="w350" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" placeholder="请输入确认密码" class="w350" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button v-debounce="submitForm" type="primary" class="btn-ruleForm">提交</el-button>
        </el-form-item>
      </el-form>

      <div v-if="!isShowChange" class="table-content-item center">
        <img :src="img" alt="" srcset="">
      </div>
      <div v-if="!isShowChange" class="table-content-item center change-success">
        密码修改成功
      </div>
      <div v-if="!isShowChange" class="table-content-item center">
        <el-button type="primary" @click="logout">使用新密码登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { updatePwd } from '@/api/updatePwd'
import { mapGetters } from 'vuex'
export default {
  name: 'ChangePassword',

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (/^\w{8,16}$/.test(value) && !/^[a-zA-z]{8,16}$/.test(value) && !/^\d{8,16}$/.test(value) && !value.match('_')) {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback()
        } else {
          callback(new Error('请输入8~16位数字和字母，不能为纯数字或者字母'))
        }
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isShowChange: true,
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      img: require('@/assets/images/change-password.png')
    }
  },
  computed: {
    ...mapGetters(['userNo', 'isUnsafeStatus'])
  },
  mounted() {
    const bodyHeight = document.body.getBoundingClientRect().height
    const dom = document.querySelector('.change-password-container .table-content')
    dom.style.minHeight = bodyHeight - 124 + 'px'
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const obj = { userNo: this.userNo, password: this.ruleForm.pass, isUnsafeStatus: this.isUnsafeStatus }
          updatePwd(obj).then(() => {
            this.$message({
              showClose: true,
              type: 'success',
              message: `密码修改成功`
            })
            this.isShowChange = false
          })
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss">
.change-password-container {
  .table-content {
    width: 100%;
    padding: 28px;
    background: #fff;
    box-shadow: 0px 1px 4px 0px rgba(21, 34, 50, 0.08);
    border-radius: 6px;
    .change-ruleForm{
      width: 500px;
      margin: 0 auto;
      padding-top: 30px;
      .btn-ruleForm{
        margin-left: 138px;
      }
    }
    .table-content-item{
      margin:0 auto;
      &>span{
        padding-right: 15px;
      }
      width: 450px;
      align-items: center;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
      img{
        margin-top: 40px;
        width: 100px;
        height: auto;
      }
    }
     .table-content-item.center{
       justify-content: center;
     }
     .table-content-item.change-success{
        margin-bottom: 40px;
        font-size: 16px;
        font-weight: 500;
        color: #131523;
        line-height: 22px;
     }
  }
}
</style>
