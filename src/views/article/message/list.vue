<template>
  <layout>
  <div class="tab header-tab">
    <div class="tab-head">
    <i class="back-icon" @click="goBack()"></i>
    <ul class="tab-nav">
      <li class="tab-nav-item">
        <router-link to="/article/notice">平台公告</router-link>
      </li>
      <li class="tab-nav-item tab-active">
        <router-link to="/article/message">我的消息</router-link>
      </li>
    </ul>
    </div>
    <div class="tab-panel">
      <div class="notavailable" v-show="messagelist.length == 0"><img src="../../../../static/images/notavailable/not_available.png" alt="暂无消息~" class="not_icon"><p class="not_txt">暂无消息~</p></div>
      <infinitescroll :on-infinite="loadMessagelist" ref="loadMessagelist" v-show="messagelist.length !== 0">
        <div class="article-list" slot="list">
          <article class="article-item -message" :class="[item.status == 'read' ? '-read' : '',item.isToggle ? '-toggle' : '']" v-for="item in messagelist" :key="item.id" @click="messageToggle(item)">
            <time>{{item.createAt}}</time>
            <header>
              <h2>{{item.subject}}</h2>
            </header>
            <p class="note">{{item.content}}</p>
          </article>
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
        messagelist: '',
        page: 0,
        pageSize: 10
      }
    },
    created() {
      this.isLogin()
    },
    methods: {
      goBack(){
        this.$router.back()
      },
      isLogin(){
        const _token = localStorage.getItem('token')
        if (_token !== null) {
          const _accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
          if (_accountInfo !== null) {
            this.accountInfo = _accountInfo
            this.loadMessagelist()
          } else {
            this.getUserInfo()
          }
        } else {
          this.$dialog.toast({mes: '您还没有登录或登录已失效，请重新登录！'})
          localStorage.clear()
          this.$router.push('/login')
        }
      },
      getUserInfo(){
        //获取账户信息
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/ucMemebe/info').then(res => {
          if (res.success) {
            this.accountInfo = res.result
            localStorage.setItem('accountinfo', JSON.stringify(res.result))
            this.loadMessagelist()
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      loadMessagelist() {
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('/auth/msgMessageLog/list' + '?page=' + this.page + '&size=' + this.pageSize).then(res => {
          if (res.success) {
            var _messagelist = res.result.content
            if(_messagelist !== undefined) {
              for (var i = 0; i < _messagelist.length; i++) {
                _messagelist[i].isToggle = false;
              }
            } else {
              _messagelist = null
            }
            this.messagelist = [...this.messagelist, ...(_messagelist || [])];
            if (_messagelist === null || _messagelist.length < this.pageSize || this.page === 10) {
              // 所有数据加载完毕
              this.$refs.loadMessagelist.$emit('cf.infinitescroll.loadedDone');
              return;
            }
            // 单次请求数据完毕
            this.$refs.loadMessagelist.$emit('cf.infinitescroll.finishLoad');
            this.page++;
          } else {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          }
        });
      },
      messageToggle(item){
        item.isToggle = !item.isToggle
        if(item.status !== 'read'){
          this.axios.post('auth/msgMessageLog/read/'+item.id).then(res=>{
            if (res.success){
              item.status = 'read'
            }
          })
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../../assets/stylus/article.styl"
</style>
