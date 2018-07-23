<template>
  <layout class="bg-white">

  </layout>
</template>
<script>
  export default {
    data() {
      return {
        accountInfo: '',
        trueName: '',//真实姓名
        idNumber: '',//真实身份证号
        bankCard: '',//借记卡号
        depositoryMsg: '',//存管开通后信息
        smsCode: '',
        sendCodeStart: false,
        srvAuthCode: ''
      }
    },
    created() {
      this.openCertification()
    },
    methods: {
      // 提交开户表单
      openCertification() {
        this.$dialog.loading.open('正在提交...');
        this.axios.post('auth/ucMemebe/api/certification').then(res => {
          if (res.success) {
            //跳转渤海银行
            window.location.href = res.result
          } else if (res.error === 'MEMBER_HAS_CERTIFICATION_ERROR') {
            this.$dialog.toast({mes: '您已成功开通银行存管账户'})
            this.$router.push('/account/depository')
          } else if (res.error === 'MEMBER_CERTIFICATION_CHECK_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            this.$router.push('/account/depository')
          } else{
            this.$dialog.toast({mes: res.errorDescription})
            this.$router.push('/account')
          }
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .depository-win
    width 7rem
    background-color #fff
    .confirm-hd
      position: relative
      padding 0
      background-color #d82d2d
      border-radius .1rem .1rem 0 0
      &:before
        font-family "iconfont";
        content '\e642'
        position: absolute
        left: 50%
        top: -.8rem
        margin-left -.8rem
        width 1.6rem
        height: .8rem
        border-radius 1.6rem 1.6rem 0 0
        line-height 1rem
        font-size .6rem
        background-color #d82d2d
        color #fff
      .confirm-title
        z-index 10
        padding 0
        height 1rem
        line-height 1rem
        font-size .34rem
        font-weight 700
        color #fff
    .confirm-bd
      padding 0;
      background-color #d82d2d
      .depository-info
        padding .3rem
        margin 0 .2rem
        color #fff
        border-radius .1rem .1rem 0 0
        background-image: linear-gradient(-214deg, #f95538 0%, #f93251 100%);
        box-shadow: 0 -10px 15px 0 rgba(216, 44, 44, 0.34), 0 -3px 5px 0 rgba(216, 45, 45, 0.36);
        h3
          text-align left
          font-size .28rem
        dt
          font-size .4rem
          padding .25rem 0
          font-weight bold
          margin-bottom .2rem
          text-align: center;
        dd
          font-size .24rem
          text-align: left;
          line-height 1.6
      .depository-hint
        padding-top .48rem
        text-align: center
        background-color #fff
        span
          display block
          position relative
          width 4.8rem
          text-align: center;
          margin 0 auto
          &:after
            position: absolute
            left -.25rem
            top: 0
            font-size .6rem
            color #d82d2d
            font-family "iconfont";
            content '\e641'
    .confirm-ft
      margin-top 0
      padding .3rem .5rem .5rem
      &:after
        border: 0
      .confirm-btn
        flex inherit
        width 4rem
        margin 0 auto
        background: #d82d2d;
        height: 1rem
        color #fff
        font-size .34rem
        line-height 1rem
        border-radius: 2rem;
        border-bottom .06rem solid #c20b0b
</style>
