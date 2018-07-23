<template>
  <layout :showNavbar="isNavbar" class="depository">
    <navbar slot="navbar" :title="$route.meta.title" class="depository_navbar">
      <navbar-back-icon @click.native="goBack" slot="left" class="depository_goback"></navbar-back-icon>
      <!--<router-link to="#" slot="right" style="color: #5d0900">我的武馆</router-link>-->
    </navbar>
    <div class="martial-club">
      <div class="banner"></div>
      <div class="flow-01">
        <span>邀请好友注册并投资，即可获得积分奖励，被邀请的好友投资越多，奖励积分越多。最多可享受两级好友投资奖励，积分可兑换富利社中的商品。<p>邀请的好友注册并开通存管视为收徒成功。</p></span></div>
      <div class="flow-02"></div>
      <div class="flow-03">
        <span>一.徒弟每次投资成功后，根据徒弟该笔投资的预期收益，按比例获得积分。徒弟贡献积分=徒弟每笔投资的预期收益*6%<br>二.徒孙每次投资成功后，根据徒孙该笔投资的预期收益，按比例获得积分。徒孙贡献积分=徒孙每笔投资的预期收益*3%</span>
      </div>
      <div class="flow-04"></div>
    </div>
    <div slot="tabbar" class="btn-control"><div @click="myMartialClub()">我的武馆</div><div @click="share()">立即邀请好友</div></div>
  </layout>
</template>
<script>
  export default {
    data () {
      return {
        isNavbar: true,
        os: ''
      }
    },
    created(){
      this.isOsAccess()
    },
    methods: {
      goBack(){
        this.$router.back()
      },
      isOsAccess(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android' ) {
          this.os = this.$route.query.os
          this.isNavbar = false
        }
      },
      share(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android' ) {
          window.location.href = 'cflc://jsbridge?type=event&name=share_register'
        }
      },
      myMartialClub(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android' ) {
          window.location.href = 'cflc://jsbridge?type=event&name=my_martial_club'
        }
      },
      goCarnival(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          this.$router.push('carnival?os='+ this.$route.query.os)
        } else {
          this.$router.push('carnival')
        }
      },
      goCarnivalRecharge(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          this.$router.push('carnival_recharge?os='+ this.$route.query.os)
        } else {
          this.$router.push('carnival_recharge')
        }
      },
      goCarnivalHot(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          this.$router.push('carnival_hot?os='+ this.$route.query.os)
        } else {
          this.$router.push('carnival_hot')
        }
      },
      goCarnivalLottery(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          this.$router.push('carnival_lottery?os='+ this.$route.query.os)
        } else {
          this.$router.push('carnival_lottery')
        }
      },
      goCarnivalRanking(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          this.$router.push('carnival_ranking?os='+ this.$route.query.os)
        } else {
          this.$router.push('carnival_ranking')
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .martial-club
    background-color #691DA4
    padding-bottom .5rem
    margin-bottom -.2rem
  .banner
    height: 4.97rem
    background #721DC3 url("images/banner.jpg") no-repeat center top
    background-size contain
  .flow-01
  .flow-02
  .flow-03
  .flow-04
    background-size contain
    background-position center top
    background-repeat no-repeat
  .flow-01
    height: 4.15rem
    background-image url("images/flow_01.png")
    text-align: center
    span
      display block
      width 6rem
      padding-top 2.05rem
      margin 0 auto
      color #6436a8
      text-indent 2em
      line-height 1.6
      text-align: left
      font-size .26rem
  .flow-02
    margin-top .26rem
    height: 3.73rem
    background-image url("images/flow_02.png")
  .flow-03
    margin-top .7rem
    height: 4.14rem
    background-image url("images/flow_03.png")
    span
      display block
      width 6rem
      padding-top 1.6rem
      margin 0 auto
      color #6436a8
      line-height 1.6
      text-align: left
      font-size .26rem
  .flow-04
    margin-top .45rem
    height: 4.43rem
    background-image url("images/flow_04.png")
  .btn-control
    padding: .3rem
    height 1.4rem
    background-color #691DA4
    text-align: center
    color #5d0900
    font-size .34rem
    line-height 1rem
    width 100%
    & div
      display inline-block
      vertical-align top
      background-color #1b96f4
      color #fff
      height .8rem
      line-height .8rem
      border-radius .1rem
      width 45%
      &:last-child
        margin-left .3rem
        color #5d0900
        background-color #f4ea1b

</style>
