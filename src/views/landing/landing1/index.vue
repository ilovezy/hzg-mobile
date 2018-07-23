<template>
  <layout class="bg-white">
    <div class="landing">
      <div class="banner"><img src="../../landing/landing1/images/banner.png"></div>
      <div class="land-reg-box">
        <div class="land-reg">
          <div class="landReg-item">
            <icon class="land-icon" name="mobile"></icon>
            <input type="tel" maxlength="11" placeholder="手机号码" class="land-input" v-model="username">
          </div>
          <div class="landReg-item -valcode" v-if="isImgCode">
            <icon class="land-icon" name="smscode"></icon>
            <input type="text" v-model="validateCode" maxlength="4" placeholder="图形验证码" class="land-input ">
            <img class="-codeImg" :src="validateCodeImg" @click="getValidateCode()">
          </div>
          <div class="landReg-item -valcode">
            <icon class="land-icon" name="smscode"></icon>
            <input type="tel" v-model="smsCode" maxlength="6" placeholder="短信验证码" class="land-input ">
            <button class="btn-cell-special -disabled -codeSms" disabled v-if="username.length !== 11">获取验证码</button>
            <button class="btn-cell-special -disabled -codeSms" disabled v-else-if="isImgCode == true && validateCode.length !== 4">获取验证码</button>
            <sendcode class="-codeSms" v-model="sendCodeStart" @click.native="sendCode" :second="second" type="warning" v-else></sendcode>
          </div>
          <div class="landReg-item">
            <icon class="land-icon" name="password"></icon>
            <input slot="right" type="password" autocomplete="off" maxlength="16" placeholder="登录密码（6-16位数字与字母组合）"
                   class="land-input" v-model.trim="password"></div>
          <div class="landReg-item -protocol">注册即代表同意
            <router-link to="/protocol/register">长富理财注册协议</router-link>
          </div>
          <div class="landReg-item">
            <ibutton size="large" type="disabled" v-if="isImgCode">注册领取666元大礼包</ibutton>
            <ibutton size="large" type="disabled" v-else-if="isNaN(this.username) || username.length !== 11 || smsCode.length !== 6 || password.length < 6">注册领取666元大礼包</ibutton>
            <ibutton size="large" type="primary" class="-btn-reg" @click.native="register()" v-else>注册领取666元大礼包</ibutton>
            <!--<ibutton size="large" type="primary" @click.native="register()">注册领取666元大礼包</ibutton>-->
          </div>
        </div>
      </div>
      <div class="hot-project-box">
        <div class="hot-project" @click="openDetail()" v-if="project !== undefined">
          <header class="header">
            <h3 v-if="project.novice == true">新手专享</h3>
            <h3 v-else>推荐项目</h3>
            <p>{{project.name}}</p>
          </header>
          <div class="props">
            <dl>
              <dd>
                <span>{{project.formatExpectAnnualizedRate}}</span>％<em
                v-if="project.extraAnnualizedRate > 0">+{{project.formatScale2ExtraAnnualizedRate}}%</em>
              </dd>
              <dt>预期年化</dt>
            </dl>
            <dl>
              <dd><span>{{project.period}}</span>{{project.formatPeriodType}}</dd>
              <dt>投资期限</dt>
            </dl>
          </div>
          <button class="btn btn-primary" v-if="project.status == 'wait_collection' && project.startTimeCountDown != 0">
            距离募集开始
            <countdown :time="project.startTimeCountDown" timetype="second" class="home-countdown" format="<i>{%h}</i>:<i>{%m}</i>:<i>{%s}</i>"  doneText="" :callback="refreshPage">
            </countdown>
          </button>
          <button class="btn btn-primary" v-else-if="project.status == 'collection' || project.startTimeCountDown == 0">
            {{project.minInvestAmount}}元起投 立即投资
          </button>
          <button class="btn btn-disabled" v-else-if="project.status == 'collection_end'">已成立</button>
          <button class="btn btn-disabled" v-else-if="project.status == 'payed'">已完结</button>
        </div>
      </div>
      <div class="superiority">
        <dl>
          <dt>上市公司全资控股</dt>
          <dd>投融长富金融服务集团</dd>
        </dl>
        <dl>
          <dt>银行存管保驾护航</dt>
          <dd>渤海银行资金存管</dd>
        </dl>
      </div>
    </div>
    <div class="cflc-appdown">
      <img src="../../landing/landing1/images/logo.png" class="logo">
      <button type="button">下载客户端</button>
    </div>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        isFirst: true,
        isImgCode: false,
        validateCode: '',
        validateCodeImg: '',
        smsCode: '',
        second: 60,
        sendCodeStart: false,
        registerTraceNo: '',
        registerTraceSource: '',
        project: ''
      }
    },
    created() {
      sessionStorage.setItem("appdown", "false")
      this.islogin()
    },
    methods: {
      islogin() {
        if (localStorage.getItem('token') !== null) {
          this.$router.push('/account')
        } else{
          if(this.$route.query.rts !== undefined && this.$route.query.rts !== null && this.$route.query.rts !== ''){
            localStorage.setItem('rts', this.$route.query.rts)
          }
          if(this.$route.query.rtn !== undefined && this.$route.query.rtn !== null && this.$route.query.rtn !== ''){
            localStorage.setItem('rtn', this.$route.query.rtn)
          }
        }
        this.$dialog.loading.open('数据加载中...');
        this.axios('security/home/landing/index').then(res => {
          if (res.success) {
            this.slider = res.result.homeAdvImgUrl
            this.project = res.result.icProjectPojo
            this.notice = res.result.notices
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      /**
       * 获取验证码 & 验证
       */
      sendCode() {
        if (!this.username) {
          this.$dialog.toast({mes: '您还没有输入手机号码'});
          return
        } else if (!global.vMobile.test(this.username)) {
          this.$dialog.toast({mes: '输入的手机号码格式不正确'});
          return
        }
        if (this.isImgCode === true && this.validateCode.length === 4) {
          this.checkValidateCode()
        } else {
          this.sendSmsCode()
        }
      },
      sendSmsCode() {
        this.$dialog.loading.open('验证码发送中...');
        this.axios.post('security/send/sms/' + this.username + '?client_id=wap-1&client_secret=ER5P185J&phone_key=' + this.username).then(res => {
          if (res.success) {
            this.sendCodeStart = true
            this.$dialog.toast({mes: '验证码发送成功', icon: 'success'});
          } else if (res.error === 'MEMBER_NEED_VALIDATE_CODE_ERROR') {
            this.isImgCode = true
            this.$dialog.toast({mes: '由于您的操作过于频繁，请输入图形验证码'});
            this.getValidateCode()
          } else {
            this.$dialog.toast({mes: res.errorDescription});
          }
        })
      },
      //获取图片验证码
      getValidateCode() {
        this.axios.post('security/send/getValidateCode?client_id=wap-1&client_secret=ER5P185J&phone_key=' + this.username).then(res => {
          if (res.success) {
            this.validateCodeImg = 'data:image/png;base64,' + res.result.validateCode
          }
        })
      },
      //校验图片验证码
      checkValidateCode() {
        this.$dialog.loading.open('校验中...');
        this.axios.post('security/send/checkValidateCode?client_id=wap-1&client_secret=ER5P185J&phone_key=' + this.username + '&validate_code=' + this.validateCode).then((res) => {
          this.$dialog.loading.close();
          if (res.success) {
            this.isImgCode = false
            this.smsCode = ''
            this.validateCode = ''
            this.sendSmsCode()
          } else {
            this.validateCode = ''
            this.getValidateCode()
            this.$dialog.toast({mes: res.errorDescription});
          }
        })
      },
      //注册校验
      register() {
        if (!global.vMobile.test(this.username)) {
          this.$dialog.toast({mes: '输入的手机号码格式不正确'});
          return
        } else if (this.smsCode.length !== 6) {
          this.$dialog.toast({mes: '输入的短信验证码格式不正确'})
          return
        } else if (!global.vPassword.test(this.password)) {
          this.$dialog.toast({mes: '输入的密码格式不正确'})
          return
        }
        this.submitRegister()
      },
      submitRegister() {
        //提交注册
        this.$dialog.loading.open('注册中请稍后...')
        this.axios.get('security/auth/sms/check/' + this.username + '/code/' + this.smsCode + '?client_id=wap-1&client_secret=ER5P185J+&phone_key=' + this.username).then(res => {
          if (res.success) {
            this.registerTraceNo = localStorage.getItem('rtn')
            this.registerTraceSource = localStorage.getItem('rts')
            this.axios.post('security/register?client_id=wap-1&client_secret=ER5P185J', {
              mobile: this.username,
              password: this.password,
              registerType: 'wap',
              registerTraceNo: this.registerTraceNo,
              registerTraceSource: this.registerTraceSource
            }).then(res => {
              if (res.success) {
                var accesToken = res.result.access_token;
                localStorage.setItem('token', accesToken)
                localStorage.removeItem('rtn')
                localStorage.removeItem('rts')
                this.registerWin()
              } else {
                this.$dialog.toast({mes: res.result[0].defaultMessage});
              }
            })
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      registerWin() {
        this.$dialog.confirm({
          classname: 'register-win',
          title: '开通成功',
          mes: '<div class="register-info"><a href="/account/cash_reward">查看礼包 <i class="icon-arrow-right"></i></a> </div>',
          opts: [{
            txt: '开通银行资金存管账户',
            callback: () => {
              this.$router.replace('/account/certification')
            }
          }]
        });
      },
      openDetail() {
        this.$router.push('/product/' + this.project.id)
      },
      refreshPage(){
        this.$router.go(0)
      }
    },
    watch: {
      validateCode: function (val) {
        if (val.length === 4){
          this.checkValidateCode()
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .landing
    padding-bottom 1.6rem
    margin-bottom -.2rem
    min-height 100%
    background-color #f7333f
    .banner
      img
        width 100%
    .land-reg-box
      background no-repeat url("images/land_reg_bg.png")
      background-size 100%
    .land-reg
      margin 0 auto
      width 7.5rem
      padding .4rem

      .landReg-item
        position: relative
        padding-bottom .3rem
        &:last-child
          padding-bottom 0
        &.-protocol
          color rgba(255, 255, 255, .5)
          a
            text-decoration underline
        &.-valcode
          padding-right 3.1rem
        .land-icon
          position: absolute
          left .15rem
          top .16rem
          color #fa959b
          font-size .5rem !important
        .-codeImg
          position absolute
          right 0
          top 0
          width 2.8rem
          height: .88rem
          border-radius .15rem
        .-codeSms
          position absolute
          right 0
          top 0
          width 2.8rem
          height: .88rem
          border-radius .15rem
          background-color #f9ee07
          color #f62c37
          &.-disabled
            color #999
            background-color #dadada
        .land-input
          padding-left .8rem
          width 100%
          height .88rem
          font-size .28rem
          border: none
          background-color #fff
          border-radius .15rem
        .-btn-reg
          background-color #f9ee07
          color #f62c37

    .hot-project-box
      width 7.5rem
      margin .1rem auto .4rem
      padding .45rem 0
      min-height 5.8rem
      background url("images/hot_project_bg.png") no-repeat center top
      background-size contain
    .hot-project
      position relative
      width 6.7rem
      margin: .3rem auto
      padding: .4rem 0
      border-radius .15rem
      text-align: center;
      background-color #fff
      .header
        text-align: center;
        h3
          font-size .34rem
          color: #222
          font-weight normal
        p
          font-size .24rem
          color #bbb
      .props
        display flex
        width 90%
        margin 0 auto
        padding .54rem 0
        & dl
          flex 1
          & dt
            font-size .24rem
            color #bbb
          & dd
            color #d82d2d
            font-size .36rem
            & span
              font-size .6rem
      .btn
        width 90%
        padding 0
        height .9rem
        font-size .34rem
        background-color #f9ee07
        color #f62c37
  //倒计时
    .home-countdown
      display inline-block
      color #fff
      font-size .18rem
      height: .48rem
      margin-top .02rem
      vertical-align top
      i
        display: inline-block
        width .48rem
        height: .48rem
        line-height .45rem
        margin: 0 .04rem
        text-align: center
        color #fff
        border: 1px solid #fff
        font-size: .24rem
        vertical-align middle
        border-radius .1rem
    .superiority
      width 6.7rem
      margin 0 auto
      position: relative
      padding .4rem
      border-radius .15rem
      background-color #fff
      &:before
        content ''
        position absolute
        left 50%
        top -.8rem
        margin-left -1.3rem
        display block
        background url("images/superiority_title.png") no-repeat center center
        background-size contain
        width 2.61rem
        height .53rem
      dl
        padding-left 1.2rem
        padding-bottom .4rem
        &:last-child
          padding-bottom 0
        dt
          font-size .36rem
          font-weight 500
          color #f62c37
        dd
          color #9f9f9f
          font-size .3rem
        &:nth-child(1)
        &:nth-child(2)
          background url("images/superiority_1.png") no-repeat .1rem .13rem
          background-size .7rem .7rem
        &:nth-child(2)
          background-image url("images/superiority_3.png")

  .register-win
    width 6rem
    height: 8.2rem
    background-size 6rem 8.2rem
    background-image: url("/static/images/account/register_win_bg.png")
    background-position center center
    background-repeat no-repeat
    .confirm-hd
      display none
    .confirm-bd
      padding 5.5rem 0 .5rem
      text-align: center
      font-size .34rem
      color #f5c528
    .confirm-ft:after
      content inherit
      height: 0
      border: 0
    .confirm-ft
      .confirm-btn
        flex inherit
        margin 0 auto
        display block
        text-align: center
        font-size .34rem
        font-weight bold
        color #d82d2d
        width 4.16rem
        height: .96rem
        line-height .9rem
        background-color #f5c528
        border-bottom: .06rem solid #e19b08
        border-radius .5rem

  .cflc-appdown
    position fixed
    bottom: 0
    left: 0
    right: 0
    height: 1.2rem
    background-color rgba(255,255,255,.8)
    & img
      float: left;
      width 2.79rem
      height .89rem;
      margin-left .4rem
      margin-top .15rem
    & button
      float: right;
      margin-top .26rem
      margin-right .4rem
      background-color: rgb(246, 44, 55);
      width: 1.88rem;
      height: .68rem;
      border-radius .68rem
      border: 0
      color #fff;
      font-size .28rem
      line-height .68rem
</style>
