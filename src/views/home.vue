<template>
  <layout :showTabbar="true">
    <slider :autoplay="slider.length > 1 ? 5000 : 0"
            v-if="slider != undefined">
      <slider-item v-for="item in slider"
                   :key="item.id">
        <a :href="item.href"><img :src="item.image"></a>
      </slider-item>
    </slider>
    <rollnotice autoplay="5000"
                height="36"
                v-if="notice != undefined">
      <rollnotice-item v-for="item in notice"
                       :key="item.id">
        <router-link :to="'/article/notice/'+item.id">{{item.title}}</router-link>
      </rollnotice-item>
      <router-link to="/article/notice"
                   class="notice-more"
                   slot="right">更多
      </router-link>
    </rollnotice>

    <grids-group :rows="3"
                 class="home-guide">
      <grids-item link="/activity">
        <i slot="icon"
           class="icon-guide -activity"></i> <span slot="text">活动中心</span>
      </grids-item>
      <grids-item link="/activity/depository_guide">
        <i slot="icon"
           class="icon-guide -depository"></i> <span slot="text">银行存管</span>
      </grids-item>
      <grids-item link="/article/more">
        <i slot="icon"
           class="icon-guide -about"></i> <span slot="text">长富理财</span>
      </grids-item>
    </grids-group>
    <router-link tag="div"
                 to="/activity/newbiesem"
                 class="home-novice-gift"
                 v-if="isNoviceGift"></router-link>
    <div class="hot-project"
         @click="openDetail()"
         v-if="project !== undefined">
      <header class="header">
        <h3 v-if="project.novice == true">新手专享</h3>
        <h3 v-else>推荐项目</h3>
        <p>{{project.name}}</p>
      </header>
      <div class="props">
        <dl>
          <dd>
            <span>{{project.formatExpectAnnualizedRate}}</span>％<em v-if="project.extraAnnualizedRate > 0">+{{project.formatScale2ExtraAnnualizedRate}}%</em>
          </dd>
          <dt>预期年化</dt>
        </dl>
        <dl>
          <dd><span>{{project.period}}</span>{{project.formatPeriodType}}</dd>
          <dt>投资期限</dt>
        </dl>
      </div>
      <button class="btn btn-primary"
              v-if="project.status == 'wait_collection'">距离募集开始
        <countdown :time="project.startTimeCountDown"
                   timetype="second"
                   class="home-countdown"
                   format="<i>{%h}</i>:<i>{%m}</i>:<i>{%s}</i>"
                   doneText=""
                   :callback="refreshPage">
        </countdown>
      </button>
      <button class="btn btn-primary"
              v-else-if="project.status == 'collection'">{{project.minInvestAmount}}元起投 立即投资
      </button>
      <button class="btn btn-disabled"
              v-else-if="project.status == 'collection_end' || project.status == 'loan_finished' || project.status == 'failing'">
        已成立
      </button>
      <button class="btn btn-disabled"
              v-else-if="project.status == 'payed'">已完结
      </button>
    </div>
    <div class="jxbank-tips">
      <i class="icon-shield"></i>账户资金安全由渤海银行存管账户保障
    </div>

    <button class="btn">
      <router-link to="/demo"
                   class="notice-more">测试页面
      </router-link>


    </button>

    <button class="btn btn-primary">
      <router-link tag="div"
                   :to="{ name: 'demo',params: { title: 'hellowrodl'}}">fuck demo param</router-link>
    </button>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        slider: {},
        notice: '',
        project: '',
        isNoviceGift: true
      }
    },
    created() {
      this.getHome()
    },
    methods: {
      getHome() {
        if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== '') {
          this.isNoviceGift = false
        }
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('security/home/index').then(res => {
          if (res.success) {
            this.slider = res.result.homeAdvImgUrl
            this.project = res.result.icProjectPojo
            this.notice = res.result.notices
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      openDetail() {
        this.$router.push('/product/' + this.project.id)
      },
      refreshPage() {
        this.$router.go(0)
      }
    }
  }
</script>
<style lang="stylus"
       rel="stylesheet/stylus">

  .rollnotice
    position relative
    padding 0 .78rem
    &:before
      content '\e643'
      font-family iconfont
      position absolute
      top: 0
      line-height 36px
      color #666
      font-size .36rem
      left .3rem
    .rollnotice-item
      color #666
      & a
        display block
        width 90%
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    .notice-more
      position absolute
      right: .3rem
      top 0
      color #bbb
      line-height 36px

  .home-guide
    margin-bottom .2rem
    border-top 1px solid #eee
    .grids-item
      padding: .3rem 0
    .icon-guide
      display block
      width .66rem
      height: .62rem
      background-size .64rem .6rem
      background-repeat no-repeat
      background-position center center
      &.-about
        background-image url("../../static/images/home/about.png")
      &.-activity
        background-image url("../../static/images/home/activity.png")
      &.-depository
        background-image url("../../static/images/home/depository.png")
    & .grids-txt
      padding-top 0
      color #666

  .home-novice-gift
    width 100%
    height: 1.14rem
    background url("../../static/images/home/novice_gift.png") no-repeat center bottom
    background-size 7.5rem 1.14rem

  .hot-project
    padding: .3rem .3rem .5rem
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
      margin 0 auto
      width 90%
      padding 0
      height .9rem
      font-size .34rem

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

  .jxbank-tips
    padding: .3rem .3rem .1rem
    text-align: center;
    color #bbb
    & i
      color #fbc9c9
      margin-right .1rem

  @media screen and (max-width: 340px)
    .home-guide
      .grids-item
        padding .15rem

    .hot-project
      .props
        padding .3rem 0
</style>
