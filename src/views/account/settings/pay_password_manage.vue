<template>
  <layout>
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <cell-group>
      <cell-item arrow @click.native="editPayPassword()">
        <span slot="left">修改存管密码</span>
      </cell-item>
      <cell-item arrow @click.native="forgetPayPassword()">
        <span slot="left">忘记存管密码</span>
      </cell-item>
    </cell-group>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        accountInfo: ''
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
      editPayPassword() {
        if (this.accountInfo.status === 'un_auth') {
          this.$router.push('/account/certification')
        } else {
          this.$dialog.loading.open('数据加载中...');
          this.axios.post('auth/ucMemebe/certification/api/update/password').then(res => {
            console.log(res)
            if (res.success) {
              window.location.href = res.result
            } else {
              this.$dialog.toast({mes: res.errorDescription})
            }
          })
        }
      },
      forgetPayPassword() {
        if (this.accountInfo.status === 'un_auth') {
          this.$router.push('/account/certification')
        } else {
          this.$dialog.loading.open('数据加载中...');
          this.axios.post('auth/ucMemebe/certification/api/get/password').then(res => {
            console.log(res)
            if (res.success) {
              window.location.href = res.result
            } else {
              this.$dialog.toast({mes: res.errorDescription})
            }
          })
        }
      },
    }
  }
</script>
