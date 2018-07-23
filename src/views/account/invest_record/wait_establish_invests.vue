<template>
  <layout>
    <div class="tab header-tab">
      <div class="tab-head">
        <i class="back-icon" @click="goBack()"></i>
        <ul class="tab-nav">
          <li class="tab-nav-item tab-active">投资中</li>
          <li class="tab-nav-item">
            <router-link to="./hold_invests">持有中</router-link>
          </li>
          <li class="tab-nav-item">
            <router-link to="./repay_invests">已还款</router-link>
          </li>
          <li class="tab-nav-item">
            <router-link to="./other_invests">其他</router-link>
          </li>
        </ul>
      </div>
      <div class="tab-panel">
        <div class="notavailable" v-show="waitEstablishInvests.length == 0">
          <img src="../../../../static/images/notavailable/not_invest_setup.png" alt="暂无投资中项目~" class="not_icon">
          <p class="not_txt">暂无投资中项目~</p>
          <router-link to="/product" class="btn btn-hollow">去投资吧</router-link>
        </div>
        <infinitescroll class="invest-record" :on-infinite="getWaitEstablishInvests" ref="getWaitEstablishInvests"
                        v-show="waitEstablishInvests.length !== 0">
          <div class="invest-list" slot="list">
            <div class="invest-item" v-for="item in waitEstablishInvests">
              <div class="invest-main">
                <div class="project-number">订单编号  {{item.transactionNo}}</div>
                <div class="project-info -data">
                  <header class="project-header">
                    <router-link tag="h3" :to="'/product/'+item.projectId" class="project-title">{{item.projectName}}
                    </router-link>
                    <div class="project-progress -processing" v-if="item.status === 'processing'">
                      <span>投资处理中</span></div>
                    <div class="project-progress" v-else-if="item.status === 'success' && item.formatCountDown > 0">
                      <i class="i-progress"
                         :style="{width: item.projectInvestAmount * 100 / item.totalAmount +'%'}"></i><span>募集进度{{(item.projectInvestAmount * 100 / item.totalAmount).toFixed(2)}}%</span>
                    </div>
                    <div class="project-progress" v-else-if="item.status === 'success' && item.formatCountDown == 0">
                      <i class="i-progress"></i><span>募集进度100%</span></div>
                    <div class="project-progress" v-else><i class="i-progress"></i><span>募集已截止</span></div>
                  </header>
                  <ul class="project-prop">
                    <li><label>项目期限</label><span>{{item.period}}天</span></li>
                    <li>
                      <label>预期年化</label><span>{{item.formatExpectAnnualizedRate}}%</span><span
                      v-if="item.platFormRate !== 0">+{{item.formatPlatFormRate}}%</span><span
                      v-if="item.extraAnnualizedRate !== 0">+<i class="-award"
                                                                @click="couponCodeProfit(item)">{{item.formatExtraAnnualizedRate}}%</i></span>
                    </li>
                    <li>
                      <label>投资金额</label><span>{{item.formatInvestAmount}}元<em v-if="item.usedCouponAmount !== 0">(含红包<i
                      class="-award" @click="couponCodeCash(item)">{{item.usedCouponAmount}}元</i>)</em></span>
                    </li>
                    <li><label>预期收益</label><span>{{item.formatTotalInterest}}元</span></li>
                  </ul>
                  <ul class="project-prop -gray">
                    <li><label>投资时间</label><span>{{item.transactionTime}}</span></li>
                    <li>
                      <label>成立日期</label><span
                      v-if="item.formatCountDown <= 0 || item.projectInvestAmount * 100 / item.totalAmount == 100">{{item.formatEstablishTime}}</span><span
                      v-else>募集期截止或项目100%募集</span>
                    </li>
                    <li v-if="item.formatCountDown <= 0 || item.projectInvestAmount * 100 / item.totalAmount == 100">
                      <label>到期日期</label><span>{{item.formatEndDate}}</span></li>
                    <!--<li v-else-if="item.status !== 'processing'"><label>募集截止</label>-->
                    <!--<countdown :time="item.formatCountDown" timetype="second">-->
                    <!--<i>{%d}</i>天 <i>{%h}</i>时 <i>{%m}</i>分 <i>{%s}</i>秒-->
                    <!--</countdown>-->
                    <!--</li>-->
                  </ul>
                  <div class="project-data">

                    <!--<div class="project-steps" :class="[item.status === 'processing' ? '-processing' : '',item.icProjectStatus === 'collection_end' ? '-payed' : '',item.status === 'success' ? '-success' : '']">-->
                    <div class="project-steps -processing" v-if="item.status === 'processing'">
                      <dl>
                        <dd></dd>
                        <dt>投资处理中</dt>
                      </dl>
                      <dl>
                        <dd></dd>
                        <dt>投资成功</dt>
                      </dl>
                      <dl>
                        <dd></dd>
                        <dt>成立待放款</dt>
                      </dl>
                    </div>
                    <div class="project-steps -payed" v-else-if="item.icProjectStatus === 'collection_end'">
                      <dl>
                        <dd></dd>
                        <dt>投资处理中</dt>
                      </dl>
                      <dl>
                        <dd></dd>
                        <dt>投资成功</dt>
                      </dl>
                      <dl>
                        <dd></dd>
                        <dt>成立待放款</dt>
                      </dl>
                    </div>
                    <div class="project-steps -success" v-else>
                      <dl>
                        <dd></dd>
                        <dt>投资处理中</dt>
                      </dl>
                      <dl>
                        <dd></dd>
                        <dt>投资成功</dt>
                      </dl>
                      <dl>
                        <dd></dd>
                        <dt>成立待放款</dt>
                      </dl>
                    </div>
                  </div>
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
    data() {
      return {
        waitEstablishInvests: '',
        page: 0,
        size: 10,
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
          const _accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
          if (_accountInfo !== null) {
            this.accountInfo = _accountInfo
            if (this.accountInfo.status === 'un_auth' || this.accountInfo.status === 'authing') {
              this.$router.replace('/account/certification')
            } else {
              this.getWaitEstablishInvests()
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
            if (this.accountInfo.status === 'un_auth') {
              this.$router.replace('/account/certification')
            } else {
              this.getWaitEstablishInvests()
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
      getWaitEstablishInvests() {
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/myInvest/getWaitEstablishInvests?page=' + this.page + '&size=' + this.size).then(res => {
          if (res.success) {
            var _waitEstablishInvests = res.result.content;
            if (_waitEstablishInvests === undefined) {
              _waitEstablishInvests = null
            } else {
              for (var i = 0; i < _waitEstablishInvests.length; i++) {
                if (_waitEstablishInvests[i].remark !== undefined) {
                  _waitEstablishInvests[i].ismark = false;
                }
              }
            }
            this.waitEstablishInvests = [...this.waitEstablishInvests, ...(_waitEstablishInvests || [])];
            if (_waitEstablishInvests === null || _waitEstablishInvests.length < this.size || this.page === 10) {
              // 所有数据加载完毕
              this.$refs.getWaitEstablishInvests.$emit('cf.infinitescroll.loadedDone');
              return;
            }
            // 单次请求数据完毕
            this.$refs.getWaitEstablishInvests.$emit('cf.infinitescroll.finishLoad');
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
      couponCodeCash(item) {
        this.$dialog.toast({mes: '<p style="font-size: .22rem">红包编号：' + item.couponCodeCash + '</p>'})
      },
      couponCodeProfit(item) {
        this.$dialog.toast({mes: '<p style="font-size: .22rem">加息券编号：' + item.couponCodeProfit + '</p>'})
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../assets/stylus/invest_record.styl"
  .project-steps
    position: relative
    margin 0 .78rem
    &:before,
    &:after
      content ''
      display block
      overflow hidden
      height .04rem
      position absolute
      z-index 1
      width 100%
      top .4rem
      background-color #ddd
    dl
      position absolute
      z-index 2
      top: .2rem
      width 1.5rem
      font-size .24rem
      text-align: center;
      color #bbb
      dd
        position relative
        display: flex;
        text-align: center;
        align-items center
        justify-content center
        margin 0 auto .12rem
        padding-top .4rem
        &:after
          position: absolute
          top: 0
          width .5rem
          left 50%
          margin-left -.25rem
          z-index 4
          color #ddd
          font-family 'iconfont'
          content: "\e64f";
          font-size .44rem
        &:before
          position absolute
          top: .05rem
          z-index 3
          content ''
          width .3rem
          height .3rem
          border-radius .3rem
          left: 50%
          margin-left -.15rem
          background-color #fff
      &:nth-child(1)
        left: -.78rem
      &:nth-child(2)
        left 50%
        margin-left -.75rem
        & dd
          &:after
            content: "\e651";
      &:nth-child(3)
        right: -.78rem
        & dd
          &:after
            content: "\e652";
    &.-processing:before
    &.-success:before
    &.-payed:before
      z-index 2
      width 25%
      background-color #DC4646
    &.-success:before
      width 75%
    &.-payed:before
      width 100%
    &.-processing
    &.-success
    &.-payed
      & dl:nth-child(1)
        & dd
          &:after
            color #DC4646
        & dt
          color #DC4646
    &.-processing
      & dl:nth-child(1)
        & dd
          &:after
            font-size .52rem
            content '\e650'
        & dt
          color #DC4646
    &.-success dl:nth-child(2)
    &.-payed dl:nth-child(2)
    &.-payed dl:nth-child(3)
      & dd
        &:after
          color #DC4646
      & dt
        color #DC4646
    &.-success dl:nth-child(1)
      & dd
        &:after
          color #DC4646
          content '\e64f'
      & dt
        color #bbb
    &.-success dl:nth-child(2)
      & dd
        &:after
          content '\e653'
          font-size .52rem
    &.-payed dl:nth-child(1)
      & dd
        &:after
          content '\e64f'
      & dt
        color #bbb
    &.-payed dl:nth-child(2)
      & dt
        color #bbb
    &.-payed dl:nth-child(3)
      & dd
        &:after
          content '\e654'
          font-size .52rem
</style>
