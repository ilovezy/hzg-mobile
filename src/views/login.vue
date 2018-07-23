<template>
  <layout class="bg-white">
    <navbar :title="$route.meta.title"
            slot="navbar">
      <navbar-back-icon @click.native="goBack"
                        slot="left"></navbar-back-icon>
    </navbar>
    <cell-group>
      <cell-item>
        <icon slot="icon"
              name="mobile"
              size=".42rem"
              color="#bbb"></icon>
        <input slot="right"
               type="tel"
               maxlength="11"
               placeholder="手机号码"
               v-model="username">
      </cell-item>
      <cell-item>
        <icon slot="icon"
              name="password"
              size=".42rem"
              color="#bbb"></icon>
        <input slot="right"
               type="password"
               maxlength="16"
               placeholder="登录密码"
               v-model.trim="password">
      </cell-item>
      <div class="cell-button">
        <p class="text-right">
          <router-link to="forget"
                       class="text-right">忘记密码？
          </router-link>
        </p>
        <ibutton size="large"
                 type="disabled"
                 v-if="isNaN(this.username) || username.length !== 11 || password.length < 6 || password.length > 16">登录
        </ibutton>
        <ibutton size="large"
                 type="primary"
                 @click.native="loginBtn()"
                 v-else>立即登录
        </ibutton>
      </div>
    </cell-group>
    <div class="warm-prompt">
      <router-link to="/register"
                   tag="div"
                   class="reg-login">新用户注册，领取666元大礼包<i class="icon-arrow-more"></i>
      </router-link>
      <p class="text-center">客服热线：<a href="tel:4000998799"> 400-099-8799</a></p>
    </div>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        username: '',
        password: ''
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
      loginBtn() {
        if (!global.vMobile.test(this.username)) {
          this.$dialog.toast({mes: '输入的手机号码格式不正确x'});
          return
        } else if (!global.vPassword.test(this.password)) {
          this.$dialog.toast({mes: '输入的密码格式不正确'});
          return
        }
        this.$dialog.loading.open('正在登录...');
        this.axios.post('security/oauth2/token', ('client_id=wap-1' + '&client_secret=ER5P185J' + '&grant_type=password' + '&scope=read write' + '&username=' + this.username + '&password=' + this.password)).then(res => {
          if (res.success) {
            localStorage.removeItem('rtn')
            localStorage.removeItem('rts')
            localStorage.setItem('token', res.result.access_token)
            this.$dialog.toast({mes: '登录成功', icon: 'success'})
            this.$router.replace({path: 'account'})
          } else {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
          }
        })
      }
    }
  }
</script>
<style lang="stylus"
       rel="stylesheet/stylus">
  .cell-button
    p
      padding-bottom .25rem
      color: #999

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
</style>
