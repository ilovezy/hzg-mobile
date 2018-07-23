<template>
  <layout class="bg-white">
    <navbar slot="navbar" :title="$route.meta.title">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="friends-list">
      <div class="friends-total">已累计邀请好友 {{total}} 人</div>
      <div class="friends-item -header">
        <span class="friends-name">好友</span>
        <span class="friends-depository">开通存管</span>
        <span class="friends-invest">是否投资</span>
      </div>
      <div class="notavailable" v-show="friendsList.length == 0"><img src="../../../../static/images/notavailable/not_available.png" alt="暂无信息~" class="not_icon"><p class="not_txt">暂无信息~</p></div>
      <infinitescroll :on-infinite="getFriendsList" ref="loadFriendsList">
        <div class="friends-item" v-for="item in friendsList" slot="list">
          <span class="friends-name">
            {{item.mobileMask}}
            <time>{{item.registerTime}}</time>
          </span>
          <span class="friends-depository"><i :class="item.status == 'un_auth' ? 'icon-line' : 'icon-succeed'"></i></span>
          <span class="friends-invest"><i :class="item.hasInvested == false ? 'icon-line' : 'icon-succeed'"></i></span>
        </div>
      </infinitescroll>
    </div>
  </layout>
</template>
<script>
  export default {
    data () {
      return {
        friendsList:'',
        page: 0,
        size: 10,
        total: ''
      }
    },
    created(){
      this.getFriendsList()
    },
    methods: {
      goBack(){
        this.$router.back()
      },
      getFriendsList(){
        this.axios.post('auth/ucMemebe/fans?page='+ this.page + '&size=' + this.size).then(res=>{
          if (res.success) {
            this.total = res.result.totalElements
            var _friendsList = res.result.content
            if(_friendsList === undefined){
              _friendsList = null
            }
            this.friendsList = [...this.friendsList, ...(_friendsList || [])];
            if (_friendsList === null || _friendsList.length < this.size || this.page === 10) {
              // 所有数据加载完毕
              this.$refs.loadFriendsList.$emit('cf.infinitescroll.loadedDone');
              return;
            }
            // 单次请求数据完毕
            this.$refs.loadFriendsList.$emit('cf.infinitescroll.finishLoad');
            this.page++;
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .friends-list
    .friends-total
      background: #D82D2D url("../../../../static/images/account/icon_friends.png") no-repeat .4rem .6rem;
      background-size .54rem .44rem
      color #fff
      padding .7rem .7rem .7rem 1.2rem
      height 1.8rem
      font-size .28rem
    .friends-item
      padding: .4rem
      overflow hidden
      background-color #fff
      border-bottom 1px solid #eee
      & span
        display block
        float: left;
        text-align: center;
        .icon-succeed
          line-height .55rem
          font-size .3rem
          color #D82D2D
        .icon-line
          display block
          margin .3rem auto 0
          overflow hidden
          width .22rem
          height .04rem
          border-radius .04rem
          background-color #bbb
      .friends-name
        width 40%
        color #666
        text-align: left;
        font-size .28rem
        & time
          padding-top .05rem
          font-size .2rem
          color #bbb
      .friends-depository
        width 30%
      .friends-invest
        width 30%
      &.-header
        margin-top -.1rem
        color #666
        padding 0 .4rem
        height: .6rem
        line-height .6rem
        border-radius .1rem .1rem 0 0
        background: #F5F5F5;
        box-shadow: 0 -2px 6px 0 rgba(0,0,0,0.10);
</style>
