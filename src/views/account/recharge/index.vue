<template>
  <layout>
    <div class="tab header-tab bg-white">
      <div class="tab-head">
      <i class="back-icon" @click="goBack()"></i>
      <ul class="tab-nav">
        <li class="tab-nav-item tab-active">
          <router-link to="./recharge">快捷充值</router-link>
        </li>
        <li class="tab-nav-item">
          <router-link to="./bank_transfer_recharge">银行转账</router-link>
        </li>
      </ul>
      </div>
      <div class="tab-panel" style="padding-bottom: .8rem; background-color: #fff">
        <div class="cbhbbank">
          <dl>
            <dt>渤海银行存管账户</dt>
            <dd>{{accountInfo.chargeAccountMask}}</dd>
          </dl>
          <dl>
            <dt>存管账户可用余额</dt>
            <dd>¥{{accountFund.formatAvailableBalance}}</dd>
          </dl>
        </div>
        <cell-group class="cell-recharge" title="充值">
          <cell-item>
            <i slot="icon" style="padding-right: .1rem">￥</i>
            <input slot="right" type="number" maxlength="11" placeholder="请输入充值金额" v-model="amount" number>
          </cell-item>
          <div class="cell-button" style="margin-top: .3rem">
            <ibutton size="large" type="disabled" v-if="amount < 0.01 ">确认提交</ibutton>
            <ibutton size="large" type="primary" @click.native="submitRecharge()" v-else>确认提交</ibutton>
          </div>
          <router-link tag="div" to="/article/help_detail?id=142"
                       style="color:#666; padding-top: .3rem; text-decoration: underline; text-align: center ">
            支持银行及快捷充值限额>
          </router-link>
        </cell-group>
      </div>
    </div>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        accountInfo: '',
        amount: '',
        accountFund: ''
      }
    },
    created() {
      this.isLogin()
    },
//    filters: {
//      cbhbbankfilter: function (value) {
//        var _card = value
//        var _newcard = _card.substring(0, 4) + '********' + _card.slice(-4)
//        return _newcard
//      }
//    },
    methods: {
      goBack() {
        this.$router.push('/account')
      },
      isLogin() {
        const _token = localStorage.getItem('token')
        if (_token !== null) {
          const _accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
          if (_accountInfo !== null) {
            this.accountInfo = _accountInfo
            if (this.accountInfo.status == 'un_auth' || this.accountInfo.status == 'authing') {
              this.$router.replace('/account/certification')
            } else {
              this.getAccountFund()
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
            //判断是否开通存管
            if (this.accountInfo.status === 'un_auth' || this.accountInfo.status === 'authing') {
              this.$router.replace('/account/certification')
            } else {
              this.getAccountFund()
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
        this.axios.get('auth/finBalance/detail').then(res => {
          if (res.success) {
            this.accountFund = res.result
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      // 提交充值
      submitRecharge() {
        if (!global.vMoney.test(this.amount)) {
          this.$dialog.toast({mes: '输入充值金额的格式不正确!'});
          return
        }
        this.$dialog.loading.open('充值中请稍后...');
        this.axios.post('auth/finRechargeLog/certification/appRecharge?amount=' + this.amount).then(res => {
          //判断账户是否过期
          if (res.success) {
            //跳转渤海银行充值
            //document.write(res)
            window.location.href = res.result
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cbhbbank
    margin .3rem .3rem 0
    padding .3rem .4rem
    height: 2rem
    border-radius .3rem .3rem 0 0
    background-image: linear-gradient(128deg, #F93251 17%, #F95538 100%);
    box-shadow: 0 3px 15px 0 rgba(216, 44, 44, 0.15), 0 3px 5px 0 rgba(216, 45, 45, 0.19);
    dl
      padding-top .22rem
      overflow hidden
      font-size .28rem
      color #fff
      dt
        float: left;
      dd
        float: right;

  .cell-recharge
    padding-top .6rem
    background: #FFFFFF;
    box-shadow: 0 -4px 5px 0 rgba(0, 0, 0, 0.08);
    .cell-right
      input
        line-height .88rem
        font-size .5rem
        &::-webkit-input-placeholder
          font-size .3rem
    .cell-title
      padding-bottom .3rem
</style>
