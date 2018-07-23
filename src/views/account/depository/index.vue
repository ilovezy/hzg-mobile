<template>
  <layout>
    <navbar :title="$route.meta.title" slot="navbar" style="background-color: #f5f5f5">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="depository">
      <div class="depository-logo">渤海银行</div>
      <div class="depository-card">
        <div class="card-title">渤海银行</div>
        <dl>
          <dt><span>存管账号</span></dt>
          <dd class="card-data">{{accountInfo.chargeAccount}}</dd>
          <dd class="card-clip" @click="clipboardJxbankCard()" :data-clipboard-text="accountInfo.chargeAccount">复制</dd>
        </dl>
        <ul>
          <li>开户银行： 渤海银行杭州分行</li>
          <li>开户人： {{accountInfo.trueName}}</li>
        </ul>
      </div>
      <div class="depository-data">
        <h3>存管账户余额</h3>
        <div class="money" @click="syncBalance()"><span>¥{{myFund.formatBalance}}</span> <i class="refresh"></i>
        </div>
        <p>存管账户可用余额¥{{myFund.formatAvailableBalance}}</p>
      </div>
    </div>
  </layout>
</template>
<script>
  var Clipboard = require('clipboard')
  export default {
    data() {
      return {
        accountInfo: '',
        bankCard: '',
        cardNumber: '',
        myFund: ''
      }
    },
    created() {
      this.isLogin()
    },
    methods: {
      goBack() {
        this.$router.push('/account')
      },
      //复制银行卡
      clipboardJxbankCard() {
        var _this = this
        var clipboard = new Clipboard('.card-clip');
        clipboard.on('success', function (e) {
          _this.$dialog.toast({mes: '复制成功！'})
          e.clearSelection();
        });
        clipboard.on('error', function (e) {
          _this.$dialog.toast({mes: '当前浏览器不支持复制功能，请下载长富理财APP！', timeout: 3000})
        });
      },
      isLogin() {
        const _token = localStorage.getItem('token')
        if (_token !== null) {
          this.getUserInfo()
        } else {
          localStorage.clear()
          this.$router.replace('/login')
        }
      },
      getUserInfo() {
        //获取账户信息
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/ucMemebe/info').then(res => {
          if (res.success) {
            this.accountInfo = res.result
            localStorage.setItem('accountinfo', JSON.stringify(res.result))
            if (this.accountInfo.status === 'authed') {
              this.getAccountFund()
            } else {
              this.$router.push('/account')
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
      getAccountFund() {
        // 获取账户余额
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/finBalance/detail').then(res => {
          if (res.success) {
            this.myFund = res.result
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
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
            this.myFund = res.result.balancePojo
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
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .depository
    padding-bottom 1rem
  .depository-logo
    height: 2.5rem
    overflow hidden
    text-indent -999em
    background-image url("../../../../static/images/account/cbhbbank_logo.png")
    background-size 4.1rem .78rem
    background-repeat no-repeat
    background-position center center

  .depository-card
    position relative
    z-index 2
    margin 0 .3rem
    padding: .4rem
    background-image: linear-gradient(-214deg, #0A2C58 0%, #072C57 100%);
    box-shadow: 0 .2rem .3rem 0 rgba(56, 58, 73, 0.2), 0 .06rem .1rem 0 rgba(51, 52, 65, 0.2);
    border-radius: 5px;
    color #fff
    &:before
      content ''
      position absolute
      right: .4rem
      top: .4rem
      width 1.6rem
      height: .92rem
      background url("/static/images/account/cbhbbank_bg.png") no-repeat
      background-size contain
    .card-title
      position relative
      font-size .4rem
      color #fff
      padding-bottom .5rem
      &:before
        position absolute
        top .55rem
        left 0
        content 'CHINA BOHAI BANK'
        opacity: 0.2;
        font-size: .2rem
        color: #FFF
    dl
      padding .5rem 0
      dt
        text-align: center;
        color rgba(255, 255, 255, .5)
        background: url("/static/images/account/cbhbbank_title_bg.png") repeat-x left center;
        background-size .08rem .28rem
        span
          display inline-block
          padding 0 .2rem
          background-color #0A2C58
      dd.card-data
        padding-top .1rem
        text-align: center;
        font-size: .34rem;
      dd.card-clip
        padding-top .1rem
        text-align: right;
        font-size .22rem
        color: #6E8093
    ul
      font-size .22rem
      opacity .6
      li
        padding-top .1rem

  .depository-data
    z-index 1
    position: relative
    margin 0 .6rem
    padding: .6rem 0 .3rem
    text-align: center
    box-shadow: 0 .06rem .1rem 0 rgba(195, 195, 195, 0.3);
    background #FFFFFF
    &:before
      content ''
      position absolute
      bottom -.3rem
      left: 0
      right: 0
      background url("/static/images/account/cbhbbank_box_bg.png") repeat-x bottom center
      background-size .4rem .32rem
      height .32rem
    h3
      padding-bottom .1rem
      font-size .22rem
      font-weight normal
    .money
      position relative
      span
        vertical-align: middle
        font-size .48rem
        font-weight 500
      i.refresh
        margin-left .1rem
        vertical-align: middle
        font-size .46rem
        &:before
          font-family: iconfont;
          content: "\E635";
          font-size: .36rem;
          line-height: .4rem;
          color: #101010
    p
      padding-top .2rem
      font-size: .22rem
      color: #999999
</style>
