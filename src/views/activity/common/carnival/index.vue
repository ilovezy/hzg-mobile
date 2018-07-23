<template>
  <layout :showNavbar="isNavbar">
    <navbar slot="navbar" :title="$route.meta.title">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="carnival-index">
      <div class="banner">喜迎存管，长富狂欢节</div>
      <div class="activity-time">万元豪礼玩赚金秋</div>
      <div class="main">
        <div @click="goCarnivalRecharge" class="activity-menu -recharge">欢乐充值吧</div>
        <div @click="goCarnivalHot" class="activity-menu -hot">火热加息场</div>
        <div @click="goCarnivalLottery" class="activity-menu -lottery">幸运大转盘</div>
        <div @click="goCarnivalRanking" class="activity-menu -top">巅峰排位赛</div>
        <div class="-footer">详情请致电官方客服：400-099-8799 <br>工作日：9:00 – 20:00     节假日：9:30-17:30<p>
          长富理财在法律允许的范围内保留对本次活动的最终解释权</p></div>
      </div>
    </div>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        isNavbar: true,
        initData: ''
      }
    },
    created() {
      sessionStorage.setItem("appdown", "false")
      if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
        localStorage.clear()
        this.isNavbar = false
        window.location.href = encodeURI("cflc://jsbridge?type=open&name=show_share_button&share_url=" + window.location.protocol + "//" + window.location.host + "/activity/carnival&share_qq_weixin_title=喜迎存管，长福狂欢节送你iPhone X！&share_qq_weixin_dec=庆祝渤海银行正式上线 ，万元豪礼 ，玩转金秋！&share_pyq_dec=喜迎存管 长富狂欢节 万元豪礼  玩转金秋");
      }
      this.getInit()
    },
    methods: {
      goBack() {
        this.$router.push('/')
      },
      getInit() {
        this.axios.get('security/find/activity/bhbk').then(res => {
          if (res.success) {
            this.initData = res.result
          } else if (res.error === 'MC_ACTIVITY_THEME_NOT_EXIST_ERROR') {
            this.$router.replace('/')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
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
  @keyframes bounce-down {
    25% {
      transform: translateY(-3px);
    }
    50%, 100% {
      transform: translateY(0);
    }
    75% {
      transform: translateY(3px);
    }
  }

  .carnival-index
    margin-bottom -.2rem
    background-color #ffe900
    .banner
    .activity-time
    .main
      margin 0 auto
      width 7.5rem
    .banner
      overflow hidden
      text-indent -100em
      height 2.14rem
      background url("./images/index/banner.png") no-repeat center top / contain
    .activity-time
      overflow hidden
      text-indent -100em
      height 2.82rem
      background url("./images/index/activity_time.png") no-repeat center top / contain
    .main
      position: relative
      padding-bottom 1.6rem
      height 9.5rem
      background url("./images/index/main_bg.png") no-repeat center top / contain
      .activity-menu
        display block
        position absolute
        z-index 1000
        overflow hidden
        text-indent -100em
        width 2.5rem
        height 1.6rem
        background url("./images/index/menu_bg.png") no-repeat center top / 2.38rem 7.6rem
        animation: bounce-down 1.5s linear infinite
        &.-recharge
          top .6rem
          right: 1rem
        &.-hot
          top 1.96rem
          left: .84rem
          background-position center -2rem
        &.-lottery
          top 3.94rem
          right: .54rem
          background-position center -4.02rem
        &.-top
          top 5rem
          left: .75rem
          background-position center -6rem
      .-footer
        position absolute
        left 0
        right 0
        bottom .15rem
        font-size .24rem
        text-align: center;
        p
          padding-top .15rem
</style>
