<template>
  <layout>
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <cell-group>
      <cell-item arrow type="link" href="/account/personal_data">
        <span slot="left">个人资料</span>
      </cell-item>
    </cell-group>
    <cell-group>
      <cell-item arrow type="link" href="change_password">
        <span slot="left">登录密码管理</span>
      </cell-item>
      <cell-item arrow type="link" href="pay_password_manage">
        <span slot="left">存管密码管理</span>
      </cell-item>
    </cell-group>
    <cell-group>
      <cell-item arrow @click.native="goQuestionnaire()">
        <span slot="left">风险测评</span>
        <span slot="right" v-if="accountInfo.evaluationScore == undefined" style="color: #999">未测评</span>
        <span slot="right" v-else>{{accountInfo.evaluationScore}}</span>
      </cell-item>
      <cell-item arrow type="link" href="/account/friends/list">
        <span slot="left">好友列表</span>
      </cell-item>
    </cell-group>
    <cell-group>
      <cell-item arrow type="link" href="/article/more">
        <span slot="left">更多</span>
      </cell-item>
    </cell-group>
    <div class="btn-logout" @click="logout">安全退出</div>
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
        this.$router.push('/account')
      },
      isLogin() {
        const _token = localStorage.getItem('token')
        if (_token !== null) {
//          var _accountInfo = String
          this.accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
//          console.log(_accountInfo)
          if (this.accountInfo === null) {
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
      setPayPassword() {
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
      //风险评测
      goQuestionnaire() {
        if (this.accountInfo.evaluationScore !== undefined) {
          this.$dialog.confirm({
            title: '提示',
            mes: '<div style="text-align:center">您已经测评过了，是否重新测评?</div>',
            opts: [{
              txt: '取消',
              color: false
            }, {
              txt: '确定',
              color: true,
              callback: () => {
                this.$router.push('questionnaire')
              }
            }]
          });
        } else {
          this.$router.push('questionnaire')
        }
      },
      //退出登录
      logout() {
        if (localStorage.getItem('token') !== null) {
          this.$dialog.confirm({
            mes: '确定是否退出？',
            opts: () => {
              this.axios.get('auth/ucMemebe/logout').then(res => {
                localStorage.clear();
                this.$dialog.toast({mes: '退出成功', icon: 'success'})
                this.$router.push({path: '/'})
              })
            }
          });
        } else {
          this.$router.push({path: '/'})
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .btn-logout
    margin: .3rem
    height: .88rem
    line-height .88rem
    text-align: center
    background: #fff
    border: 1px solid #eee
    border-radius: .1rem
    font-size: .30rem
    color: #d82d2d
    white-space: nowrap
</style>
