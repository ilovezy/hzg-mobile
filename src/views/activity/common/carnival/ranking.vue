<template>
  <layout :showNavbar="isNavbar">
    <navbar slot="navbar" :title="$route.meta.title">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="carnival-ranking">
      <div class="banner">
        <div class="activity-time">活动时间：{{initData.startTimeStamp | formatDateMD}} - {{initData.endTimeStamp | formatDateMD}}</div>
      </div>
      <div class="prize">
        <ul>
          <li>
            <div class="prize_01"></div>
            <h3>iPhone X/256GB</h3>
            <p class="price">￥9688</p>
          </li>
          <li>
            <div class="prize_02"></div>
            <h3>iRobot智能扫地机器人</h3>
            <p class="price">￥4999</p>
          </li>
          <li>
            <div class="prize_03"></div>
            <h3>OPPO R11 Plus/64GB</h3>
            <p class="price">￥3699</p>
          </li>
          <li>
            <div class="prize_04"></div>
            <h3>小米平衡车</h3>
            <p class="price">￥1999</p>
          </li>
        </ul>
      </div>
      <div class="main">
        <dl class="ranking-time" v-if="activeStatus === 'notstart'">
          <dt>距排位开始</dt>
          <dd>
            <countdown :time="startCountDown" timetype="second" class="top-countdown"
              format="<i>{%d}天</i> : <i>{%h}时</i> : <i>{%m}分</i> : <i>{%s}秒</i>" doneText=""
              :callback="refreshPage"></countdown>
          </dd>
        </dl>
        <dl class="ranking-time" v-else-if="activeStatus === 'start'">
          <dt>排位倒计时</dt>
          <dd>
            <countdown :time="endCountDown" timetype="second" class="top-countdown"
              format="<i>{%d}天</i> : <i>{%h}时</i> : <i>{%m}分</i> : <i>{%s}秒</i>" doneText=""
              :callback="refreshPage"></countdown>
          </dd>
        </dl>
        <dl class="ranking-time" v-else-if="activeStatus === 'end'">
          <dt>排位结束</dt>
          <dd class="top-countdown">0天：00时：00分：00秒</dd>
        </dl>
        <div class="ranking">
          <div class="ranking-list -notrank" v-if="!isRankList"></div>
          <div class="ranking-list" v-else>
            <div class="ranking-title">
              <span class="number">排名</span> <span class="name">手机号</span> <span class="amount">累计年化投资额</span>
            </div>
            <div class="ranking-item" v-for="(item,index) in annualizedInvestRank">
              <span class="number"><i :class="('-num'+(index + 1))"></i></span>
              <span class="name">{{item.mobileMask}}</span> <span class="amount">{{item.totalAmount}}元</span>
            </div>
          </div>
          <dl class="my-invest" v-if="isLogin">
            <dt>我的累计年化投资额</dt>
            <dd>{{myInvest}}元</dd>
          </dl>
          <div class="btn-invest -end" v-if="activeStatus === 'notstart'">活动未开始</div>
          <div class="btn-invest" v-else-if="activeStatus === 'start'" @click="goInvest">立即去投资</div>
          <div class="btn-invest -end" v-else-if="activeStatus === 'end'">活动已结束</div>
        </div>
      </div>
      <div class="rule">
        <h3 class="title">活动说明</h3>
        <ol>
          <li>活动时间：<br>{{initData.startTimeStamp | formatDate}} - {{initData.endTimeStamp | formatDate}}；</li>
          <li>活动期间投资平台任意项目均可参与本次活动，按累计年化投资金额排名，排行榜前10名即可获得相应奖励，<br> <strong>（年化投资额=投资额*项目期限/365）；</strong></li>
          <li>活动期间如遇累计年化投资金额相同的情况，则以用户达到该金额的时间先后进行排序；</li>
          <li>活动奖品将于活动结束后5个工作日内统一联系发放，请保持手机畅通，若错过通知视为放弃获奖资格；</li>
          <li>本活动与苹果公司无关。</li>
        </ol>
        <div class="btn-rule" @click="whyAnnualizedInvest = true">什么是累计年化投资额></div>
      </div>
    </div>
    <div slot="tabbar" class="carnival-menu">
      <ul>
        <li @click="goCarnival" class="-home">首页</li>
        <li @click="goCarnivalRecharge">欢乐<br>充值吧</li>
        <li @click="goCarnivalHot">火热<br>加息场</li>
        <li @click="goCarnivalLottery">幸运<br>大转盘</li>
        <li @click="goCarnivalRanking" class="-current">巅峰<br>排位赛</li>
      </ul>
    </div>
    <popup v-model="whyAnnualizedInvest" class="nhtze" position="center" width="6.8rem">
      <div class="header"></div>
      <div class="body">
        <dl>
          <dt>年化投资额计算公式</dt>
          <dd>年化投资额 = 投资额 * 项目期限 / 365</dd>
        </dl>
        <h4>例：</h4>
        <ul>
          <li>在活动期间</li>
          <li class="-bg">小明投资了30天项目100万，<br>该笔年化投资额为：100万*30/365=82191.78元；</li>
          <li class="-bg">小明继续投资60天项目100万，<br>该笔年化投资额为：100万*60/365=164383.56元；</li>
          <li>小明在活动期间累计年化投资额为：<br>82191.78+164383.56=246575.34元。</li>
        </ul>
      </div>
      <i class="close" @click="whyAnnualizedInvest = false"></i>
    </popup>
    <popup v-model="isLoginPopup" class="isloginPopup" position="center" width="6.5rem">
      <div class="info">您还未登录哦，<br>登录即可参与更多精彩活动啦！<i class="close" @click="isLoginPopup = false"></i><i
        class="decorate -t"></i><i class="decorate -b"></i></div>
      <div class="btn-wrap" @click="goLogin"></div>
    </popup>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        isNavbar: true,
        myInvest: '',
        isMyInvest: false,
        isLogin: false,
        isLoginPopup: false,
        initData: '',
        serverTime: '',
        activeStatus: 'notstart',
        startCountDown: '',
        endCountDown: '',
        annualizedInvestRank: '',
        isRankList: false,
        whyAnnualizedInvest: false,
      }
    },
    created() {
      sessionStorage.setItem("appdown", "false")
      if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
        localStorage.clear()
        this.isNavbar = false
        window.location.href = encodeURI("cflc://jsbridge?type=open&name=show_share_button&share_url=" + window.location.protocol + "//" + window.location.host + "/activity/carnival_ranking&share_qq_weixin_title=长富狂欢节 巅峰排位赛&share_qq_weixin_dec=喜迎存管，冲进排行榜，白拿iPhone X！&share_pyq_dec=庆长富理财银行存管正式上线，免费送您iPhone X！");
      }
      this.getInit()
    },
    methods: {
      goBack() {
        this.$router.push('/activity/carnival')
      },
      getInit() {

        this.axios.get('security/find/activity/bhbk').then(res => {
          if (res.success) {
            this.initData = res.result.modulePojos[3]
            this.serverTime = res.result.serverTime
            if ((this.initData.startTimeStamp - this.serverTime) > 0) {
              this.activeStatus = 'notstart'
            } else if ((this.initData.endTimeStamp - this.serverTime) > 0) {
              this.activeStatus = 'start'
            } else if ((this.initData.endTimeStamp - this.serverTime) < 0) {
              this.activeStatus = 'end'
            }

            //距排位开始
            if ((this.initData.startTimeStamp - this.serverTime) > 0) {
              this.startCountDown = (this.initData.startTimeStamp - this.serverTime) / 1000
            } else {
              this.startCountDown = 0
            }
            //排位倒计时
            if ((this.initData.endTimeStamp - this.serverTime) > 0) {
              this.endCountDown = (this.initData.endTimeStamp - this.serverTime) / 1000
            } else {
              this.endCountDown = 0
            }

            //获取年华投资额
            this.axios.post('auth/finPoint/activity/annualizedAmount/' + this.initData.moduleNo).then(res => {
              if (res.success) {
                this.isLogin = true
                this.myInvest = res.result
              } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
//                this.$dialog.toast({mes: res.errorDescription})
                localStorage.clear()
                this.isLogin = false
              }
            })
          } else if (res.error === 'MC_ACTIVITY_THEME_NOT_EXIST_ERROR') {
            this.$router.replace('/')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
        this.axios.get('security/find/annualizedInvestRank/bhbk_show_only_4?limit=10').then(res => {
          if (res.success) {
            this.annualizedInvestRank = res.result
            if (this.annualizedInvestRank !== undefined) {
              this.isRankList = true
            }
          }
        })
      },
      goInvest() {
        if (this.isLogin) {
          this.goProductList()
        } else {
          this.isLoginPopup = true
        }
      },
      goLogin() {
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          window.location.href = 'cflc://jsbridge?type=action&name=login'
        } else {
          this.$router.push('/login')
        }
      },
      goProductList() {
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          window.location.href = 'cflc://jsbridge?type=open&name=product_list'
        } else {
          this.$router.push('/product')
        }
      },
      refreshPage() {
        //刷新当前页面
        this.$router.go(0)
      },
      goCarnival() {
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          if (this.$route.query.access_token !== undefined) {
            this.$router.push('carnival?os=' + this.$route.query.os + '&access_token=' + this.$route.query.access_token)
          } else {
            this.$router.push('carnival?os=' + this.$route.query.os)
          }
        } else {
          this.$router.push('carnival')
        }
      },
      goCarnivalRecharge() {
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          if (this.$route.query.access_token !== undefined) {
            this.$router.push('carnival_recharge?os=' + this.$route.query.os + '&access_token=' + this.$route.query.access_token)
          } else {
            this.$router.push('carnival_recharge?os=' + this.$route.query.os)
          }
        } else {
          this.$router.push('carnival_recharge')
        }
      },
      goCarnivalHot() {
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          if (this.$route.query.access_token !== undefined) {
            this.$router.push('carnival_hot?os=' + this.$route.query.os + '&access_token=' + this.$route.query.access_token)
          } else {
            this.$router.push('carnival_hot?os=' + this.$route.query.os)
          }
        } else {
          this.$router.push('carnival_hot')
        }
      },
      goCarnivalLottery() {
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          if (this.$route.query.access_token !== undefined) {
            this.$router.push('carnival_lottery?os=' + this.$route.query.os + '&access_token=' + this.$route.query.access_token)
          } else {
            this.$router.push('carnival_lottery?os=' + this.$route.query.os)
          }
        } else {
          this.$router.push('carnival_lottery')
        }
      },
      goCarnivalRanking() {
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          if (this.$route.query.access_token !== undefined) {
            this.$router.push('carnival_ranking?os=' + this.$route.query.os + '&access_token=' + this.$route.query.access_token)
          } else {
            this.$router.push('carnival_ranking?os=' + this.$route.query.os)
          }
        } else {
          this.$router.push('carnival_ranking')
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./css/carnival.styl"
  .carnival-ranking
    background-color #ffe900
    .banner
    .main
    .rule
      margin 0 auto
      width 7.5rem
    .banner
      padding-top 3.5rem
      height 4.18rem
      background url("images/ranking/banner.png") no-repeat center top / contain
      .activity-time
        text-align: center;
    .prize
      overflow hidden
      padding: 0 0 .5rem .3rem
      width 7.5rem
      margin 0 auto
      ul
        li
          overflow: hidden;
          position relative
          float left
          margin-right .3rem
          margin-bottom .3rem
          border: 2px solid #222
          border-radius .2rem
          width 3.3rem
          height 2.72rem
          padding 1.8rem 0 0 .2rem
          background-color #ffd200
          & > div
            position absolute
            left -2px
            top -2px
            width 3.3rem
            height 1.7rem
            border: 2px solid #222
            border-radius .2rem
            background-repeat no-repeat
            background-position center top
            background-size contain
            background-color #fff
            &.prize_01
              background-image url("images/ranking/prize_01.jpg")
            &.prize_02
              background-image url("images/ranking/prize_02.jpg")
            &.prize_03
              background-image url("images/ranking/prize_03.jpg")
            &.prize_04
              background-image url("images/ranking/prize_04.jpg")
          h3
            font-size .28rem
            font-weight normal
    .main
      height 16.08rem
      background url("images/ranking/main_bg.png") no-repeat center top / contain
      .ranking-time
        height 1.16rem
        dt
          line-height .4rem
          font-weight bold
          font-size .16rem
          text-align: center;
      .top-countdown
        display block
        text-align: center;
        color #ffe400
        font-size .3rem
        font-weight bold
        span
        i
          vertical-align: middle;
          font-size .3rem
          font-weight bold
      .ranking
        position: relative
        margin 0 auto
        padding-top 1rem
        width 6.2rem
        min-height 6rem
        .ranking-list
          height 10.84rem
          padding-bottom .1rem
          font-size .32rem
          text-align: center
          border-bottom 2px solid #000
          &.-notrank
            position: relative
            margin-top .8rem
            height 10rem
            border-top 2px solid #000
            background url("images/ranking/not_rank.png") no-repeat center center / 1.68rem 1.68rem
            &:after
              position: absolute
              top: 60%
              left 0
              right 0
              text-align: center;
              color #79c47b
              content '虚位以待'
              font-weight bold
              font-size .68rem
          span
            display block
            line-height .56rem
          .number
            width 20%
            i
              display block
              margin 0 auto
              width .48rem
              height .6rem
              background-position center center
              background-repeat no-repeat
              background-size contain
              &.-num1
                background-image url("images/ranking/number_1.png")
              &.-num2
                background-image url("images/ranking/number_2.png")
              &.-num3
                background-image url("images/ranking/number_3.png")
              &.-num4
                background-image url("images/ranking/number_4.png")
              &.-num5
                background-image url("images/ranking/number_5.png")
              &.-num6
                background-image url("images/ranking/number_6.png")
              &.-num7
                background-image url("images/ranking/number_7.png")
              &.-num8
                background-image url("images/ranking/number_8.png")
              &.-num9
                background-image url("images/ranking/number_9.png")
              &.-num10
                background-image url("images/ranking/number_10.png")
          .name
            width 30%
          .amount
            width 50%
            text-align: right
            padding-right .35rem
          .ranking-title
            display flex
            margin-bottom .1rem
            height .8rem
            border-bottom 2px solid #000
          .ranking-item
            display flex
            height .98rem
            padding: .2rem 0
        .my-invest
          padding .4rem 1.2rem .4rem 2.2rem
          height 1.8rem
          background url("images/ranking/flag.png") no-repeat 1.5rem .4rem / .56rem .92rem
          text-align: center
          dt
            font-size .26rem
          dd
            padding-top .05rem
            font-size .36rem
            color #e73516
            font-weight bold
        .btn-invest
          display block
          padding 0
          position: absolute
          left 50%
          top: 13.6rem
          margin-left -2.12rem
          width 4.24rem
          height 1.02rem
          line-height .9rem
          text-align: center
          color #fff
          font-weight bold
          font-size .36rem
          background url("images/ranking/btn_invest.png") no-repeat center top / 4.24rem 2.14rem
          &.-end
            background-position center -1.12rem
    .rule
      font-size .24rem
      padding .8rem .4rem 1.3rem
      .title
        margin 0 auto
        text-indent -100em
        width 6.18rem
        height .67rem
        background url("images/rule_title.png") no-repeat center top / contain
      ol
        padding .5rem .4rem 0
        list-style-type: decimal
        li
          padding-bottom .2rem
          strong
            display block
            padding-top .1rem
            color #9f250a
      .btn-rule
        display flex
        margin .3rem .5rem 0 .4rem
        border: 1px solid rgb(34, 34, 34)
        background-color: rgb(255, 206, 74)
        height: .94rem
        border-radius .94rem
        font-size .36rem
        text-align: center
        flex-direction: column;
        justify-content: center;

  .nhtze
    position relative
    width 6.83rem
    .close
      position absolute
      top: -1.05rem
      left 50%
      margin-left -.525rem
      width 1.05rem
      height .92rem
      background url("images/ranking/close.png") no-repeat center top / contain
    .popup-center
      background-color transparent
    .header
      position relative
      z-index 100
      height .77rem
      padding-top .36rem
      background url("images/lottery/lottery_log_title.png") no-repeat center top / contain
    .body
      margin -.77rem auto 0
      padding .9rem .2rem 0
      width 6.26rem
      background-color #fff
      border: .03rem solid #222
      border-top: 0
      text-align: center;
      font-size .24rem
      dl
        margin-bottom .15rem
        dt
          margin-bottom .15rem
          font-size .4rem
        dd
          padding .2rem 0
          background-color #ffc21c
          border 1px solid #222
      ul
        li
          padding .15rem 0
        li.-bg
          margin-bottom .15rem
          background-color #ededed
        li:last-child
          background url("images/ranking/arrows_bg.png") no-repeat center .05rem / .54rem .5rem
          padding-top .6rem
</style>
