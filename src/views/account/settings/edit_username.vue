<template>
  <layout class="bg-white">
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="global-top-tips">温馨提示：昵称为唯一性，设置后不可更改。</div>
    <cell-group title="昵称">
      <cell-item>
        <input slot="right" type="text" autocomplete="off" maxlength="11" placeholder="请输入您的昵称" v-model="username">
      </cell-item>
      <div class="cell-button">
        <ibutton size="large" type="disabled" v-if="!username">确认设置</ibutton>
        <ibutton size="large" type="primary" @click.native="editUsername()" v-else>确认设置</ibutton>
      </div>
    </cell-group>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        accountInfo: '',
        username: '',
        usernameLength: ''
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
            this.username = this.accountInfo.username
            if (this.username !== undefined) {
              this.$router.replace('/account/personal_data')
            }
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
      editUsername() {
        //转换一个中文为三个字符
        function getBLen(str) {
          if (str == null) return 0;
          if (typeof str != "string") {
            str += "";
          }
          return str.replace(/[^\x00-\xff]/g, "012").length;
        }

        this.usernameLength = getBLen(this.username)
        if (!global.vUsername.test(this.username) || this.usernameLength <= 3) {
          this.$dialog.toast({mes: '昵称需为中文、字母或中文字母的组合，长度为4-14个字符（一个汉字为3个字符）。', timeout: 3000});
          return
        }
        this.$dialog.loading.open('昵称设置中...');
        this.axios.post('auth/ucMemebe/updateUserName?username=' + this.username).then(res => {
          if (res.success) {
            //更新用户信息
            this.axios.get('auth/ucMemebe/info').then(res => {
              if (res.success) {
                this.accountInfo = res.result
                localStorage.setItem('accountinfo', JSON.stringify(res.result))
                this.$dialog.toast({mes: '昵称设置成功', icon: 'success'})
                this.$router.replace('/account/personal_data')
              }
            })
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription, timeout: 3000})
            localStorage.clear()
            this.$router.push('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      }
    }
  }
</script>
