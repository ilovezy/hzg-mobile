<template>
  <layout class="bg-white">
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <cell-group>
      <cell-item>
        <icon slot="icon" name="mobile" size=".4rem" color="#bbb"></icon>
        <input slot="right" type="tel" maxlength="11" placeholder="手机号码" v-model="username">
      </cell-item>
      <cell-item v-if="isImgCode">
        <icon slot="icon" name="smscode" size=".4rem" color="#bbb"></icon>
        <input type="text" slot="right" v-model="validateCode" maxlength="4" placeholder="图形验证码">
        <img slot="right" :src="validateCodeImg" @click="getValidateCode()">
      </cell-item>
      <cell-item>
        <icon slot="icon" name="smscode" size=".4rem" color="#bbb"></icon>
        <input type="tel" slot="right" v-model="smsCode" maxlength="6" placeholder="短信验证码">
        <button slot="right" class="btn-cell-special -disabled" disabled v-if="username.length !== 11">获取验证码</button>
        <button slot="right" class="btn-cell-special -disabled" disabled v-else-if="isImgCode == true && validateCode.length !== 4">获取验证码</button>
        <sendcode slot="right" v-model="sendCodeStart" @click.native="sendCode" :second="second" type="warning" v-else></sendcode>
      </cell-item>
      <cell-item>
        <icon slot="icon" name="password" size=".4rem" color="#bbb"></icon>
        <input slot="right" type="password" autocomplete="off" maxlength="16" placeholder="登录密码（6-16位数字与字母组合）" v-model.trim="password">
      </cell-item>
      <cell-item>
        <icon slot="icon" name="reference" size=".4rem" color="#bbb"></icon>
        <input slot="right" type="tel" maxlength="11" placeholder="推荐人手机号（选填）" v-on:keyup.delete="referenceMobileDelete" v-model="referenceMobile">
      </cell-item>
      <div class="cell-protocol">注册即代表同意
        <router-link to="/protocol/register">长富理财注册协议</router-link>
      </div>
      <div class="cell-button">
        <ibutton size="large" type="disabled" v-if="isImgCode">立即注册</ibutton>
        <ibutton size="large" type="disabled" v-else-if="isNaN(this.username) || username.length !== 11 || smsCode.length !== 6 || password.length < 6">立即注册</ibutton>
        <ibutton size="large" type="disabled" v-else-if="referenceMobile !== null && referenceMobile !== '' && referenceMobile.length !== 11">立即注册</ibutton>
        <ibutton size="large" type="primary" @click.native="register()" v-else>立即注册</ibutton>
      </div>
    </cell-group>
    <div class="warm-prompt">
      <router-link to="/login" tag="div" class="reg-login">立即登录<i class="icon-arrow-more"></i></router-link>
      <p class="text-center">客服热线：<a href="tel:4000998799"> 400-099-8799</a></p>
    </div>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        isFirst: true,
        referenceMobile: '',
        referenceMobiles: '',
        isImgCode: false,
        validateCode: '',
        validateCodeImg: '',
        smsCode: '',
        second: 60,
        sendCodeStart: false,
        inviteCode: ''
      }
    },
    created() {
      this.islogin()
    },
    methods: {
      goBack() {
        if ( this.$route.query.inviteCode !== undefined ){
          this.$router.push('/')
        } else {
          this.$router.back()
        }
      },
      islogin() {
        if (localStorage.getItem('token') !== null) {
          this.$router.push('/account')
        }
        if (this.$route.query.inviteCode !== undefined && this.$route.query.inviteCode !== '' && this.$route.query.inviteCode !== null) {
          this.inviteCode = this.$route.query.inviteCode
          this.axios.get('security/find/invite/' + this.inviteCode + '?client_id=wap-1&client_secret=ER5P185J').then(res => {
            if (res.success) {
              this.referenceMobiles = res.result
              this.referenceMobile = res.result
            }
          })
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
        this.$dialog.loading.open('验证码发送中...');
        this.axios.post('security/send/sms/' + this.username + '?client_id=wap-1&client_secret=ER5P185J&phone_key=' + this.username).then((res) => {
          if (res.success) {
            this.sendCodeStart = true
            this.$dialog.toast({mes: '验证码发送成功', icon: 'success'});
          } else if (res.error === 'MEMBER_NEED_VALIDATE_CODE_ERROR') {
            this.isImgCode = true
            this.$dialog.toast({mes: '由于您的操作过于频繁，请输入图形验证码'});
            this.getValidateCode()
          } else {
            this.$dialog.toast({mes: res.errorDescription});
            if(this.referenceMobiles !== ''){
              this.referenceMobile = this.referenceMobiles
            }
          }
        })
      },
      //获取图片验证码
      getValidateCode() {
        this.$dialog.loading.open('图片验证码获取中...');
        this.axios.post('security/send/getValidateCode?client_id=wap-1&client_secret=ER5P185J&phone_key=' + this.username).then((res) => {
          if (res.success) {
            this.validateCodeImg = 'data:image/png;base64,' + res.result.validateCode
          }
        })
      },
      //校验图片验证码
      checkValidateCode() {
        this.$dialog.loading.open('校验中...');
        this.axios.post('security/send/checkValidateCode?client_id=wap-1&client_secret=ER5P185J&phone_key=' + this.username + '&validate_code=' + this.validateCode).then((res) => {
          this.$dialog.loading.close();
          if (res.success) {
            this.isImgCode = false
            this.smsCode = ''
            this.validateCode = ''
            this.sendSmsCode()
          } else {
            this.validateCode = ''
            this.getValidateCode()
            this.$dialog.toast({mes: res.errorDescription});
          }
        })
      },
      //注册校验
      register() {
        if (!global.vMobile.test(this.username)) {
          this.$dialog.toast({mes: '输入的手机号码格式不正确'});
          return
        } else if (!global.vPassword.test(this.password)) {
          this.$dialog.toast({mes: '输入的密码格式不正确'})
          return
        }
        if (this.referenceMobile !== null && this.referenceMobile !== '') {
          if (this.referenceMobile === this.referenceMobiles) {
            this.referenceMobile = null
            this.submitRegister()
          } else {
            //校验推荐人
            if (!global.vMobile.test(this.referenceMobile)) {
              this.$dialog.toast({mes: '输入的推荐人手机号码格式不正确'});
              return
            }
            this.axios.post('security/checkMobileExists?mobile=' + this.referenceMobile).then(res => {
              var _trueMobile = res
              if (!_trueMobile.result) {
                this.$dialog.toast({mes: '您填写的推荐人并不存在'});
                return
              } else {
                this.submitRegister()
              }
            })
          }
        } else {
          this.inviteCode = null
          this.submitRegister()
        }
      },
      submitRegister() {
        //提交注册
        this.$dialog.loading.open('注册中请稍后...')
        this.axios.get('security/auth/sms/check/' + this.username + '/code/' + this.smsCode + '?client_id=wap-1&client_secret=ER5P185J+&phone_key=' + this.username).then((res) => {
          if (res.success) {
            this.axios.post('security/register?client_id=wap-1&client_secret=ER5P185J', {
              mobile: this.username,
              password: this.password,
              referenceMobile: this.referenceMobile,
              registerType: 'wap',
              shortUrl: this.inviteCode
            }).then(res => {
              if (res.success) {
                var accesToken = res.result.access_token;
                localStorage.setItem('token', accesToken)
                localStorage.removeItem('rtn')
                localStorage.removeItem('rts')
                this.registerWin()
                if(this.referenceMobiles !== ''){
                  this.referenceMobile = this.referenceMobiles
                }
              } else {
                this.$dialog.toast({mes: res.result[0].defaultMessage});
                if(this.referenceMobiles !== ''){
                  this.referenceMobile = this.referenceMobiles
                }
              }
            })
          } else if (res.error === 'MEMBER_NEED_VALIDATE_CODE_ERROR') {
            this.isImgCode = true
            this.$dialog.toast({mes: '由于您的操作过于频繁，请输入图形验证码'});
            this.getValidateCode()
          } else {
            this.$dialog.toast({mes: res.errorDescription})
            if(this.referenceMobiles !== ''){
              this.referenceMobile = this.referenceMobiles
            }
          }
        })
      },
      registerWin() {
        this.$dialog.confirm({
          classname: 'register-win',
          title: '开通成功',
          mes: '<div class="register-info"><a href="/account/cash_reward">查看礼包 <i class="icon-arrow-right"></i></a> </div>',
          opts: [{
            txt: '开通银行资金存管账户',
            callback: () => {
              this.$router.replace('/account/certification')
            }
          }]
        });
      },
      referenceMobileDelete() {
        if(this.referenceMobiles !== ''){
          if (this.isFirst) {
            this.referenceMobile = ''
            this.referenceMobiles = ''
            this.isFirst = false
          }
        }
      }
    },
    watch: {
      validateCode: function (val) {
        if (val.length === 4){
          this.checkValidateCode()
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .reg-login
    margin 0 auto .16rem
    padding-bottom .16rem
    width 80%
    text-align: center;
    font-size .34rem
    color: #d82d2d
    border-bottom 1px solid #eee
    .icon-arrow-more
      margin-left: .1rem;
      vertical-align: middle
      font-size .24rem
  .register-win
    width 6rem
    height: 8.2rem
    background-size 6rem 8.2rem
    background-image: url("../../static/images/account/register_win_bg.png")
    background-position center center
    background-repeat no-repeat
    .confirm-hd
      display none
    .confirm-bd
      padding 5.5rem 0 .5rem
      text-align: center
      font-size .34rem
      color #f5c528
    .confirm-ft:after
      content inherit
      height: 0
      border: 0
    .confirm-ft
      .confirm-btn
        flex inherit
        margin 0 auto
        display block
        text-align: center
        font-size .34rem
        font-weight bold
        color #d82d2d
        width 4.16rem
        height: .96rem
        line-height .9rem
        background-color #f5c528
        border-bottom: .06rem solid #e19b08
        border-radius .5rem
</style>
