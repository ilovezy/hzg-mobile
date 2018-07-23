<template>
  <layout :showNavbar="isNavbar" class="depository">
    <navbar slot="navbar" :title="$route.meta.title" class="depository_navbar">
      <navbar-back-icon @click.native="goBack" slot="left" class="depository_goback"></navbar-back-icon>
    </navbar>
    <tab class="depository-tab">
      <tab-panel>
        <div class="depository-guide"><img src="../../../../views/activity/common/depository_guide/images/bank_depository_guide.png"> </div>
      </tab-panel>
      <tab-panel label="开户流程">
        <div class="depository-guide_box">
          <h3 class="title">
            进入开户页面<br>路径1：注册成功后，点击「开通银行资金存管账户」，进入开户页面
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/open_account_01.jpg"></div>
        </div>
        <div class="depository-guide_box">
          <h3 class="title">
            路径2：若您注册后没有马上开通存管账户，您可以进入「我的」，点击「立即开通存管」、「存管账户」、「银行卡」进入开户页面
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/open_account_02.jpg"></div>
        </div>
        <div class="depository-guide_box">
          <h3 class="title">
            填写个人信息、设置并确认存管密码、阅读相关服务协议后点击「注册」
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/open_account_03.jpg" style="height: 7.18rem"></div>
        </div>
        <div class="depository-guide_box">
          <h3 class="title">
            成功开通存管账户
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/open_account_04.jpg"></div>
        </div>
      </tab-panel>
      <tab-panel label="充值流程">
        <div class="depository-guide_box">
          <h3 class="title -recharge">
            进入「我的」，点击「充值」<br>您可以通过快捷充值、银行转账这两种方式进行充值
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/recharge_01.jpg"></div>
        </div>
        <div class="depository-guide_box">
          <h3 class="title -recharge">
            1、选择「快捷充值」，输入充值金额，点击「充值」
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/recharge_02.jpg"></div>
        </div>
        <div class="depository-guide_box">
          <h3 class="title -recharge">
            2、输入动态口令、存管密码，点击「充值」
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/recharge_03.jpg"></div>
        </div>
        <div class="depository-guide_box">
          <h3 class="title -recharge">
            3、充值成功，您可以选择继续充值或查看充值记录
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/recharge_04.jpg"></div>
        </div>
        <div class="depository-guide_box">
          <h3 class="title -recharge">
            使用存管开户人名下银行卡通过网银、手机银行、柜台转账向您的渤海银行存管账户充值
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/recharge_05.jpg" style="height: 7.1rem;"></div>
        </div>
      </tab-panel>
      <tab-panel label="投资流程">
        <div class="depository-guide_box">
          <h3 class="title">
            选择购买标的，进入详情页，点击「立即投资」
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/invest_01.jpg"></div>
        </div>
        <div class="depository-guide_box">
          <h3 class="title">
            输入投资金额，选择使用红包、加息券，输入验证码，点击「立即投资」
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/invest_02.jpg" style="height: 7.05rem;"></div>
        </div>
        <div class="depository-guide_box">
          <h3 class="title">
            投资成功，您可以选择继续投资或查看投资记录
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/invest_03.jpg"></div>
        </div>
      </tab-panel>
      <tab-panel label="提现流程">
        <div class="depository-guide_box">
          <h3 class="title">
            进入「我的」，点击「提现」
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/cash_01.jpg"></div>
        </div>
        <div class="depository-guide_box">
          <h3 class="title">
            输入提现金额，点击「确认提现」
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/cash_02.jpg"></div>
        </div>
        <div class="depository-guide_box">
          <h3 class="title">
            输入动态口令、存管密码，点击「提现 」
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/cash_03.jpg"></div>
        </div>
        <div class="depository-guide_box">
          <h3 class="title">
            提交成功，您可以选择继续提现或查看提现记录
          </h3>
          <div class="guide-phone"><img src="../../../../views/activity/common/depository_guide/images/cash_04.jpg"></div>
        </div>
      </tab-panel>
      <tab-panel label="银行存管Q&A">
        <div class="depository-qa">
          <dl>
            <dt>银行存管上线后，用户资金有什么变化？</dt>
            <dd>存管后，您进行的任何充值、投资、提现等与资金相关的操作，均发送指令给渤海银行进行操作，由银行管理您的资金，资金安全更有保障。</dd>
          </dl>
          <dl>
            <dt>提现会有什么影响？</dt>
            <dd>根据渤海银行规定，单笔提现金额≤5万元；每天最多可提现6笔；T+1（工作日）到账，具体以银行到账时间为准； 提现暂不收取手续费。</dd>
          </dl>
          <dl>
            <dt>有哪些银行卡支持绑定？</dt>
            <dd>可支持16家银行进行绑卡：中国农业银行、交通银行、中国银行、中国建设银行、中国光大银行、兴业银行、招商银行、中国民生银行、中信银行、广发银行、平安银行、中国邮政储蓄银行、上海浦东发展银行、中国工商银行、北京银行、恒丰银行。</dd>
          </dl>
          <dl>
            <dt>开通存管账户时，是否需要办一张渤海银行卡？</dt>
            <dd>不需要。用户开通存管账户是指开通了一个渤海银行的存管电子账户，没有实体的银行卡。用户登录长富理财，按照提示步骤进行操作，即可完成开通，不需要去线下网点进行开通。</dd>
          </dl>
        </div>
        <div class="depository-qa-more">
          <dl>
            <dt>如您的问题未能得到解决，请联系官方客服</dt>
            <dd class="-tel">400-099-8799</dd>
            <dd>工作日：9:00-20:00  节假日：9:30-17:30</dd>
          </dl>
          <a :href="'/article/help?os='+this.$route.query.os" class="look-more" v-if="this.$route.query.os == 'app_ios' || this.$route.query.os == 'app_android'">查看更多解决方案</a>
          <router-link to="/article/help" class="look-more" v-else>查看更多解决方案</router-link>
        </div>
      </tab-panel>
    </tab>
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
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .depository
    background-color #000036!important
    & .scrollview:after
      content normal
  .depository-tab
    position absolute
    left 0
    top 0
    right 0
    bottom 0
    padding-top 1.25rem
    display flex
    flex-direction: column;
    height 100%
    .tab-nav
      position absolute
      top: 0
      width 100%
      padding .3rem .3rem 0
      height 1.25rem
      background-color transparent
      background-image  url("images/tab_bg.png")
      background-repeat no-repeat
      background-position center bottom
      background-size 100%
      .tab-nav-item
        padding .1rem .02rem 0
        line-height .3rem
        height .95rem
        background-color transparent
        color #878de9
        &:first-child
          & :before
            content ''
            margin 0 auto
            display block
            width .6rem
            height .6rem
            background url("images/tab_nav_guide.png") no-repeat left top
            background-size 1.4rem .6rem
        &:last-child
          flex 1.5
        & a
          display block
          background-image: -webkit-linear-gradient( -90deg, rgb(59,48,152) 0%, rgb(51,41,139) 58%, rgb(43,34,125) 100%);
          width: 100%
          padding .15rem .15rem 0
          height: .85rem;
          z-index: 19;
          border-radius .1rem .1rem 0 0
          transition: all .3s
        &.tab-active a
          background-image: -webkit-linear-gradient( -90deg, rgb(234,50,55) 0%, rgb(222,48,53) 58%, rgb(209,46,51) 100%)
          width: 100%
          margin-top -.1rem
          height: .95rem
          z-index: 36
          font-size .3rem
          position relative
          color #fff
          padding-top .2rem
          &:before
            background-position right top
        &.tab-active:before
          content normal
    .tab-panel
      flex 1
      width 100%
      height 100%
      padding .3rem 0
      margin-top -.02rem
      background-color #292177
      box-shadow: 0 .07rem .24rem 0 rgba(0, 0, 0, 0.5);
      color #fff
      .tab-panel-item
        padding: 0 0.3rem
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        &.tab-swiper
          position relative
  .depository-guide
    margin .5rem auto
    & img
      margin 0 auto
      width 6.1rem
      height 9.59rem
  .depository-guide_box
    padding-bottom 1rem
    .title
      position relative
      padding .2rem .5rem .5rem 1rem
      color #fff
      &:before
        content '1'
        display block
        position absolute
        left .1rem
        text-align: center;
        background url("images/number_bg.jpg") no-repeat left top
        background-size contain
        width .57rem
        height 1.05rem
        line-height .8
        font-size .34rem
        font-weight 700
      &.-recharge
        padding-left 1.2rem
        &:before
          left 0
          background-image url("images/recharge_number_bg.jpg")
          width .97rem
          height 1.81rem
    &:nth-child(2) .title
      &:before
        content '2'
    &:nth-child(3) .title
      &:before
        content '3'
    &:nth-child(4) .title
      &:before
        content '4'
    &:nth-child(5) .title
      &:before
        content '5'
    &:nth-child(6) .title
      &:before
        content '6'
    &:nth-child(1) .-recharge
      &:before
        line-height 3
        content '1'
        font-size .28rem
    &:nth-child(2) .-recharge
    &:nth-child(3) .-recharge
    &:nth-child(4) .-recharge
      &:before
        line-height 1.1
        padding 0 .1rem
        font-size .28rem
        content '快捷充值'
    &:nth-child(5) .-recharge
      &:before
        line-height 1.1
        padding 0 .1rem
        font-size .28rem
        content '银行转账'
    .guide-phone
      background url("images/phone_bg.png") no-repeat center top
      background-size contain
      margin 0 auto
      padding .86rem .18rem 0
      width 4.26rem
      height 8.12rem
      & img
        width 3.91rem
        height 6.42rem
  .depository-qa
    padding-top .5rem
    dl
      margin-bottom 1rem
      dt
        position: relative
        white-space nowrap
        padding-left .6rem
        height .6rem
        line-height .6rem
        font-size .26rem
        font-weight 600
        margin-bottom .25rem
        &:after
          content ''
          position absolute
          left  -.1rem
          top: -.04rem
          width: .2rem
          height: .2rem
          background-color: rgba(63, 53, 162,.8);
          z-index 10
      dd
        position: relative
        padding-left .6rem
        padding-top .08rem
        font-size .26rem
        color #c2bcf7
      dt
      dd
        &:before
          content 'Q'
          position: absolute
          left 0
          top .06rem
          color: #ffffff
          font-weight 700
          width: .45rem;
          height: .45rem;
          text-align: center
          line-height .45rem
          background-color: rgba(63, 53, 162,.8);
      dd
        &:before
          content 'A'
  .depository-qa-table
    border-collapse:collapse;
    text-align: center;
    font-size .24rem
    margin-bottom .3rem
    th
      width 24%
      padding: .3rem .1rem
      background-color #19116b
      border: 1px solid #5951a7
      &:last-child
        width 28%
    td
      padding: .3rem .1rem
      background-color #322a7e
      border: 1px solid #5951a7
  .depository-qa-more
    background url("images/qa_moulding.png") no-repeat center top
    background-size 5.06rem .28rem
    padding .5rem 0
    text-align: center;
    color #c2bcf7
    dl
      color #c2bcf7
      padding-bottom .3rem
      dd.-tel
        font-weight 700
        padding .1rem 0
        color #fff
    .look-more
      display block
      margin .3rem auto
      width 5rem
      height .9rem
      line-height .9rem
      font-size .3rem
      border 1px solid #5951a7
</style>
