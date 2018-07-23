<template>
  <layout>
    <div class="tab header-tab bg-white">
      <div class="tab-head">
      <i class="back-icon" @click="goBack()"></i>
      <ul class="tab-nav">
        <li class="tab-nav-item">
          <router-link to="./recharge">快捷充值</router-link>
        </li>
        <li class="tab-nav-item tab-active">
          <router-link to="./bank_transfer_recharge">银行转账</router-link>
        </li>
      </ul>
      </div>
      <div class="tab-panel bank-transfer">
        <div class="transfer-box">
          <h3 class="title">一.充值方式</h3>
          <div class="info">
            <div class="info-about">使用<span>存管开户人名下银行卡</span>通过以下方式实现充值</div>
            <div class="info-tips">(不支持ATM、支付宝、微信)</div>
            <ul class="transfer-way">
              <li><i class="icon-zhuanzhang-wangyin"></i><span>网银</span></li>
              <li><i class="icon-zhuanzhang-shoujiyinhang"></i><span>手机银行</span></li>
              <li><i class="icon-zhuanzhang-guitai"></i><span>柜台转账</span></li>
            </ul>
          </div>
        </div>
        <div class="transfer-box">
          <h3 class="title">二.填写信息</h3>
          <div class="info">
            <div class="info-about">需填写收款人信息如下</div>
            <table class="transfer-table">
              <tr>
                <th>收款方</th>
                <td>{{accountInfo.trueName}}</td>
              </tr>
              <tr>
                <th>收款账号</th>
                <td>{{accountInfo.chargeAccount}}</td>
              </tr>
              <tr>
                <th>收款开户行</th>
                <td>渤海银行杭州分行</td>
              </tr>
            </table>
            <button class="btn-copy-account" @click="copyAccount()" :data-clipboard-text="accountInfo.chargeAccount">
              复制账号
            </button>
          </div>
        </div>
        <div class="transfer-box">
          <h3 class="title">三.同步余额</h3>
          <div class="info">
            <div class="info-about">完成充值后点击同步按钮进行同步</div>
            <button class="btn-sync" @click="syncBalance()">同步余额</button>
          </div>
        </div>
        <!--温馨提示-->
        <div class="warm-prompt inherit">
          <dl>
            <dt>温馨提示：</dt>
            <dd>需使用本人的银行卡转账，资金一般2小时内到账，具体视银行处理进度而定；</dd>
            <dd>充值过程中收取的转账费用，以银行规定为准，平台不收取任何手续费；</dd>
            <dd>若资金长时间不到账，请联系长富理财客服：<a href="tel:4000998799">400-099-8799</a>；</dd>
          </dl>
        </div>
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
        amount: '',
        accountFund: '',
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
          const _accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
          if (_accountInfo !== null) {
            this.accountInfo = _accountInfo
            if (this.accountInfo.status === 'un_auth' || this.accountInfo.status === 'authing') {
              this.$router.replace('/account/certification')
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
      syncBalance() {
        this.$dialog.loading.open('余额同步中...');
        this.axios.get('auth/finBalance/syncBalance').then(res => {
          if (res.success) {
            if (res.result.isDataAdd) {
              this.$dialog.confirm({
                title: '渤海银行',
                mes: '查询到成功的转账记录',
                opts: [
                  {
                    txt: '确定',
                    color: true
                  }
                ]
              });
            } else {
              this.$dialog.confirm({
                title: '渤海银行',
                mes: '没有查询到成功的转账记录',
                opts: [
                  {
                    txt: '确定',
                    color: true
                  }
                ]
              });
            }
          }
        })
      },
      copyAccount() {
        var _this = this
        var clipboard = new Clipboard('.btn-copy-account');
        clipboard.on('success', function (e) {
          _this.$dialog.toast({mes: '复制成功！'})
          e.clearSelection();
        });
        clipboard.on('error', function (e) {
          _this.$dialog.toast({mes: '当前浏览器不支持复制功能，请下载长富理财APP！', timeout: 3000})
        });
      },
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .bank-transfer
    padding: 1.15rem .3rem .3rem !important
    background-color #f5f5f5 !important
    .transfer-box
      padding .3rem
      margin-bottom .3rem
      background-color #fff
      .title
        font-size .3rem
        text-align: center
      .info
        text-align: center;
        padding .2rem 0 .3rem

        .info-about
          padding-bottom .2rem
          text-align: center
          color #999
          span
            color #D82D2D
        .info-tips
          font-size .24rem
          color #bbb
        .transfer-way
          display flex
          padding-top .3rem
          li
            flex 1
            i
              display block
              margin 0 auto
              width .8rem
              height .8rem
              line-height .8rem
              border-radius .8rem
              border: 1px solid #F8D9D9
              &:before
                font-size .4rem
                color #D82D2D
            span
              display inline-block
              padding-top .1rem
              font-size .24rem
              color #666
        .transfer-table
          margin-bottom .2rem
          font-size .24rem
          color #666
          width 100%
          border-collapse: collapse
          border-spacing: 0
          th
          td
            padding .15rem
            border 1px solid #D8D8D8
          td
            text-align: center
        .btn-copy-account
          margin 0 auto
          padding 0 .2rem
          height .6rem
          font-size .28rem
          color #F9B841
          border: 1px solid #ddd
          border-radius .6rem
        .btn-sync
          margin 0 auto
          width 3rem
          height .8rem
          font-size .28rem
          color #D82D2D
          border: 1px solid #D82D2D;
          border-radius: .8rem;

    .inherit
      padding 0


</style>
