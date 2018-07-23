<template>
  <layout class="bg-white">
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <cell-group v-if="!isPassword">
      <cell-item>
        <icon slot="icon" name="mobile" size=".4rem" color="#bbb"></icon>
        <input slot="right" type="tel" autocomplete="off" maxlength="11" placeholder="手机号码" v-model="username">
      </cell-item>
      <cell-item v-if="isImgCode">
        <icon slot="icon" name="smscode" size=".4rem" color="#bbb"></icon>
        <input type="text" slot="right" v-model="validateCode" maxlength="4" placeholder="图形验证码">
        <img slot="right" :src="validateCodeImg" @click="getValidateCode()">
      </cell-item>
      <cell-item v-if="!isImgCode">
        <icon slot="icon" name="smscode" size=".4rem" color="#bbb"></icon>
        <input type="tel" slot="right" v-model="smsCode" maxlength="6" placeholder="短信验证码">
        <button slot="right" class="btn-cell-special -disabled" disabled v-if="username.length !== 11">获取验证码</button>
        <button slot="right" class="btn-cell-special -disabled" disabled v-else-if="isImgCode == true && validateCode.length !== 4">获取验证码
        </button>
        <sendcode slot="right" v-model="sendCodeStart" @click.native="sendCode" :second="second" type="warning" v-else></sendcode>
      </cell-item>
      <div class="cell-button" v-if="isImgCode">
        <ibutton size="large" type="disabled" v-if="validateCode.length !== 4">下一步</ibutton>
        <ibutton size="large" type="primary" @click.native="checkValidateCode()" v-else>下一步</ibutton>
      </div>
      <div class="cell-button" v-if="!isImgCode">
        <ibutton size="large" type="disabled" v-if="isNaN(this.username) || username.length !== 11 || smsCode.length !== 6 ">下一步</ibutton>
        <ibutton size="large" type="primary" @click.native="nextForget()" v-else>下一步</ibutton>
      </div>
    </cell-group>
    <cell-group v-if="isPassword">
      <cell-item>
        <icon slot="icon" name="password" size=".4rem" color="#bbb"></icon>
        <input slot="right" type="password" autocomplete="off" maxlength="16" placeholder="请设置6-16位登录密码（数字与字母组合）" v-model.trim="password">
      </cell-item>
      <div class="cell-button">
        <ibutton size="large" type="disabled" v-if="isNaN(this.username) || username.length !== 11 || smsCode.length !== 6 || password.length < 6 || password.length > 16">提交</ibutton>
        <ibutton size="large" type="primary" @click.native="forgetPassword()" v-else>提交</ibutton>
      </div>
    </cell-group>
  </layout>
</template>
<script>
  import CellGroup from "../components/cell/src/cell-group.vue";

  export default {
    components: {CellGroup},
    data() {
      return {
        username: '',
        password: '',
        referenceMobile: '',
        isImgCode: false,
        validateCodeImg: '',
        validateCode: '',
        smsCode: '',
        second: 60,
        sendCodeStart: false,
        isPassword: false,
      }
    },
    created() {
      this.islogin()
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      islogin() {
        if (localStorage.getItem('token') !== null) {
          this.$router.push('/account')
        }
      },
      /**
       * 获取验证码 & 验证
       */
      sendCode() {
        if (!this.username) {
          this.$dialog.toast({mes: '您还没有输入手机号码'});
          return
        } else if (!global.vMobile.test(this.username)) {
          this.$dialog.toast({mes: '输入的手机号码格式不正确'});
          return
        }
        if (this.isImgCode === true && this.validateCode.length === 4) {
          this.checkValidateCode()
        } else {
          this.sendSmsCode()
        }
      },
      sendSmsCode() {
        this.$dialog.loading.open('发送中...');
        this.axios.post('security/forget/send/sms/' + this.username + '?client_id=wap-1&client_secret=ER5P185J&phone_key=' + this.username).then(res => {
          if (res.success) {
            this.sendCodeStart = true
            this.$dialog.toast({mes: '发送成功', icon: 'success'});
            this.smsCode = ''
          } else if (res.error === 'MEMBER_NEED_VALIDATE_CODE_ERROR') {
            this.isImgCode = true
            this.smsCode = ''
            this.$dialog.toast({mes: res.errorDescription});
            this.getValidateCode()
          } else {
            this.$dialog.toast({mes: res.errorDescription});
          }
        })
      },
      //获取图片验证码
      getValidateCode() {
        this.axios.post('security/forget/send/getValidateCode?client_id=wap-1&client_secret=ER5P185J&phone_key=' + this.username).then((res) => {
          if (res.success) {
            this.validateCodeImg = 'data:image/png;base64,' + res.result.validateCode
          }
        })
      },
      //校验图片验证码
      checkValidateCode() {
        this.axios.post('security/forget/send/checkValidateCode?client_id=wap-1&client_secret=ER5P185J&phone_key=' + this.username + '&validate_code=' + this.validateCode).then((res) => {
          if (res.success) {
            this.sendSmsCode()
            this.isImgCode = false
          } else {
            this.getValidateCode()
            this.$dialog.toast({mes: res.errorDescription});
          }
        })
      },
      nextForget(){
        if (!global.vMobile.test(this.username)) {
          this.$dialog.toast({mes: '手机号码格式错误'});
          return
        }
        this.$dialog.loading.open('数据正在提交...')
        this.axios.get('security/forget/sms/check/' + this.username + '/code/' + this.smsCode + '?client_id=wap-1&client_secret=ER5P185J&phone_key=' + this.username).then(res => {
          if (res.success) {
            this.isPassword = true
          } else if (res.error === 'MEMBER_NEED_VALIDATE_CODE_ERROR') {
            this.smsCode = ''
            this.$dialog.toast({mes: '由于您操作过于频繁，请先验证图形验证码', timeout: 3000});
            this.validateCode = ''
            this.isImgCode = true
            this.getValidateCode()
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      forgetPassword() {
        //js校验手机格式
        if (!global.vPassword.test(this.password)) {
          this.$dialog.toast({mes: '输入的新密码格式不正确', timeout: 3000})
          return
        }
        //提交找回密码
        this.axios.get('security/reset/password?phone=' + this.username + '&password=' + this.password + '&client_id=wap-1&client_secret=ER5P185J').then((res) => {
          if (res.success) {
            this.$dialog.toast({mes: '找回密码成功，请登录', icon: 'success'});
            localStorage.clear()
            this.$router.push({path: 'login'})
          } else {
            this.$dialog.toast({mes: res.errorDescription});
          }
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>
