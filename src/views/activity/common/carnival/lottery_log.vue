<template>
  <layout :showNavbar="isNavbar">
    <navbar slot="navbar" :title="$route.meta.title">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="carnival-lottery-log">
        <div class="header"></div>
        <div class="body">
          <div class="not-prize-log" v-show="prizeLogList.length === 0 && activeStatus === 'start'">
            <div class="text">幸运大转盘中奖率100%，<br>赶紧投资去赢得奖品吧！</div>
            <div class="btn-invest" @click="goInvest()">立即去投资</div>
          </div>
          <div class="not-prize-log" v-show="prizeLogList.length === 0 && activeStatus === 'end'">
            <div class="text">很抱歉，您没有任何奖品！</div>
          </div>
          <infinitescroll :on-infinite="loadPrizeLogList" ref="refPrizeLogList" v-show="prizeLogList.length !== 0" >
            <div slot="list" class="prize-log-list">
              <div class="prize-log-item" v-for="item in prizeLogList"><span class="-prize"><img :src="prizePicList[item.prizeCode]"></span><span class="-name">{{item.prizeResultMsg}}</span><span class="-time">{{item.createAt}}</span></div>
            </div>
          </infinitescroll>
        </div>
    </div>
  </layout>
</template>
<script>
  export default {
    data () {
      return {
        isNavbar: true,
        initData:'',
        serverTime: '',
        activeStatus:'',
        page: 0,
        pageSize: 12,
        prizeLogList:'',
        prizePicList: [
          require('./images/lottery/pic_log_iphone.png'),
          require('./images/lottery/pic_log_integral118.png'),
          require('./images/lottery/pic_log_jd100.png'),
          require('./images/lottery/pic_log_integral28.png'),
          require('./images/lottery/pic_log_jd300.png'),
          require('./images/lottery/pic_log_rate.png'),
          require('./images/lottery/pic_log_reward.png'),
          require('./images/lottery/pic_log_integral28.png'),
        ]
      }
    },
    created(){
      sessionStorage.setItem("appdown", "false")
      if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
        localStorage.clear()
        this.isNavbar = false
      }
      this.getInit()
    },
    methods: {
      goBack(){
        this.$router.push('/activity/carnival_lottery')
      },
      getInit() {
        this.axios.get('security/find/activity/bhbk').then(res => {
          if (res.success) {
            this.initData = res.result.modulePojos[1]
            this.serverTime = res.result.serverTime
            if((this.initData.startTimeStamp - this.serverTime) > 0){
              this.activeStatus = 'notstart'
              this.$router.push('/activity/carnival')
            } else if((this.initData.endTimeStamp - this.serverTime) > 0){
              this.activeStatus = 'start'
            } else if((this.initData.endTimeStamp - this.serverTime) < 0){
              this.activeStatus = 'end'
            }
            this.loadPrizeLogList()
          } else if (res.error === 'MC_ACTIVITY_THEME_NOT_EXIST_ERROR') {
            this.$router.replace('/')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      loadPrizeLogList(){
        this.$dialog.loading.open('数据加载中...');
        this.axios.post('auth/finPoint/activity/lotteryLog/bhbk_lottery?page=' + this.page + '&size=' + this.pageSize).then(res=>{
          if (res.success){
            var _prizeLogList = res.result.content
            if(_prizeLogList === undefined){
              _prizeLogList = null
            }
            this.prizeLogList = [...this.prizeLogList, ...(_prizeLogList || [])];
            if (_prizeLogList === null || _prizeLogList.length < this.pageSize) {
              this.$refs.refPrizeLogList.$emit('cf.infinitescroll.loadedDone');
              return;
            } else {
              this.$refs.refPrizeLogList.$emit('cf.infinitescroll.finishLoad');
              this.page++;
            }
          } else {
            localStorage.clear()
            if(this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android'){
              this.$router.push('/activity/carnival_lottery?os=' + this.$route.query.os)
            } else {
              this.$router.push('/activity/carnival_lottery')
            }
          }
        })
      },
      goInvest() {
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          window.location.href = 'cflc://jsbridge?type=open&name=product_list'
        } else {
          this.$router.push('/product')
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .carnival-lottery-log
    margin 0 auto -.2rem
    padding .36rem 0
    min-height 100%
    background #ffe900
    .header
    .body
      margin 0 auto
      width 6.83rem
    .header
      position relative
      z-index 100
      height .77rem
      padding-top .36rem
      background url("images/lottery/lottery_log_title.png") no-repeat center top / contain
    .body
      margin-top -.77rem
      padding 1rem .3rem .5rem
      width 6.26rem
      min-height 9.5rem
      background-color #fff
      border: .02rem solid #222
      border-top: 0
      .prize-log-item
        display flex
        padding: .3rem 0
        height 1rem
        span
          display inline-block
          white-space nowrap
          line-height .8rem
          &.-prize
            display flex
            height .8rem
            width 1.3rem
            text-align: center;
            flex-direction: column;
            justify-content: center;
            img
              margin 0 auto
              vertical-align middle
              max-width .8rem
              max-height .75rem
          &.-name
            width 1.8rem
          &.-time
            width 2.3rem

      .not-prize-log
        padding 3rem 0
        text-align: center;
        .text
          font-size .36rem
          padding-bottom .3rem
        .btn-invest
          margin 0 auto
          width 4.24rem
          height 1.02rem
          line-height .9rem
          text-align: center
          color #fff
          font-weight bold
          font-size .36rem
          background url("images/ranking/btn_invest.png") no-repeat center top / 4.24rem 2.14rem
</style>
