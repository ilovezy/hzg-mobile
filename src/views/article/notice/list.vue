<template>
  <layout>
  <div class="tab header-tab">
    <div class="tab-head">
    <i class="back-icon" @click="goBack()"></i>
    <ul class="tab-nav">
      <li class="tab-nav-item tab-active">
        <router-link to="/article/notice">平台公告</router-link>
      </li>
      <li class="tab-nav-item">
        <router-link to="/article/message">我的消息</router-link>
      </li>
    </ul>
    </div>
    <div class="tab-panel">
      <div class="notavailable" v-show="noticelist.length == 0"><img src="../../../../static/images/notavailable/not_available.png" alt="暂无网站公告~" class="not_icon"><p class="not_txt">暂无网站公告~</p></div>
      <infinitescroll :on-infinite="loadNoticeList" ref="loadNoticeList" v-show="noticelist.length !== 0">
        <div class="article-list" slot="list">
          <router-link tag="article" :to="{ name: 'notice_detail',params: { noticeId: item.id }}" class="article-item" v-for="item in noticelist" :key="item.id">
            <time>{{item.createAt}}</time>
            <header>
              <h2>{{item.title}}</h2>
            </header>
            <p class="note">{{item.description}}</p>
          </router-link>
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
        noticelist: '',
        page: 0,
        pageSize: 10
      }
    },
    created() {
      this.loadNoticeList()
    },
    methods: {
      goBack(){
        this.$router.back()
      },
      loadNoticeList() {
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('security/notice/list' + '?page=' + this.page + '&size=' + this.pageSize).then(res => {
          var _noticelist = res.result.content
          if(_noticelist === undefined){
            _noticelist = null
          }
          this.noticelist = [...this.noticelist, ...(_noticelist || [])];
          if ( _noticelist == null || _noticelist.length < this.pageSize || this.page == 10) {
            // 所有数据加载完毕
            this.$refs.loadNoticeList.$emit('cf.infinitescroll.loadedDone');
            return;
          }
          // 单次请求数据完毕
          this.$refs.loadNoticeList.$emit('cf.infinitescroll.finishLoad');
          this.page++;
        });
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../../assets/stylus/article.styl"
</style>
