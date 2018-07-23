<template>
  <layout>
  <div class="tab header-tab bg-white">
    <div class="tab-head">
    <i class="back-icon" @click="goBack()"></i>
    <ul class="tab-nav">
      <li class="tab-nav-item">
        <router-link to="./cash">实时提现</router-link>
      </li>
      <li class="tab-nav-item tab-active">
        <router-link to="./large_cash">大额提现</router-link>
      </li>
    </ul>
    </div>
    <div class="tab-panel" style="padding-bottom: 2.8rem; background-color: #fff">
      <div class="bankcard" v-if="bankCard.cardNumberMark !== undefined">
        <label>卡号</label><span>{{bankCard.cardNumberMark | bankcardfilter}}</span></div>
      <router-link tag="div" class="bankcard text-center" to="/account/bankcard/bind_card" v-else>立即绑定银行卡</router-link>
      <cell-group class="cell-cash" title="提现金额">
        <cell-item>
          <input slot="right" type="number" :placeholder="'本次最多可提现¥' + myFund.formatAvailableBalance" v-model="money" number>
          <span slot="right" class="btn-cell-special" @click="cashAll">全部提现</span>
        </cell-item>
        <i></i>
      </cell-group>
      <cell-group class="cell-cash" title="联行行号">
        <cell-item>
          <input slot="right" type="text" maxlength="12" placeholder="请输入开户行联行行号" v-model="cardBankCanps" number>
          <router-link to="/article/notice/110" tag="span" slot="right" class="btn-cell-special">如何查询联行行号？</router-link>
        </cell-item>
        <div class="cell-button">
          <ibutton size="large" type="disabled" v-if="money < 0.01 || money > myFund.availableBalance || cardBankCanps.length != 12">确认提现</ibutton>
          <ibutton size="large" type="primary" @click.native="submitCash()" v-else>确认提现</ibutton>
        </div>
      </cell-group>
      <div class="warm-prompt">
        <dl>
          <dd>大额提现
            <table class="cash-table thin">
              <thead>
              <tr>
                <th>提现金额</th>
                <th>支持银行</th>
                <th>提现时间</th>
                <th>到账时间</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>无限制</td>
                <td>无限制</td>
                <td>9:30-16:30</td>
                <td>T＋1(工作日)</td>
              </tr>
              </tbody>
            </table>
          </dd>
          <dd>平台限定每天最多可提现6笔，提现暂不收取手续费；</dd>
          <dd>如操作中出现问题，请拨打客服热线<br><a href="tel:4000998799">400-099-8799</a>。</dd>
        </dl>
      </div>
    </div>
  </div>
  </layout>
</template>
<script>
  export default {
    data () {
      return {
        accountInfo: '',
        bankCard: '',
        myFund: '',
        money: '',
        banCardId: '',
        cardBankCanps: ''
      }
    },
    created(){
      this.isLogin()
    },
    filters: {
      bankcardfilter: function (value) {
        var _card = value
        var _newcard = _card.substring(0,4) + ' '+ _card.substring(4,_card.length-4) + ' ' + _card.slice(-4)
        return _newcard
      }
    },
    methods: {
      goBack(){
        this.$router.back()
      },
      isLogin(){
        const _token = localStorage.getItem('token')
        if(_token !== null){
          const _accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
          if (_accountInfo !== null) {
            this.accountInfo = _accountInfo
            if (this.accountInfo.status === 'un_auth' || this.accountInfo.status === 'authing') {
              this.$router.replace('/account/certification')
            } else {
              this.isCertification()
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
              this.isCertification()
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
      isCertification(){
        if (this.accountInfo.status === 'un_auth') {
          this.$router.replace('/account/certification')
        } else if (this.accountInfo.jxbkPasswordFlag === false) {
          this.$dialog.confirm({
            mes: '您尚未设置交易密码，设置后方可进行相应操作。',
            opts: [{
              txt: '取消',
              color: true
            }, {
              txt: '立即设置',
              color: true,
              callback: () => {
                this.setPayPassword()
              }
            }]
          });
        } else {
          this.getAccountFund()
          this.getBankCard()
        }
      },
      getBankCard(){
        //获取用户默认银行卡号接口
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/ucBankCard/certification/defaultCard').then(res => {
          if (res.success) {
            this.bankCard = res.result;
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else {
            this.bankCard = ""
            this.$dialog.confirm({
              mes: '您尚未绑定银行卡，绑卡后方可进行相应操作？',
              opts: [{
                txt: '取消',
                color: true,
              }, {
                txt: '立即绑定',
                color: true,
                callback: () => {
                  this.$router.push('/account/bankcard/bind_card')
                }
              }]
            });
          }
        })
      },
      getAccountFund(){
        // 获取我的账户资产
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
      //设置交易密码
      setPayPassword(){
        this.$dialog.loading.open('前往银行存管设置...');
        this.axios.post('auth/ucMemebe/certification/passwordSet').then(res => {
          document.write(res)
        })
      },
      // 全部提现按钮
      cashAll(){
        if (this.myFund.availableBalance >= 1) {
          this.money = this.myFund.availableBalance
        } else {
          this.$dialog.toast({mes: '您的可用余额不足'});
        }
      },
      // 提交提现
      submitCash(){
        if (!global.vMoney.test(this.money)) {
          this.$dialog.toast({mes: '金额的输入格式不正确'});
          return
        }
        this.$dialog.loading.open('前往江西银行继续操作...');
        this.axios.post('auth/finWithdrawLog/certification/withdraw?amount=' + this.money + '&cardBankCanps=' + this.cardBankCanps).then(res => {
          document.write(res)
        })
      },
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .cash-table
    width 100%
    border-collapse: collapse
    border-spacing: 0
    border: 1px solid #d82d2d
    color: #d82d2d
    font-size .22rem
    margin .1rem 0
    thead
      background-color: #fdf3f3;
    th,
    td
      padding .1rem
      text-align: center
      border: 1px solid #d82d2d
    &.thin
      border-color: #e2cdcd
      color #d69494
      th
      td
        border-color: #e2cdcd
      .-scoped-text
        color #d82d2d
  .bankcard
    margin .3rem .3rem .6rem
    padding .3rem
    height 1.4rem
    background: #fdf3f3;
    border: 1px solid #d82d2d;
    border-radius: .1rem;
    font-size: .28rem
    color: #d82d2d;
    line-height .8rem
    label
      display inline-block
      width 1.4rem
    span
      letter-spacing .05rem
</style>
