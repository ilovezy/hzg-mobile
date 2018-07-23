<template>
  <layout>
  <div class="tab header-tab">
    <div class="tab-head">
      <i class="back-icon" @click="goBack()"></i>
      <ul class="tab-nav">
        <li class="tab-nav-item"><router-link to="./wait_establish_invests">投资中</router-link></li>
        <li class="tab-nav-item"><router-link to="./hold_invests">持有中</router-link></li>
        <li class="tab-nav-item"><router-link to="./repay_invests">已还款</router-link></li>
        <li class="tab-nav-item tab-active">其他</li>
      </ul>
    </div>
    <div class="tab-panel">
      <div class="notavailable" v-show="this.otherInvests.length == 0">
        <img src="../../../../static/images/notavailable/not_available.png" alt="暂无数据~" class="not_icon">
        <p class="not_txt">暂无数据~</p>
        <router-link to="/product" class="btn btn-hollow">去投资吧</router-link>
      </div>
      <infinitescroll class="invest-record" :on-infinite="getOtherInvests" ref="getOtherInvests" v-show="this.otherInvests.length !== 0">
        <div class="invest-list" slot="list">
          <div class="invest-item" v-for="item in otherInvests">
            <div class="invest-main">
              <div class="project-number">订单编号  {{item.transactionNo}}</div>
              <div class="project-info">
                <header class="project-header">
                  <router-link tag="h3" :to="'/product/'+item.projectId" class="project-title">{{item.projectName}}</router-link>
                  <div class="project-progress" v-if="item.status === 'processing'">
                    <i class="i-progress"></i><span>投资处理中</span></div>
                  <div class="project-progress -failure" v-else-if="item.status === 'failed'"><i class="i-progress"></i><span>失败</span><i v-if="item.remarks !== undefined" class="icon-question" @click="toggleMark(item)"></i>
                    <div class="project-remarks" v-show="item.ismark">{{item.remarks}}</div>
                  </div>
                </header>
                <ul class="project-prop">
                  <li><label>项目期限</label><span>{{item.period}}天</span></li>
                  <li>
                    <label>预期年化</label><span>{{item.formatExpectAnnualizedRate}}%</span><span v-if="item.platFormRate !== 0">+{{item.formatPlatFormRate}}%</span><span v-if="item.extraAnnualizedRate !== 0">+<i class="-award" @click="couponCodeProfit(item)">{{item.formatExtraAnnualizedRate}}%</i></span>
                  </li>
                  <li>
                    <label>投资金额</label><span>{{item.formatInvestAmount}}元<em v-if="item.usedCouponAmount !== 0">(含红包<i class="-award" @click="couponCodeCash(item)">{{item.usedCouponAmount}}元</i>)</em></span>
                  </li>
                  <!--<li><label>预期年化</label><span>{{item.formatExpectAnnualizedRate}}%</span><span v-if="item.platFormRate !== 0">+{{item.formatPlatFormRate}}%</span><span class="-red" v-if="item.extraAnnualizedRate !== 0">+{{item.formatExtraAnnualizedRate}}%</span></li>-->
                  <!--<li><label>投资金额</label><span>{{item.formatInvestAmount}}元<em v-if="item.usedCouponAmount !== 0">(含红包{{item.formatUsedCouponAmount}}元)</em></span></li>-->
                </ul>
                <ul class="project-prop -gray">
                  <li><label>投资时间</label><span>{{item.transactionTime}}</span></li>
                </ul>
              </div>
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
        otherInvests: '',
        page: 0,
        size: 10,
        accountInfo: ''
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
              this.getOtherInvests()
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
              this.getOtherInvests()
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
      getOtherInvests(){
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/myInvest/getOtherInvests?page=' + this.page + '&size=' + this.size).then(res => {
          if (res.success) {
            var _otherInvests = res.result.content;
            if(_otherInvests === undefined){
              _otherInvests = null
            } else {
              for (var i = 0; i < _otherInvests.length; i++) {
                if (_otherInvests[i].remarks !== undefined) {
                  _otherInvests[i].ismark = false;
                }
              }
            }
            this.otherInvests = [...this.otherInvests, ...(_otherInvests || [])];
            if (_otherInvests === null || _otherInvests.length < this.size || this.page === 10) {
              // 所有数据加载完毕
              this.$refs.getOtherInvests.$emit('cf.infinitescroll.loadedDone');
              return;
            }
            // 单次请求数据完毕
            this.$refs.getOtherInvests.$emit('cf.infinitescroll.finishLoad');
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
      toggleMark(item){
        item.ismark = !item.ismark
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
