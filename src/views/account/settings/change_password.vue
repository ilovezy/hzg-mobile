<template>
  <layout class="bg-white">
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <cell-group title="原密码">
      <cell-item>
        <input slot="right" type="password" autocomplete="off" maxlength="11" placeholder="输入原登录密码" v-model="oldPwd">
      </cell-item>
      <i></i>
    </cell-group>
    <cell-group title="新密码">
      <cell-item>
        <input slot="right" type="password" autocomplete="off" placeholder="请输入新登录密码（长度6-16位至少包含数字和字母）"
               v-model="newPwd">
      </cell-item>
      <cell-item>
        <input slot="right" type="password" autocomplete="off" placeholder="请确认新登录密码" v-model="repeatNewPwd">
      </cell-item>
      <i></i>
    </cell-group>
    <div class="cell-button">
      <ibutton size="large" type="disabled"
               v-if="oldPwd.length < 6 || oldPwd.length > 16 || newPwd.length < 6 || newPwd.length > 16 || repeatNewPwd.length < 6 || repeatNewPwd.length > 16  || newPwd !== repeatNewPwd ">
        确认修改
      </ibutton>
      <ibutton size="large" type="primary" @click.native="changePassword()" v-else>确认修改</ibutton>
    </div>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        accountInfo: '',
        oldPwd: '',
        newPwd: '',
        repeatNewPwd: ''
      }
    },
    created() {
      this.isLogin()
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      isLogin() {
        const _token = localStorage.getItem('token')
        if (_token !== null) {
          const _accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
          if (_accountInfo !== null) {
            this.accountInfo = _accountInfo
          } else {
            this.getUserInfo()
          }
        } else {
          this.$dialog.toast({mes: '您还没有登录或登录已失效，请重新登录！'})
          localStorage.clear()
          this.$router.push('/login')
        }
      },
      getUserInfo() {
        //获取账户信息
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/ucMemebe/info').then(res => {
          if (res.success) {
            this.accountInfo = res.result
            localStorage.setItem('accountinfo', JSON.stringify(res.result))
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      changePassword() {
        if (!global.vPassword.test(this.oldPwd)) {
          this.$dialog.toast({mes: '原登录密码格式不正确！'});
          return
        } else if (!global.vPassword.test(this.newPwd)) {
          this.$dialog.toast({mes: '新登录密码格式不正确！'});
          return
        }
        if (this.newPwd !== this.repeatNewPwd) {
          this.$dialog.toast({mes: '两次登录密码匹配不正确！'});
          return
        } else if (this.newPwd === this.oldPwd) {
          this.$dialog.toast({mes: '新密码跟旧密码不能相同！'});
          return
        }
        this.$dialog.loading.open('数据发送中...');
        this.axios.post('auth/ucMemebe/updatePassword',
          ({
            newPwd: this.newPwd,
            oldPwd: this.oldPwd,
            repeatNewPwd: this.repeatNewPwd
          })
        ).then(res => {
          if (res.success) {
            this.$dialog.toast({mes: '密码修改成功,请重新登录', icon: 'success', timeout: 3000})
            //修改密码清空token
            localStorage.clear('token')
            this.$router.replace('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      }
    }
  }
</script>
