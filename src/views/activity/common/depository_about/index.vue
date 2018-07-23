<template>
  <layout :showNavbar="isNavbar">
    <navbar slot="navbar" :title="$route.meta.title" class="depository_navbar">
      <navbar-back-icon @click.native="goBack" slot="left" class="depository_goback"></navbar-back-icon>
    </navbar>
    <div class="depository-about">
      <div class="banner"><img src="../../../../views/activity/common/depository_about/images/banner.jpg"></div>
      <div class="main">
        <div class="da-group">
          <h3 class="da-header">什么是银行存管?</h3>
          <div class="da-body">
            <p>银行资金存管是指银行对合作平台出借人与借款人开立和使用的资金存管账户进行管理和监督，依照出借人与借款人向平台发出的指令，对两者资金进行存管、划付、核算和监督，平台作为纯粹的信息中介参与到交易之中，全程不触碰资金，所有资金流动均在银行体系内进行，由银行管理资金，平台管理交易，真正做到了平台与用户资金完全隔离。</p>
            <p>您在长富理财首次投资时，需要在线开通个人渤海银行存管账户。交易资金存放于存管账户，仅可根据您的交易指令被划转到交易相关方存管账户或提现至您本人银行卡。</p>
            <div class="depository-process">
              <img src="../../../../views/activity/common/depository_about/images/depository_process.png"></div>
          </div>
        </div>
        <div class="da-group">
          <h3 class="da-header">接入银行存管有哪些优势？</h3>
          <div class="da-body">
            <dl>
              <dt>资金隔离</dt>
              <dd>用户在存管银行有专门的独立存管子帐户，由存管银行对资金进行管理与监督，平台无法触碰用户资金，实现平台资金和用户资金隔离。</dd>
            </dl>
            <dl>
              <dt>真实透明</dt>
              <dd>用户需单独设立存管密码保障账户安全，账户信息由存管银行管理，银行仅根据用户的授权指令来划拨资金，对交易流程进行管理并记录用户资金流水，交易真实透明。</dd>
            </dl>
            <dl>
              <dt>安全合规</dt>
              <dd>银行存管符合监管政策要求，所有关系到用户资金安全的行为均受到强力监管，安全合规。</dd>
            </dl>
          </div>
        </div>
        <div class="da-group">
          <h3 class="da-header">为什么选择渤海银行？</h3>
          <div class="da-body">
            <p class="text-red">渤海银行是全国唯一一家全国性股份制商业银行，在“全球银行1000强”排名中综合排名第202位，亚洲银行综合竞争力排名第50位。</p>
            <dl>
              <dt>AAA级信用银行</dt>
              <dd>银行信用评级是对一家银行当前偿付其金融债务的总体金融能力的评价。渤海银行获得AAA级信用评级，达到全国银行信用评级中最高级别。</dd>
            </dl>
            <dl>
              <dt>有效风险管理体系</dt>
              <dd>渤海银行拥有统一的风险管理组织架构，完善的风险管理体系及基本原则、风险偏好陈述，建立起了独立、有效的风险管理体系。</dd>
            </dl>
            <dl>
              <dt>合规银行存管</dt>
              <dd>渤海银行存管符合《网络借贷信息中介机构业务活动管理暂行办法》和《网络借贷资金存管业务指引 （征求意见稿）》中的政策规定，是完全合规的银行存管模式。</dd>
            </dl>
          </div>
        </div>
        <div class="da-group">
          <h3 class="da-header">如何保障您的资金安全？</h3>
          <div class="da-body">
            <dl>
              <dt>开通存管账户</dt>
              <dd>您在长富理财首次投资时，在线开通个人渤海银行存管账户，并单独设立交易密码。</dd>
            </dl>
            <dl>
              <dt>用户授权操作</dt>
              <dd>您的充值、投资、提现行为均发送指令至渤海银行进行操作。</dd>
            </dl>
            <dl>
              <dt>银行执行用户指令</dt>
              <dd>渤海银行获得您的授权后，根据交易指令进行资金划拨。</dd>
            </dl>
            <dl>
              <dt>银行监管交易流程</dt>
              <dd>渤海银行将对所有资金流水存档记录，交易清晰可查。</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        isNavbar: true,
        os: ''
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
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          this.os = this.$route.query.os
          this.isNavbar = false
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .depository-about
    background-color #d7212b
    min-height 100%
    margin-bottom -.2rem
    padding-bottom .3rem
    & .banner
      width 100%
      img
        width 100%
    & .main
      margin 0 .3rem
      background-color #fff
      min-height 100%
      padding .3rem
    .da-group
      margin-bottom .8rem
      text-align: center;
      &:last-child
        margin-bottom 0
      .da-header
        display inline-block
        margin 0 auto
        padding .1rem .4rem
        border-radius 1rem
        background-color #d7212b
        color #fff
        font-size .32rem
        white-space nowrap
      .da-body
        padding-top .5rem
        text-align: left
        color #666
        font-size .26rem
        p
          margin-bottom .4rem
          &.text-red
            color #d7212b
        .depository-process
          padding-bottom .3rem
          img
            max-width 100%
        dl
          padding-bottom .3rem
          &:last-child
            padding-bottom 0
          dt
            line-height 2
            font-size .3rem
            font-weight 700
            color #333
</style>
