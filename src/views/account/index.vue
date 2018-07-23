<template>
  <layout :showTabbar="true">
    <div class="isLogin" v-if="!isLogin">
      <header class="account-login">
        <router-link to="/activity/newbiesem"><img src="../../../static/images/account/login_bg.png"></router-link>
        <div class="btn-login">
          <router-link to="/login">登录</router-link>
          <router-link to="/register">注册</router-link>
        </div>
      </header>
      <grids-group class="account-nav" :rows="3">
        <grids-item link="/login">
          <i slot="icon" class="icon-guide -myinvest"></i> <span slot="text">我的投资</span>
        </grids-item>
        <grids-item link="/login">
          <i slot="icon" class="icon-guide -fundrecord"></i> <span slot="text">资金记录</span>
        </grids-item>
        <grids-item link="/login">
          <i slot="icon" class="icon-guide -coupon"></i> <span slot="text">红包卡券</span>
        </grids-item>
        <grids-item link="/login">
          <i slot="icon" class="icon-guide -deposit"></i> <span slot="text">存管账户</span>
        </grids-item>
        <grids-item link="/login">
          <i slot="icon" class="icon-guide -bankcard"></i> <span slot="text">银行卡</span>
        </grids-item>
        <grids-item link="/login">
          <i slot="icon" class="icon-guide -setting"></i> <span slot="text">账号设置</span>
        </grids-item>
      </grids-group>
    </div>
    <div class="isLogin" v-else>
      <div class="account-deposit" v-if="isDeposit">
        <div class="account-header">
          <router-link to="/account/personal_data" class="username">
            <img src="/static/images/avatars.png" v-if="accountInfo.avatars == undefined" :alt="accountInfo.username">
            <img :src="accountInfo.avatars+'?imageView2/5/w/300/h/300'" :alt="accountInfo.username" v-else>
            <span v-if="accountInfo.username == undefined">{{accountInfo.mobileMask}}</span>
            <span v-else>{{accountInfo.username}}</span>
          </router-link>
          <router-link to="article/message" class="message">
            <i class="icon-message" :class="unReadCount > 0 ? '-dot' : '' "></i>
          </router-link>
        </div>
        <img src="../../../static/images/account/deposit_bg.png">
        <router-link to="/account/certification" tag="button" class="btn-deposit">立即开通存管</router-link>
      </div>
      <header class="account-info" v-else>
        <div class="account-header">
          <router-link to="/account/personal_data" class="username">
            <img src="/static/images/avatars.png" v-if="accountInfo.avatars == undefined" :alt="accountInfo.username">
            <img :src="accountInfo.avatars+'?imageView2/5/w/100/h/100'" :alt="accountInfo.username" v-else>
            <span v-if="accountInfo.username == undefined">{{accountInfo.mobileMask}}</span>
            <span v-else>{{accountInfo.username}}</span>
          </router-link>
          <router-link to="article/message" class="message">
            <i class="icon-message" :class="unReadCount > 0 ? '-dot' : '' "></i>
          </router-link>
        </div>
        <div class="asset-fund">
          <router-link tag="dl" to="/account/my_fund">
            <dt>总资产（元）<i class="icon-arrow-right"></i></dt>
            <dd v-text="myFund.formatTotalBalance"></dd>
          </router-link>
          <router-link tag="dl" to="/account/my_profit">
            <dt>我的收益（元）<i class="icon-arrow-right"></i></dt>
            <dd v-text="myFund.formatMyInterest"></dd>
          </router-link>
        </div>
      </header>
      <div class="asset-stat" v-if="!isDeposit">
        <dl class="balance">
          <dt @click="syncBalance()">账户可用余额（元）</dt>
          <dd v-text="myFund.formatAvailableBalance"></dd>
        </dl>
        <div class="control">
          <router-link to="/account/recharge">充值</router-link>
          <router-link to="/account/cash">提现</router-link>
        </div>
      </div>
      <grids-group class="account-nav" :rows="3" v-if="accountInfo !== ''">
        <grids-item link="/account/certification" v-if="this.accountInfo.status == 'un_auth' || this.accountInfo.status == 'authing'">
          <i slot="icon" class="icon-guide -myinvest"></i> <span slot="text">我的投资</span>
        </grids-item>
        <grids-item link="/account/wait_establish_invests" v-else>
          <i slot="icon" class="icon-guide -myinvest"></i> <span slot="text">我的投资</span>
        </grids-item>
        <grids-item link="/account/certification"
          v-if="this.accountInfo.status == 'un_auth' || this.accountInfo.status == 'authing'">
          <i slot="icon" class="icon-guide -fundrecord"></i> <span slot="text">资金记录</span>
        </grids-item>
        <grids-item link="/account/fund_record" v-else>
          <i slot="icon" class="icon-guide -fundrecord"></i> <span slot="text">资金记录</span>
        </grids-item>
        <grids-item link="/account/cash_reward">
          <i slot="icon" class="icon-guide -coupon"></i> <span slot="text">红包卡券</span>
        </grids-item>
        <grids-item link="/account/certification" v-if="this.accountInfo.status == 'un_auth' || this.accountInfo.status == 'authing'">
          <i slot="icon" class="icon-guide -deposit"></i> <span slot="text">存管账户</span>
        </grids-item>
        <grids-item link="/account/depository" v-else>
          <i slot="icon" class="icon-guide -deposit"></i> <span slot="text">存管账户</span>
        </grids-item>
        <grids-item link="/account/certification" v-if="this.accountInfo.status == 'un_auth' || this.accountInfo.status == 'authing'">
          <i slot="icon" class="icon-guide -bankcard"></i> <span slot="text">银行卡</span>
        </grids-item>
        <grids-item @click.native="goBankcard" v-else>
          <i slot="icon" class="icon-guide -bankcard"></i> <span slot="text">银行卡</span>
        </grids-item>
        <grids-item link="/account/settings">
          <i slot="icon" class="icon-guide -setting"></i> <span slot="text">账号设置</span>
        </grids-item>
      </grids-group>
    </div>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        isLogin: false,
        accountInfo: '',
        myFund: {
          formatTotalBalance: '0.00',
          formatMyInterest: '0.00',
          formatAvailableBalance: '0.00'
        },
        show: true,
        isDeposit: false,
        unReadCount: '',
        bankCard: ''
      }
    },
    created() {
      this.getToken()
    },
    methods: {
      getToken() {
        if (localStorage.getItem('token') !== null) {
          this.isLogin = true
          this.getAccount()
        } else {
          this.isLogin = false
        }
      },
      getAccount() {
        //获取账户信息
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/ucMemebe/info').then(res => {
          if (res.success) {
            this.accountInfo = res.result
            if (this.accountInfo.status === 'un_auth' || this.accountInfo.status === 'authing') {
              this.isDeposit = true
            }
            //获取用户资金
            this.getAccountFund()
            this.getUnReadCount()
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
      getAccountFund() {
        // 获取账户余额
        this.axios.get('auth/account/index').then(res => {
          if (res.success) {
            this.myFund = res.result
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      getUnReadCount() {
        this.axios.get('auth/msgMessageLog/unReadCount').then(res => {
          if (res.success) {
            this.unReadCount = res.result
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      syncBalance() {
        //获取账户余额
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/finBalance/syncBalance').then(res => {
          if (res.success) {
            this.myFund.formatAvailableBalance = res.result.balancePojo.formatAvailableBalance
            this.getAccountFund()
            if (res.result.isDataAdd) {
              this.$dialog.toast({mes: '查询到成功的转账记录'})
            } else {
              this.$dialog.toast({mes: '没有查询到成功的转账记录'})
            }
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      goBankcard() {
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/ucBankCard/certification/appUpdateCard').then(res => {
          if (res.success) {
            //跳转渤海银行
            window.location.href = res.result
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .account-info
    position: relative
    background: #d82d2d url("../../../static/images/account/account_bg.png") no-repeat center top;
    background-size: 100% 1.3rem
    box-shadow: 0 .03rem .3rem rgba(216, 45, 45, .4)
    color #fff
  .account-header
    width 100%
    height: .9rem
    padding .2rem .4rem 0
    color #fff
    .username
      float: left;
      & img
        display inline-block
        margin-right: .1rem
        width .6rem
        height .6rem
        border-radius .6rem
        vertical-align: middle
    .icon-message
      float: right;
      font-size .46rem
      color: #ffbeb8
      position: relative
      &.-dot:after
        content ''
        position: absolute
        right -.05rem
        top: 0
        background: #ffffff;
        border: .02rem solid #f94e3d;
        width .2rem
        height: .2rem
        border-radius .2rem
    .message
      align-items flex-end
      white-space nowrap
      line-height .6rem
  .account-deposit
    position: relative
    height: 4.8rem
    margin-bottom 1.2rem
    background-image: linear-gradient(137deg, #d82d2d 0%, #f94e3d 100%);
    & .account-header
      position absolute
      left 0
      top: 0
      background-color transparent
    & > img
      width 7.5rem
      height: 4.8rem
      margin 0 auto
    .btn-deposit
      position: absolute
      bottom: -.5rem
      left 50%;
      margin-left -3rem
      width 6rem;
      height: 1rem
      background-color #fff;
      border: none
      border-radius: .5rem
      font-size .34rem
      color #d82d2d
      box-shadow: 0 .18rem .4rem rgba(82, 82, 82, 0.10);
  .account-login
    position: relative
    height: 4.8rem
    margin-bottom 1.2rem
    background-image: linear-gradient(137deg, #d82d2d 0%, #f94e3d 100%);
    & img
      width 7.5rem
      height: 4.8rem
      margin 0 auto
    .btn-login
      position: absolute
      bottom: -.5rem
      left 50%;
      margin-left -3rem
      width 6rem;
      height: 1rem
      background-color #fff;
      border: none
      border-radius: .5rem
      font-size .34rem
      color #d82d2d
      box-shadow: 0 .18rem .4rem rgba(82, 82, 82, 0.10);
      display flex
      padding 0 1.2rem
      & a
        flex 1
        display block
        position: relative
        height: 1rem
        line-height 1rem
        text-align center
        &:last-child:before
          content ''
          display block
          position absolute
          left 0
          top: .32rem
          width 1px
          height .35rem
          background-color #d82d2d
  .asset-fund
    display flex
    padding: 1.2rem .4rem
    & dl
      width 50%
    & dt
      font-size .24rem
      color #f5b0b0
    & dd
      padding-top .1rem
      font-size .4rem
      font-weight 500
      color #fff
  .asset-stat
    position relative
    display flex
    margin-bottom .2rem
    padding: .5rem .4rem .4rem
    background-color: #fff
    .balance
      flex 1
      & dt
        position: relative
        color #bbb
        font-size .24rem
        white-space nowrap
        &:before
          font-family 'iconfont'
          content '\e635'
          position absolute
          left 2.2rem
          top: 0
          font-size .38rem
          line-height .32rem
          color #bbb;
      & dd
        padding-top .1rem
        font-size .34rem
        font-weight 500
        color #d82d2d
    .control
      text-align: right
      white-space nowrap
      a
        display block
        float: left;
        width: 1.6rem
        height: .8rem
        border: 1px solid #d82d2d
        border-radius: .4rem
        background-color: #fff
        text-align: center
        line-height: .8rem
        font-size: .36rem
        color: #d82d2d
        white-space: nowrap
        &:last-child
          margin-left: .2rem
  /*border-color: #f9b841*/
  /*color: #f9b841*/

  .account-nav
    .grids-3
      padding: .2rem 0
    .grids-item
      padding: .4rem 0
    .icon-guide
      display block
      width .7rem
      height .64rem
      background-size .64rem .56rem
      background-repeat no-repeat
      background-position center center
      &.-bankcard
        background-image url("../../../static/images/account/bankcard.png")
      &.-coupon
        background-image url("../../../static/images/account/coupon.png")
      &.-deposit
        background-image url("../../../static/images/account/deposit.png")
      &.-fundrecord
        background-image url("../../../static/images/account/fundrecord.png")
      &.-myinvest
        background-image url("../../../static/images/account/myinvest.png")
      &.-setting
        background-image url("../../../static/images/account/setting.png")
  @media screen and (max-width: 340px)
    .account-nav
      .grids-item
        padding: .3rem 0
</style>
