<template>
  <layout class="bg-white">
    <!--<navbar :title="$route.meta.title" slot="navbar">-->
    <!--<navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>-->
    <!--</navbar>-->
    <div class="landing">
      <div class="banner"><img src="../../landing/landing2/images/banner.jpg"></div>
      <div class="register-form">
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
            <input slot="right" type="password" autocomplete="off" maxlength="16" placeholder="登录密码（6-16位数字与字母组合）" class="land-input" v-model.trim="password">
          </div>
          <div class="landReg-item -protocol">注册即代表同意
            <router-link to="/protocol/register">长富理财注册协议</router-link>
          </div>
          <div class="landReg-item">
            <ibutton size="large" type="disabled" v-if="isImgCode">立即注册拿返现</ibutton>
            <ibutton size="large" type="disabled" v-else-if="isNaN(this.username) || username.length !== 11 || smsCode.length !== 6 || password.length < 6">立即注册拿返现</ibutton>
            <ibutton size="large" type="primary" class="-btn-reg" @click.native="register()" v-else>立即注册拿返现</ibutton>
            <!--<ibutton size="large" type="primary" @click.native="register()">注册领取666元大礼包</ibutton>-->
          </div>
        </div>
      </div>
      <div class="first-invest">
        <h3 class="title"></h3>
        <div class="info">
          <table class="reg-table">
            <tr>
              <th style="border-top-left-radius: 8px">首投满足投资条件</th>
              <th style="border-top-right-radius: 8px">获得奖励</th>
            </tr>
            <tr>
              <td>首次投资30天及以上非新手标理财产品</td>
              <td>投资金额*1.8%</td>
            </tr>
            <tr>
              <td>首次投资60天及以上非新手标理财产品</td>
              <td>投资金额*2.8%</td>
            </tr>
            <tr>
              <td style="border-bottom-left-radius: 8px">首次投资90天及以上非新手标理财产品</td>
              <td style="border-bottom-right-radius: 8px">投资金额*3.8%</td>
            </tr>
          </table>

        </div>
      </div>
      <div class="newbie">
        <h3 class="title"></h3>
        <div class="info">
          <table class="reg-table">
            <tr>
              <th style="border-top-left-radius: 8px">红包金额</th>
              <th>项目天数</th>
              <th style="border-top-right-radius: 8px">投资门槛</th>
            </tr>
            <tr>
              <td>28元</td>
              <td>投资30天及以上</td>
              <td>1000元及以上</td>
            </tr>
            <tr>
              <td>60元</td>
              <td>投资30天及以上</td>
              <td>6000元及以上</td>
            </tr>
            <tr>
              <td>100元</td>
              <td>投资30天及以上</td>
              <td>10000元及以上</td>
            </tr>
            <tr>
              <td>200元</td>
              <td>投资60天及以上</td>
              <td>10000元及以上</td>
            </tr>
            <tr>
              <td style="border-bottom-left-radius: 8px">300元</td>
              <td>投资90天及以上</td>
              <td style="border-bottom-right-radius: 8px">10000元及以上</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="rule">
        <h3 class="title"></h3>
        <ol class="info">
          <li>活动期间内通过本活动页面完成长富理财注册及首投才能获得奖励，活动结束后的首投不予返利奖励；</li>
          <li>新手标不参与本活动，投资新手标不予返利奖励；</li>
          <li>活动返利金额由长富理财平台发放到投资用户长富理财账户，发放时间为用户成功投资后5个工作日内，用户可以到长富理财账户可用余额查看；</li>
          <li>如发现任何作弊行为，长富理财有权取消该用户相关奖励；</li>
          <li>本活动最终解释权在法律允许范围内归长富理财所有，如有疑问请致电长富理财客服电话4000-998-799 <br>工作日9:00-20:00，节假日9:30-17:30</li>
        </ol>
      </div>
    </div>
    <div class="cflc-appdown">
      <img src="../../landing/landing2/images/logo.png" class="logo">
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
        } else {
          if (this.$route.query.rts !== undefined && this.$route.query.rts !== null && this.$route.query.rts !== '') {
            localStorage.setItem('rts', this.$route.query.rts)
          }
          if (this.$route.query.rtn !== undefined && this.$route.query.rtn !== null && this.$route.query.rtn !== '') {
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
      refreshPage() {
        this.$router.go(0)
      }
    },
    watch: {
      validateCode: function (val) {
        if (val.length === 4) {
          this.checkValidateCode()
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .landing
    padding-bottom 1rem
    margin-bottom -.2rem
    min-height 100%
    background-color #f7333f
    .banner
      img
        width 100%
    .register-form
      background url("images/reg_bg.jpg") no-repeat center top / contain
      padding-top 1.4rem
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

    .first-invest
      padding: .4rem
      .title
        height .43rem
        background url("images/first_invest_title.jpg") no-repeat center center / contain
      .info
        padding-top .3rem
    .newbie
      padding: .4rem
      .title
        height .43rem
        background url("images/newbie_title.jpg") no-repeat center center / contain
      .info
        padding-top .3rem
    .reg-table
      width 100%
      background-color #fff
      border-radius 8px
      border: 1px solid #fdd7d9;
      border-collapse: separate;
      border-spacing: 0;
      text-align: center;
      th
      td
        padding .2rem
        font-size .24rem
        white-space nowrap
        color #f62c37
        border: 1px solid #fdd7d9;
      th
        font-weight bold
        font-size .28rem

    .rule
      padding: .4rem
      color #fff
      .title
        height .43rem
        background url("images/rule_title.jpg") no-repeat center center / contain
      ol
        padding .3rem 0 0 .3rem
        li
          list-style decimal
          padding-bottom .12rem
          &:last-child
            margin-bottom 0

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
    background-color rgba(255, 255, 255, .8)
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
