<template>
  <layout :showNavbar="isNavbar" >
    <navbar slot="navbar" :title="$route.meta.title">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="carnival-lottery">
      <div class="banner">
        <div class="activity-time">
          活动时间：{{initData.startTimeStamp | formatDateMD}} - {{initData.endTimeStamp | formatDateMD}}
        </div>
      </div>
      <div class="lottery">
        <div class="lottery-number" v-if="isLogin && activeStatus === 'start' && islotteryNumber" v-cloak>剩余 {{lotteryNumber}}次</div>
        <lottery :beforeLottery="lotteryHandler" :activeStatus="activeStatus" :islogin="isLogin" :prizesList="prizesList" :prize="prize" :afterLottery="resultHandler"></lottery>
      </div>
      <div class="lottery-log" @click="goCarnivalLotteryLog()"></div>
      <div class="rule">
        <h3 class="title">活动说明</h3>
        <ol>
          <li>活动时间：<br>{{initData.startTimeStamp | formatDate}} - {{initData.endTimeStamp | formatDate}}；</li>
          <li>活动期间，单笔投资每满3000元获一次抽奖机会；<br>例：单笔投资9000元，可获得3次抽奖机会；</li>
          <li>
            平台虚拟奖品将在10分钟内发送至用户账户中，红包与加息券在【我的】-【红包卡券】中查看，有效期15天；积分在【我的积分】中查看；iPhone 8与京东卡在活动结束后5个工作日内统一联系发放，请保持手机畅通，若错过通知视为放弃获奖资格；
          </li>
          <li>本活动与苹果公司无关。</li>
        </ol>
      </div>
    </div>
    <div slot="tabbar" class="carnival-menu">
      <ul>
        <li @click="goCarnival" class="-home">首页</li>
        <li @click="goCarnivalRecharge">欢乐<br>充值吧</li>
        <li @click="goCarnivalHot">火热<br>加息场</li>
        <li @click="goCarnivalLottery" class="-current">幸运<br>大转盘</li>
        <li @click="goCarnivalRanking">巅峰<br>排位赛</li>
      </ul>
    </div>

    <popup v-model="isLoginPopup" class="isloginPopup" position="center" width="6.5rem">
      <div class="info">您还未登录哦，<br>登录即可参与更多精彩活动啦！<i class="close" @click="isLoginPopup = false"></i><i
        class="decorate -t"></i><i class="decorate -b"></i></div>
      <div class="btn-wrap" @click="goLogin"></div>
    </popup>

    <popup v-model="isNotlotteryPopup" class="isNotlotteryPopup" position="center" width="6.5rem">
      <div class="info">您的抽奖次数已用完，<br>投资满3000元即获得一次抽奖机会<i class="close" @click="isNotlotteryPopup = false"></i><i
        class="decorate -t"></i><i class="decorate -b"></i></div>
      <div class="btn-wrap -invest">
        <div class="btn-invest" @click="goInvest">立即去投资</div>
      </div>
    </popup>
    <popup v-model="islotteryPrize" class="islotteryPrize" position="center" width="10.05rem">
      <div class="lottery-prize">
        <i class="light"></i>
        <dl class="prize-show" v-if="prizesList[prize] !== undefined">
          <dt class="pic"><img :src="prizesList[prize].img"></dt>
          <dd class="name">恭喜您获得{{prizesList[prize].txt}}</dd>
          <dd class="btn-confirm" @click="islotteryPrize = false">确定</dd>
        </dl>
      </div>
    </popup>
  </layout>
</template>
<script>
  import lottery from '../../../../components/lottery';

  export default {
    data() {
      return {
        isNavbar: true,
        isLogin: false,
        isLoginPopup: false,
        isNotlotteryPopup: false,
        prize: -1,
        prizesList: [
          {
            img: require('./images/lottery/pic_log_iphone.png'),
            txt: 'iPhone8/64G'
          }, {
            img: require('./images/lottery/pic_log_integral118.png'),
            txt: '118积分'
          }, {
            img: require('./images/lottery/pic_log_jd100.png'),
            txt: '100元京东卡'
          }, {
            img: require('./images/lottery/pic_log_integral28.png'),
            txt: '28积分'
          }, {
            img: require('./images/lottery/pic_log_jd300.png'),
            txt: '300元京东卡'
          }, {
            img: require('./images/lottery/pic_log_rate.png'),
            txt: '2%加息券'
          }, {
            img: require('./images/lottery/pic_log_reward.png'),
            txt: '50元红包'
          }, {
            img: require('./images/lottery/pic_log_integral28.png'),
            txt: '28积分'
          }
        ],
        initData: '',
        lotteryNumber: Number,
        islotteryNumber: false,
        islotteryPrize: false,
        activeStatus: 'notstart',
        serverTime: ''
      };
    },
    created() {
      sessionStorage.setItem("appdown", "false")
      if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
        localStorage.clear()
        this.isNavbar = false
        window.location.href = encodeURI("cflc://jsbridge?type=open&name=show_share_button&share_url=" + window.location.protocol + "//" + window.location.host + "/activity/carnival_lottery&share_qq_weixin_title=长富狂欢节 幸运大转盘&share_qq_weixin_dec=喜迎存管，玩赚大转盘，百分百中奖哦，iPhone 8轻松抽回家！&share_pyq_dec=庆长富理财银行存管正式上线，京东卡、iPhone 8轻松抽走，幸运不止一点点！");
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
            this.initData = res.result.modulePojos[1]
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
        //用户是否登录
        this.axios.get('auth/ucMemebe/info').then(res => {
          if (res.success) {
            this.isLogin = true
            this.getLotteryNumber()
          } else {
            localStorage.clear()
            this.isLogin = false
          }
        })
      },
      getLotteryNumber() {
        this.axios.post('auth/finPoint/activity/lotteryInfo/bhbk_lottery').then(res => {
          if (res.success) {
            this.islotteryNumber = true
            this.lotteryNumber = res.result.availableNum
          } else {
            this.islotteryNumber = false
          }
        })
      },
      lotteryHandler(resolve, reject) {
        if (navigator.onLine) {
          if (this.isLogin) {
            if (this.lotteryNumber > 0) {
              this.axios.post('auth/finPoint/activity/lottery/bhbk_lottery').then(res => {
                if (res.success) {
                  resolve();
                  this.prize = parseInt(res.result.prizeCode)
                  this.lotteryNumber = res.result.availableNum
                  this.islotteryNumber = true
                } else if (res.error === 'MC_ACTIVITY_NOT_EXIST_OR_END_ERROR') {
                  this.$dialog.confirm({
                    title: '提示',
                    mes: '活动已结束!',
                    opts: [{
                      txt: '确定',
                      color: true,
                      callback: () => {
                        this.$router.go(0)
                      }
                    }]
                  });
                } else {
                  reject();
                  this.isLogin = false
                  this.isLoginPopup = true
                  this.islotteryNumber = false
                }
              }, res => {
                reject();
              })
            } else {
              reject();
              this.isNotlotteryPopup = true
            }
          } else {
            reject();
            this.isLogin = false
            this.isLoginPopup = true
          }
        } else {
          this.$dialog.toast({mes: '您的网络链接已断开！', icon: 'error'})
          reject();
        }
      },
      resultHandler() {
        this.islotteryPrize = true

//        alert(this.prizesList[this.prize].txt);
      },
      goInvest() {
        if (this.isLogin) {
          this.goProductList()
        } else {
          this.isLoginPopup = true
        }
      },
      goProductList() {
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          window.location.href = 'cflc://jsbridge?type=open&name=product_list'
        } else {
          this.$router.push('/product')
        }
      },
      goCarnivalLotteryLog() {
        if (this.activeStatus === 'start' || this.activeStatus === 'end') {
          this.axios.get('auth/ucMemebe/info').then(res => {
            if (res.success) {
              if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
                if (this.$route.query.access_token !== undefined) {
                  this.$router.push('carnival_lottery_log?os=' + this.$route.query.os + '&access_token=' + this.$route.query.access_token)
                } else {
                  this.$router.push('carnival_lottery_log?os=' + this.$route.query.os)
                }
              } else {
                this.$router.push('carnival_lottery_log')
              }
            } else {
              localStorage.clear()
              this.isLogin = false
              this.isLoginPopup = true
            }
          })
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
    },
    components: {
      lottery: lottery
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  [v-cloak] {
    display: none;
  }

  @import "./css/carnival.styl"
  @keyframes spin {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  .carnival-lottery
    background-color #ffe900
    .banner
    .main
    .lottery-log
    .rule
      margin 0 auto
      width 7.5rem
    .banner
      height 3.02rem
      background url("images/lottery/banner.png") no-repeat center top / contain
      .activity-time
        padding-top 2.5rem
        text-align: center;
    .lottery
      position relative
      padding .6rem .84rem .76rem .9rem
      height 6.48rem
      background url("images/lottery/lottery_bg.png") no-repeat center top / contain
      .lottery-number
        position: absolute
        z-index 200
        top: 3.38rem
        left 0
        right: 0
        text-align: center;
        color #ffde2a
        font-size .26rem
    .lottery-log
      height 2.17rem
      background url("images/lottery/lottery_log.png") no-repeat center top / contain
    .rule
      font-size .24rem
      padding .8rem .3rem 1.2rem
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

  .islotteryPrize
    .popup-center
      background-color transparent
    .lottery-prize
      width 10.5rem
      height 10.5rem
      padding-top 2rem
      position: relative
      .light
        position: absolute
        left 0
        top: 0
        width 10.5rem
        height 10.5rem
        background url("images/lottery/light.png") no-repeat center top / contain
        animation: spin 10000ms infinite linear;
    .prize-show
      position: absolute
      top: 50%
      left: 50%
      margin-left -3.16rem
      margin-top -3.07rem
      padding-top 2.26rem
      width 5.88rem
      height 6.14rem
      background url("images/lottery/lottery_prize.png") no-repeat center top / contain
      text-align: center;
      .pic
        display flex
        flex-direction: column;
        justify-content: center;
        width 2.22rem
        height: 2.08rem
        text-align: center;
        margin 0 auto
        img
          max-width 2.22rem
          max-height 2.08rem
          margin 0 auto
      .name
        font-size .4rem
        color #e73516
      .btn-confirm
        position: absolute
        left 50%
        bottom: -.44rem
        margin-left -1.45rem
        width 2.97rem
        height 1.08rem
        line-height 1.08rem
        color #fff
        font-size .4rem
        font-weight bold
        background url("images/lottery/btn_confirm.png") no-repeat center top / contain
</style>
