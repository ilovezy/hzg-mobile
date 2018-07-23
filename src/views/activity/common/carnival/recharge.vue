<template>
  <layout :showNavbar="isNavbar">
    <navbar slot="navbar" :title="$route.meta.title">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="carnival-recharge">
      <div class="banner">
        <div class="activity-time">
          活动时间：{{initData.startTimeStamp | formatDateMD}} - {{initData.endTimeStamp | formatDateMD}}
        </div>
      </div>
      <div class="main">
        <div class="reward-wrap">
          <dl>
            <dd>￥<span>80</span></dd>
            <dt>充值≥5万元</dt>
          </dl>
          <dl>
            <dd>￥<span>180</span></dd>
            <dt>充值≥10万元</dt>
          </dl>
          <dl>
            <dd>￥<span>380</span></dd>
            <dt>充值≥20万元</dt>
          </dl>
          <dl>
            <dd>￥<span>600</span></dd>
            <dt>充值≥30万元</dt>
          </dl>
        </div>
        <div v-if="activeStatus === 'notstart'" class="btn-recharge -notstart"></div>
        <div v-else-if="activeStatus === 'start'" @click="goRecharge()" class="btn-recharge -start"></div>
        <div v-else-if="activeStatus === 'end'" class="btn-recharge -end"></div>
      </div>
      <div class="rule">
        <h3 class="title">活动说明</h3>
        <ol>
          <li>活动时间：<br>{{initData.startTimeStamp | formatDate}} - {{initData.endTimeStamp | formatDate}}</li>
          <li>活动期间，用户单笔新增充值满相应金额即可获得对应红包，奖励次数不限；</li>
          <li>每笔新增充值仅可获得一档奖励，按最高标准发放；</li>
          <li>满足充值条件的奖励红包将在10分钟内自动发放至用户账户中，在「我的」-「红包卡券」中查看，有效期15天。
            <table>
              <tr>
                <th>单笔充值</th>
                <th>奖励</th>
                <th>使用条件</th>
              </tr>
              <tr>
                <td>X≥5万元</td>
                <td>80元红包</td>
                <td>单笔投资≥5万可用</td>
              </tr>
              <tr>
                <td>X≥10万元</td>
                <td>180元红包</td>
                <td>单笔投资≥10万可用</td>
              </tr>
              <tr>
                <td>X≥20万元</td>
                <td>380元红包</td>
                <td>单笔投资≥20万可用</td>
              </tr>
              <tr>
                <td>X≥30万元</td>
                <td>600元红包</td>
                <td>单笔投资≥30万可用</td>
              </tr>
            </table>
          </li>
        </ol>
      </div>
    </div>
    <div slot="tabbar" class="carnival-menu">
      <ul>
        <li @click="goCarnival" class="-home">首页</li>
        <li @click="goCarnivalRecharge" class="-current">欢乐<br>充值吧</li>
        <li @click="goCarnivalHot">火热<br>加息场</li>
        <li @click="goCarnivalLottery">幸运<br>大转盘</li>
        <li @click="goCarnivalRanking">巅峰<br>排位赛</li>
      </ul>
    </div>
    <popup v-model="isLoginPopup" class="isloginPopup" position="center" width="6.8rem">
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
        activeStatus: 'notstart',
        serverTime: '',
        isLogin: false,
        isLoginPopup: false,
        initData: '',
        userData: '',
      }
    },
    created() {
      sessionStorage.setItem("appdown", "false")
      if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
        this.isNavbar = false
        localStorage.clear()
        window.location.href = encodeURI("cflc://jsbridge?type=open&name=show_share_button&share_url=" + window.location.protocol + "//" + window.location.host + "/activity/carnival_recharge&share_qq_weixin_title=长富狂欢节 欢乐充值吧&share_qq_weixin_dec=喜迎存管，充值领红包啦！最高可领600元红包，让你收益翻翻翻！&share_pyq_dec=庆长富理财银行存管正式上线，红包送不停，收益翻不停！");
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
            this.initData = res.result.modulePojos[0]
            this.serverTime = res.result.serverTime
            if ((this.initData.startTimeStamp - this.serverTime) > 0) {
              this.activeStatus = 'notstart'
            } else if ((this.initData.endTimeStamp - this.serverTime) > 0) {
              this.activeStatus = 'start'
            } else if ((this.initData.endTimeStamp - this.serverTime) < 0) {
              this.activeStatus = 'end'
            }
          } else if (res.error === 'MC_ACTIVITY_THEME_NOT_EXIST_ERROR') {
            this.$router.replace('/')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
        this.axios.get('auth/ucMemebe/info').then(res => {
          if (res.success) {
            this.isLogin = true
            this.userData = res.result
          } else {
            localStorage.clear()
            this.isLogin = false
          }
        })
      },
      goRecharge() {
        if (this.isLogin) {
          if (this.userData.status === 'un_auth' || this.userData.status === 'authing') {
            this.$dialog.confirm({
              title: '提示',
              mes: '您还没有开通银行存管',
              opts: [{
                txt: '取消',
              }, {
                txt: '确定',
                color: true,
                callback: () => {
                  if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
                    window.location.href = 'cflc://jsbridge?type=open&name=my_account'
                  } else {
                    this.$router.push('/account')
                  }
                }
              }]
            });
          } else {
            if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
              window.location.href = 'cflc://jsbridge?type=open&name=recharge'
            } else {
              this.$router.push('/account/recharge')
            }
          }
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
  .carnival-recharge
    margin-bottom -.2rem
    background-color #62b9ff
    .banner
    .main
    .rule
      margin 0 auto
      width 7.5rem
    .banner
      position relative
      height: 3.3rem
      padding-top 2.3rem
      overflow hidden
      background url("images/recharge/banner.png") no-repeat center top / 7.5rem 3.3rem
      .activity-time
        text-align: center;
    .main
      padding: 0 1.1rem 0 1.18rem
      height 8.3rem
      background url("images/recharge/main_bg.png") no-repeat center 0 / contain
      .reward-wrap
        overflow: hidden;
        width 100%
        padding-bottom .6rem
        dl
          float: left;
          margin 0 .2rem
          padding-top .6rem
          width 2.2rem
          text-align: center;
          dd
            margin 0 auto
            padding-top .66rem
            width 1.4rem
            height 1.6rem
            font-size .28rem
            color #fff
            background url("images/recharge/reward_bg.png") no-repeat center top / contain
            span
              font-size .48rem
          dt
            margin-top -.02rem
            width 2.2rem
            height .5rem
            line-height .44rem
            font-size .28rem
            color #222
            border: .03rem solid #242944
            border-radius .5rem
      .btn-recharge
        position relative
        display block
        margin 0 auto
        width 2.54rem
        height 2rem
        &:after
          position absolute
          top: -.1rem
          left .23rem
          content ''
          width 2.11rem
          height 1.57rem
        &:before
          position absolute
          bottom: 0
          content ''
          width 2.54rem
          height 1.62rem
          background url("images/recharge/btn_recharge_bottom.png") no-repeat center top / contain
        &.-start:after
          background url("images/recharge/btn_recharge.png") no-repeat center top / contain
          animation: bounce-down 1.5s linear infinite
        &.-notstart:after
          background url("images/recharge/btn_recharge_notstart.png") no-repeat center top / contain
        &.-end:after
          background url("images/recharge/btn_recharge_end.png") no-repeat center top / contain
    .rule
      font-size .24rem
      padding .8rem .3rem 1.5rem
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
          padding-bottom .1rem
      table
        border: 1px solid #222
      th
      td
        padding .15rem
        line-height .3rem
        border: 1px solid #222
      table
        margin-top .5rem
        width 100%
        border-collapse collapse
        th
          text-align: center;
          background-color #82c7ff
</style>
