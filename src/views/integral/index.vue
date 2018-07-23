<template>
  <layout :showTabbar="true" title="积分">
    <navbar slot="navbar" :title="$route.meta.title"></navbar>
    <slider autoplay="5000" v-if="slider != undefined">
      <slider-item v-for="item in slider" :key="item.id">
        <a :href="item.href" :target="item.targetBlank == '1' ? '_blank': '_self'"><img :src="item.image"></a>
      </slider-item>
    </slider>
    <grids-group :rows="4" class="home-guide">
      <grids-item link="/activity/martial_club">
        <i slot="icon" class="icon-guide -activity"></i> <span slot="text">开武馆</span>
      </grids-item>
      <grids-item link="/activity">
        <i slot="icon" class="icon-guide -activity"></i> <span slot="text">富利社</span>
      </grids-item>
      <grids-item link="/activity/depository_guide">
        <i slot="icon" class="icon-guide -depository"></i> <span slot="text">积分任务</span>
      </grids-item>
      <grids-item link="/article/more">
        <i slot="icon" class="icon-guide -about"></i> <span slot="text">我的积分</span>
      </grids-item>
    </grids-group>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        appdown: true,
        slider: '',
        notice: '',
        project: '',
        isNoviceGift: true
      }
    },
    created() {
      this.initData()
    },
    methods: {
      initData() {
        if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== '') {
          this.isNoviceGift = false
        }
        this.axios.get('security/find/find/point/index').then(res=>{
          if (res.success) {
            this.slider = res.result.appPointTopBanners
            console.log()
          }
        })
      },
      openDetail() {
        this.$router.push('/product/' + this.project.id)
      },
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
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
        background-image url("../../../static/images/home/about.png")
      &.-activity
        background-image url("../../../static/images/home/activity.png")
      &.-depository
        background-image url("../../../static/images/home/depository.png")
    & .grids-txt
      padding-top 0
      color #666
</style>
