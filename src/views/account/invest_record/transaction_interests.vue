<template>
  <layout>
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
      <span slot="right" style="color: #bbb; font-size: .24rem">{{payType}}</span>
    </navbar>
    <div class="interests-list">
      <div class="interests-item -header">
        <span class="state">状态</span>
        <div class="cycle">计息周期</div>
        <time class="time">回款时间</time>
        <ul class="money">
          <li>应收利息</li>
          <li>应收本金</li>
        </ul>
      </div>
      <div class="interests-item"  v-for="(item,index) in transactionInterests" :class="item.status == 'payed' ? '-success' : ''">
        <dl class="cycle">
          <dt>{{item.periodNum}}期 / {{item.period}}天</dt>
          <dd>{{item.periodSection}}</dd>
        </dl>
        <time class="time" v-if="item.status == 'payed'">{{item.formatRealPayTime}}</time>
        <time class="time" v-else>{{item.formatPayTime}}</time>
        <ul class="money">
          <li>{{item.formatPayableInterest}}元</li>
          <li>{{item.formatPayablePrincipal}}元</li>
        </ul>
      </div>
    </div>
  </layout>
</template>
<script>
  export default {
    data () {
      return {
        accountInfo:'',
        transactionInterests:'',
        payType:''
      }
    },
    created(){
      this.isLogin()
    },
    methods: {
      goBack(){
        this.$router.back()
      },
      isLogin(){
        const _token = localStorage.getItem('token')
        if (_token !== null) {
          const _accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
          if (_accountInfo !== null) {
            this.accountInfo = _accountInfo
            if (this.accountInfo.status === 'un_auth' || this.accountInfo.status === 'authing') {
              this.$router.replace('/account/certification')
            } else {
              this.loadtransactionInterests()
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
      getUserInfo(){
        //获取账户信息
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/ucMemebe/info').then(res => {
          if (res.success) {
            this.accountInfo = res.result
            localStorage.setItem('accountinfo', JSON.stringify(res.result))
            if (this.accountInfo.status === 'un_auth' || this.accountInfo.status === 'authing') {
              this.$router.replace('/account/certification')
            } else {
              this.loadtransactionInterests()
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
      loadtransactionInterests() {
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/myInvest/getTransactionInterests/' + this.$route.query.id).then(res => {
          if (res.success) {
            this.transactionInterests = res.result;
            //定义收益类型
            if(res.result[0].profitType !== undefined){
              this.payType = res.result[0].formatProfitType
            }
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else if(res.error === 'TC_ORDER_TRANSACTION_NOT_EXISTS_ERROR'){
            this.$dialog.confirm({
              mes: res.errorDescription,
              opts: [{
                txt: '返回',
                color: true,
                callback: () => {
                  this.$router.back()
                }
              }]
            });
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        });
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .interests-list
    border-bottom 1px solid #eee
  .interests-item
    position relative
    z-index 0
    padding .3rem .3rem .3rem .8rem
    overflow hidden
    background-color #fff
    color #666
    font-size .28rem
    &:before
      content ''
      position absolute
      left .8rem
      right 0
      bottom: 0
      height: 1px
      background-color #eee
      overflow hidden
    &:after
      content ''
      position absolute
      left .34rem
      top: 0
      z-index 10
      bottom: 0
      width 1px
      background-color #eee
    &:last-child:before
      content normal
    .cycle
      position: relative
      z-index 20
      float: left;
      width 45%
      &:after
        content ''
        position absolute
        left -.53rem
        top: .1rem
        z-index 10
        width .15rem
        height: .15rem
        border-radius .15rem
        background-color #bbb
      dd
        padding-top .15rem
        font-size .2rem
    .time
      float: left;
    .money
      float: right
      text-align: right
      li:last-child
        padding-top .05rem
    &.-header
      height: 1rem
      font-size .24rem
      background-color #D62D2D
      color #fff
      &:after
      &:before
        content normal
      .state
        float: left;
        padding-left .1rem
        width .8rem
        margin-left -.8rem
      .cycle:after
        content normal
      .money
        margin-top -.18rem
    &.-success
      &:after
        background-color #D62D2D
      .cycle
        z-index 30
        &:after
          content '\e603'
          width auto
          height: auto
          font-size .36rem
          top: 0
          left -.64rem
          z-index 20
          font-family iconfont
          color #D62D2D
          background-color #fff
</style>
