<template>
  <layout :showNavbar="isNavbar">
    <navbar slot="navbar" :title="$route.meta.title">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="carnival-hot">
      <div class="banner">
        <div class="activity-time">
          活动时间：{{initData.startTimeStamp | formatDateMD}} - {{initData.endTimeStamp | formatDateMD}}
        </div>
      </div>
      <div class="main">
        <div class="hour" v-if="serverTime <= eightDayStamp">
          <ul>
            <li>9:00</li>
            <li>11:00</li>
            <li>14:00</li>
            <li>16:00</li>
            <li>20:00</li>
          </ul>
          <i class="hour-state" :class="serverHourStatus" v-if="serverTime >= initData.startTimeStamp"></i>
        </div>
        <div class="hot-item -notStart" v-if="serverTime < initData.startTimeStamp"></div>
        <div class="hot-item -notItem"
             v-else-if="serverTime > initData.startTimeStamp && serverTime < initData.endTimeStamp && productList.length == 0"></div>
        <div class="hot-item -notEnd" v-else-if="serverTime > initData.endTimeStamp && productList.length == 0"></div>
        <div class="hot-list" v-else>
          <div class="hot-item" @click="goInvest(item.id)" v-for="item in productList">
            <h3>{{item.name}}</h3>
            <div class="hot-props">
              <dl>
                <dd><span>{{item.formatScale2ExpectAnnualizedRate}}<em>%</em></span>
                  +<span>{{item.formatScale2ExtraAnnualizedRate}}<i class="-raise"></i><em>%</em></span></dd>
                <dt>预期年化</dt>
              </dl>
              <dl>
                <dd><span>{{item.period}}</span>{{item.formatPeriodType}}</dd>
                <dt>项目期限</dt>
              </dl>
              <dl v-if="item.showTime">
                <dd>
                  <countdown :time="item.startTimeCountDown" timetype="second" doneText="" class="countdown" :callback="function(){item.showTime = false}">
                    <i>{%h}</i>: <i>{%m}</i>: <i>{%s}</i>
                  </countdown>
                </dd>
                <dt>即将开始</dt>
              </dl>
              <div v-else class="btn-invest">
                <progressbar v-if="item.status === 'collection' || item.status === 'wait_collection' " :progress="item.investAmount / item.totalAmount" trailWidth="10" trailColor="#e73516"></progressbar>
                <progressbar v-else :progress="1" trailWidth="10" trailColor="#e73516"></progressbar>
                <div class="-circle" v-if="item.status === 'collection' || item.status === 'wait_collection' ">抢</div>
                <div class="-circle -gray" v-if="item.status === 'collection_end' || item.status === 'loan_finished'
                 || item.status === 'overdue' || item.status === 'payed' || item.status === 'failing'">抢完</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rule">
        <h3 class="title">活动说明</h3>
        <ol>
          <li>活动时间：<br>{{initData.startTimeStamp | formatDate}} - {{initData.endTimeStamp | formatDate}}；</li>
          <li>活动期间，定时开放限量加息标，抢完即止；</li>
          <li>抢购时间：
            <ul>
              <li>{{initData.startTimeStamp | formatDate}} - {{eightDayStamp | formatDateMD}} 23:59:59期间，每天 9:00、11:00、14:00、16:00、20:00开放 60天、90天加息标各1个；</li>
              <li>{{nineDayStamp | formatDate}} - {{initData.endTimeStamp | formatDate}}期间，全天开放60天、90天加息标。</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
    <div slot="tabbar" class="carnival-menu">
      <ul>
        <li @click="goCarnival" class="-home">首页</li>
        <li @click="goCarnivalRecharge">欢乐<br>充值吧</li>
        <li @click="goCarnivalHot" class="-current">火热<br>加息场</li>
        <li @click="goCarnivalLottery">幸运<br>大转盘</li>
        <li @click="goCarnivalRanking">巅峰<br>排位赛</li>
      </ul>
    </div>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        isNavbar: true,
        initData: '',
        productList: '',
        serverTime: '',
        eightDay: '',
        eightDayStamp: '',
        nineDayStamp: '',
        serverhour: '',
        serverHourStatus: '',
      }
    },
    created() {
      sessionStorage.setItem("appdown", "false")
      if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
        localStorage.clear()
        this.isNavbar = false;
        window.location.href = encodeURI("cflc://jsbridge?type=open&name=show_share_button&share_url=" + window.location.protocol + "//" + window.location.host + "/activity/carnival_hot&share_qq_weixin_title=长富狂欢节 火热加息场&share_qq_weixin_dec=喜迎存管，全场最高可加息百分之五，助你收益加成！&share_pyq_dec=庆长富理财银行存管正式上线，全场给力加息百分之二至百分之五，收益涨得快！");
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
            this.initData = res.result.modulePojos[2]
            this.serverTime = res.result.serverTime
            //获取当前时间多少小时
            var _hh = new Date(this.serverTime)
            this.serverhour = _hh.getHours();
            if (this.serverhour >= 9 && this.serverhour < 11) {
              this.serverHourStatus = '-hour9'
            } else if (this.serverhour >= 11 && this.serverhour < 14) {
              this.serverHourStatus = '-hour11'
            } else if (this.serverhour >= 14 && this.serverhour < 16) {
              this.serverHourStatus = '-hour14'
            } else if (this.serverhour >= 16 && this.serverhour < 20) {
              this.serverHourStatus = '-hour16'
            } else if(this.serverhour >= 20){
              this.serverHourStatus = '-hour20'
            }
            // 前八天
            var _eightDayStamp = new Date(this.initData.startTimeStamp);
            _eightDayStamp.setDate(_eightDayStamp.getDate() + 7);
            this.eightDayStamp = new Date(_eightDayStamp).getTime();
            // 第九天
            var _nineDayStamp = new Date(this.initData.startTimeStamp);
            _nineDayStamp.setDate(_nineDayStamp.getDate() + 8)
            this.nineDayStamp = new Date(_nineDayStamp).getTime();
            if (this.serverTime < this.eightDayStamp) {
              this.getDayProduct()
            } else {
              this.getRangeProduct()
            }
          } else {
            this.$dialog.toast({mes: res.errorDescription})
            if(res.error === 'MC_ACTIVITY_THEME_NOT_EXIST_ERROR'){
              this.$router.replace('/')
            }
          }
        })

      },
      getRangeProduct() {
//        alert('aaa')
        this.axios.get('security/find/extraAnnualized/range/' + this.initData.moduleNo + '?limit=10').then(res => {
          if (res.success) {
            var _productList = res.result
            if (_productList !== undefined) {
              for (var i = 0; i < _productList.length; i++) {
                if (_productList[i].startTimeCountDown === undefined || _productList[i].startTimeCountDown <= 0) {
                  _productList[i].showTime = false;
                } else {
                  _productList[i].showTime = true;
                }
              }
              this.productList = _productList
            }
//                console.log(res)
          }
        })
      },
      getDayProduct() {
//        alert('bbb')
        this.axios.get('security/find/extraAnnualized/day/' + this.initData.moduleNo + '?limit=10').then(res => {
          if (res.success) {
            var _productList = res.result
            if (_productList !== undefined) {
              for (var i = 0; i < _productList.length; i++) {
                if (_productList[i].startTimeCountDown === undefined || _productList[i].startTimeCountDown <= 0) {
                  _productList[i].showTime = false;
                } else {
                  _productList[i].showTime = true;
                }
              }
              this.productList = _productList
            }
//                console.log(res)
          }
        })
      },
      goInvest(e) {
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          window.location.href = 'cflc://jsbridge?type=open&name=product_detail&id=' + e
        } else {
          this.$router.push('/product/' + e)
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
  .carnival-hot
    background-color #62B9FF
    .banner
      .activity-time
        margin 0 auto
        width 7.5rem
        padding-top 1.1rem
        padding-left 2.5rem
        color rgb(255, 228, 0)
        font-size .26rem
        font-weight bold
        text-shadow: 0 0 3px #394c91;
    .main
    .rule
      margin 0 auto
      width 7.5rem
    .banner
      height 2.8rem
      background url("images/hot/banner.png") no-repeat center top / contain
    .main
      padding .5rem
      .hour
        position: relative
        margin-bottom .5rem
        height .72rem
        ul
          position: absolute
          top: .04rem
          z-index 200
          display flex
          width 100%
          border-top 2px solid #000
          border-bottom 2px solid #000
          li
            width 20%
            height .56rem
            line-height .56rem
            text-align: center
            font-size 14px
        .hour-state
          position absolute
          left 0
          top: 0
          z-index 100
          height .72rem
          border-radius .72rem
          background-color #ffc21c
          &.-hour9
            width 20%
          &.-hour11
            width 40%
          &.-hour14
            width 60%
          &.-hour16
            width 80%
          &.-hour20
            width 100%
      .hot-item
        position relative
        margin-bottom .34rem
        padding: .25rem
        border: .03rem solid #222
        background-color #fff;
        border-radius .1rem
        &:after
          position absolute
          bottom: -.12rem
          left .15rem
          right .15rem
          content ''
          height .1rem
          border-radius 0 0 .1rem .1rem
          background-color #2196f4
          border: .03rem solid #222
          border-top: 0
        h3
          font-weight normal
        .hot-props
          position: relative
          &:after
            display: table;
            content: " ";
            clear: both;
          dl
            float: left;
            width 30%
            height 1.3rem
            &:first-child
              width 40%
            dd
              padding-top .4rem
              height .85rem
              font-size .22rem
              em
                font-size .22rem
              span
                position: relative
                font-size .32rem
                font-weight bold
                .-raise
                  display block
                  position: absolute
                  left .05rem
                  top -.34rem
                  width .64rem
                  height .32rem
                  background url("images/hot/icon_raise.png") no-repeat center top / contain
                  color #fff
            .countdown
              color #222
              i
                background-color #e73516
                border-color #222
                color #fff
            dt
              font-weight normal

          .btn-invest
            margin-left .2rem
            position: relative
            float: left;
            padding: 0;
            width 1.4rem;
            height 1.4rem
            border-radius 100%
            &:after
              content ''
              position absolute
              left 0rem
              top 0
              width 1.4rem
              height 1.4rem
              border-radius 100%
              border 1px solid #222
            .-circle
              position: absolute
              z-index 1000
              top: 50%
              left 50%
              margin -.62rem 0 0 -.62rem
              width 1.24rem
              height 1.24rem
              line-height 1.24rem
              text-align: center;
              font-size .4rem
              font-weight bold
              border 1px solid #222
              border-radius 100%
              background #ffc21c url("images/hot/btn_bg.png") no-repeat .6rem .12rem / .47rem .28rem
              &.-gray
                background-color #d5d5d5
        &.-notStart
        &.-notEnd
        &.-notItem
          position: relative
          height 4.2rem
          border-top 2px solid #000
          background #fff url("images/hot/hot_not_bg.png") no-repeat center 30% / 1.68rem 1.68rem
          &:before
            position: absolute
            top: 60%
            left 0
            right 0
            text-align: center;
            color #b3ddff
            content '尚未开始'
            font-weight bold
            font-size .68rem
        &.-notItem
          &:before
            content '暂无加息项目'
        &.-notEnd
          &:before
            content '活动已结束'
    .rule
      font-size .24rem
      padding .3rem .3rem 1.3rem
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
          ul
            padding-top .2rem
            padding-left .3rem
            li
              position relative
            li:after
              position absolute
              left -.28rem
              top: .06rem
              content ''
              display block
              overflow hidden
              width .17rem
              height .17rem
              background-color #ffce4a
              border-radius .17rem
              border 1px solid #222
</style>
