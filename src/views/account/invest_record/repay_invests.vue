<template>
  <layout>
  <div class="tab header-tab">
    <div class="tab-head">
      <i class="back-icon" @click="goBack()"></i>
      <ul class="tab-nav">
        <li class="tab-nav-item"><router-link to="./wait_establish_invests">投资中</router-link></li>
        <li class="tab-nav-item"><router-link to="./hold_invests">持有中</router-link></li>
        <li class="tab-nav-item tab-active">已还款</li>
        <li class="tab-nav-item"><router-link to="./other_invests">其他</router-link></li>
      </ul>
      <div class="invests-total -repay">
        <dl>
          <dd>{{fund.formatReceivedPrincipal}}元</dd>
          <dt>累计已收本金</dt>
        </dl>
        <dl>
          <dd>{{profit.formatPayedInterest}}元</dd>
          <dt>累计已收利息</dt>
        </dl>
      </div>
    </div>
    <div class="tab-panel">
      <div class="notavailable" v-show="repayInvests.length == 0">
        <img src="../../../../static/images/notavailable/not_invest_setup.png" alt="暂无已还款项目~" class="not_icon">
        <p class="not_txt">暂无已还款项目~</p>
        <router-link to="/product" class="btn btn-hollow">去投资吧</router-link>
      </div>
      <infinitescroll class="invest-record -special" :on-infinite="getRepayInvests" ref="getRepayInvests" v-show="repayInvests.length !== 0">
        <div class="invest-list" slot="list">
          <div class="invest-item" v-for="item in repayInvests">
            <div class="invest-main">
              <div class="project-number">订单编号  {{item.transactionNo}}</div>
              <div class="project-info  -data">
                <header class="project-header">
                  <router-link tag="h3" :to="'/product/'+item.projectId" class="project-title">{{item.projectName}}</router-link>
                </header>
                <ul class="project-prop">
                  <li><label>项目期限</label><span>{{item.period}}天</span></li>
                  <li>
                    <label>预期年化</label><span>{{item.formatExpectAnnualizedRate}}%</span><span v-if="item.platFormRate !== 0">+{{item.formatPlatFormRate}}%</span><span v-if="item.extraAnnualizedRate !== 0">+<i class="-award" @click="couponCodeProfit(item)">{{item.formatExtraAnnualizedRate}}%</i></span>
                  </li>
                  <li>
                    <label>投资金额</label><span>{{item.formatInvestAmount}}元<em v-if="item.usedCouponAmount !== 0">(含红包<i class="-award" @click="couponCodeCash(item)">{{item.usedCouponAmount}}元</i>)</em></span>
                  </li>
                  <li><label>合计收益</label><span>{{item.formatTotalInterest}}元</span></li>
                </ul>
                <div class="project-data">
                  <div class="project-time">
                    <dl>
                      <dt>投资时间</dt>
                      <dd>{{item.transactionTime}}</dd>
                    </dl>
                    <dl>
                      <dt>项目成立日</dt>
                      <dd>{{item.formatEstablishTime}}</dd>
                    </dl>
                    <dl>
                      <dt>项目到期日</dt>
                      <dd>{{item.formatEndDate}}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div class="invest-control">
              <router-link :to="{ path: '/protocol/borrowing_agreements', query: { id: item.transactionNo }}">查看协议</router-link>
              <router-link :to="{ path: './transaction_interests', query: { id: item.id }}">查看收益表</router-link>
            </div>
          </div>
        </div>
      </infinitescroll>
    </div>

  </div>
  </layout>
</template>
<script>
  export default {
    data () {
      return {
        repayInvests: '',
        page: 0,
        size: 10,
        accountInfo: '',
        profit: '',
        fund:''
      }
    },
    created(){
      this.isLogin()
    },
    methods: {
      goBack(){
        this.$router.push('/account')
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
              this.getRepayInvests()
              this.getFund()
              this.getProfit()
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
              this.getRepayInvests()
              this.getFund()
              this.getProfit()
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
      getRepayInvests(){
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/myInvest/getRepayInvests?page=' + this.page + '&size=' + this.size).then(res => {
          if (res.success) {
            var _repayInvests = res.result.content;
            if(_repayInvests === undefined){
              _repayInvests = null
            } else {
              for (var i = 0; i < _repayInvests.length; i++) {
                if (_repayInvests[i].remark !== undefined) {
                  _repayInvests[i].ismark = false;
                }
              }
            }
            this.repayInvests = [...this.repayInvests, ...(_repayInvests || [])];
            if (_repayInvests === null || _repayInvests.length < this.size || this.page === 10) {
              // 所有数据加载完毕
              this.$refs.getRepayInvests.$emit('cf.infinitescroll.loadedDone');
              return;
            }
            // 单次请求数据完毕
            this.$refs.getRepayInvests.$emit('cf.infinitescroll.finishLoad');
            this.page++
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      getFund(){
        this.axios.get('auth/myFund/index').then(res => {
          if (res.success) {
            this.fund = res.result
          }
        })
      },
      getProfit(){
        this.axios.get('auth/myProfit/index').then(res => {
          if (res.success) {
            this.profit = res.result
          }
        })
      },
      couponCodeCash(item){
        this.$dialog.toast({mes: '<p style="font-size: .22rem">红包编号：' + item.couponCodeCash + '</p>'})
      },
      couponCodeProfit(item){
        this.$dialog.toast({mes: '<p style="font-size: .22rem">加息券编号：' + item.couponCodeProfit + '</p>'})
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../assets/stylus/invest_record.styl"
</style>
