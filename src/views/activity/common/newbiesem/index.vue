<template>
  <layout style="background-color: #f7333f" :showNavbar="isNavbar">
    <navbar slot="navbar" :title="$route.meta.title">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="banner"></div>
    <div class="reward"></div>
    <div class="rule">
      <div class="btn-base" @click="lockCoupon()" v-if="this.$route.query.access_token !== undefined || token !== null">查看我的优惠券</div>
      <div class="btn-base" @click="register()" v-else>立即注册</div>
      <div class="rule-box">
        <ol>
          <li>新人注册成功即可获得666元大礼包一份；</li>
          <li>666元大礼包以红包的形式发放到您的长富理财账户中；</li>
          <li>红包有效期及使用说明详见“我的—红包卡券”；</li>
          <li>新人活动截止时间以长富理财公告为准；</li>
          <li>本活动同一用户（同一手机号码、同一身份证、同一银行卡均视为同一用户) 仅可参与一次；</li>
          <li>详情请致电官方客服：<a href="tel:4000998799"> 400-099-8799</a><br>工作日：9:00-20:00，节假日：9:30—17:30</li>
          <li>本次活动最终解释权归长富理财所有</li>
        </ol>
      </div>
    </div>
    <div class="more">
      <router-link :to="os !== '' ? '/activity/depository_guide?os=' + os : '/activity/depository_guide'" class="btn-base">银行存管操作指南</router-link>
      <router-link :to="os !== '' ? '/article/about?os=' + os : '/article/about'" class="btn-base">关于长富理财</router-link>
    </div>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        isNavbar: true,
        os: '',
        token: ''
      }
    },
    created() {
      this.isOsAccess()
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      isOsAccess() {
        this.token = localStorage.getItem('token')
//        console.log(this.token)
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          this.os = this.$route.query.os
          this.isNavbar = false
        }
      },
      register() {
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          window.location.href = 'cflc://jsbridge?type=open&name=register'
        } else {
          this.$router.push('/register')
        }
      },
      lockCoupon() {
        if (this.$route.query.access_token !== undefined) {
          window.location.href = 'cflc://jsbridge?type=open&name=coupon'
        } else {
          this.$router.push('/account/cash_reward')
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .banner
    height 6.42rem
    background #f7333f url("images/banner.jpg") no-repeat center top
    background-size contain
  .reward
    height 11.11rem
    background #f7333f url("images/reward_bg.jpg") no-repeat center top
    background-size contain
  .rule
    width 100%
    overflow hidden
    background #f7333f url("images/rule_bg.jpg") no-repeat center top
    background-size contain
    .rule-box
      position relative
      width 7rem
      min-height 3.2rem
      margin 1rem auto 0
      border: .2rem solid #e0222c
      border-radius .2rem
      &:before
        content ''
        display block
        position absolute
        left .2rem
        top -.34rem
        width 2rem
        height .44rem
        background url("./images/rule_title.jpg") no-repeat left top / contain
      & ol
        padding .5rem .3rem .3rem .5rem
        list-style decimal
        li
          padding .05rem 0
          color #fff
          font-size .2rem
  .more
    margin-bottom -.2rem
    padding-top 1.5rem
    overflow hidden
    height: 5.61rem
    background #f7333f url("images/more_bg.jpg") no-repeat center top
    background-size contain
  .btn-base
    display block
    background-color: rgb(249, 238, 7);
    box-shadow: 0 .23rem .13rem 0 rgba(192, 7, 40, 0.28);
    border-radius .88rem
    font-size .36rem
    margin .5rem auto 0
    width: 6.7rem
    height: .88rem
    line-height .88rem
    text-align: center
    z-index: 110
    color #f62c37
  @media screen and (min-width: 414px)
    .banner
      height 7.8rem
    .reward
      height 12.26rem
    .more
      height 6.2rem
</style>
