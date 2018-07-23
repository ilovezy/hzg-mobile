<template>
  <layout>
    <navbar slot="navbar" :title="$route.meta.title">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="notavailable" v-show="this.activityList.length == 0">
      <img src="../../../static/images/notavailable/not_product_log.png" alt="暂无活动~" class="not_icon">
      <p class="not_txt">暂无活动~</p>
    </div>
    <infinitescroll :on-infinite="getActivityList" ref="loadActivityList" v-show="this.activityList.length !== 0">
      <div class="activity-list" slot="list">
        <div class="activity-item" v-for="item in activityList" :class="item.activityStatus == 'end' ? '-end' : ''" @click="activityLink(item)">
          <h3 v-text="item.activityTitle">注册大礼包</h3>
          <time v-if="item.endTime == undefined"><span>长期有效</span></time>
          <time v-else>{{item.startTime}}  -  {{item.endTime}}</time>
          <img class="activity-pic" :src="item.imageUrl">
        </div>
      </div>
    </infinitescroll>
  </layout>
</template>
<script>
  export default {
    data () {
      return {
        activityList: '',
        page: 0,
        size: 10
      }
    },
    created(){
      this.getActivityList()
    },
    methods: {
      goBack(){
        this.$router.back()
      },
      getActivityList(){
        this.$dialog.loading.open('数据加载中...');
        this.axios.post('security/find/activity/list?page=' + this.page + '&size=' + this.size).then(res => {
          var _activityList = res.result.content
          if (_activityList === undefined){
            _activityList = null
          }
          this.activityList = [...this.activityList, ...(_activityList || [])];
          if (_activityList === null || _activityList.length < this.size || this.page === 10) {
            // 所有数据加载完毕
            this.$refs.loadActivityList.$emit('cf.infinitescroll.loadedDone');
            return;
          }
          // 单次请求数据完毕
          this.$refs.loadActivityList.$emit('cf.infinitescroll.finishLoad');
          this.page++;
        })
      },
      activityLink(item){
        if(item.hrefUrl !== undefined){
          if (item.hrefType === 'article') {
            this.$router.push('/article/notice/' + item.hrefUrl)
          } else if (item.hrefType === 'h5') {
            window.location.href = item.hrefUrl
          }
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .activity-list
    .activity-item
      background-color #fff
      padding: .3rem
      margin-top .2rem
      h3
        font-size .34rem
        font-weight normal
        color #333
      time
        margin-bottom .3rem
        font-size .2rem
        color #bbb
      .activity-pic
        width 100%
      &.-end
        img
          filter: grayscale(100%);
          filter: gray;
        h3
          color #bbb
</style>
