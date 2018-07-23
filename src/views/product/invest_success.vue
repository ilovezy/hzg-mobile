<template>
  <layout  class="bg-white">
    <navbar slot="navbar" :title="$route.meta.title"></navbar>
    <div class="invest-success">
      <div class="icon"></div>
      <h3 class="title">操作成功</h3>
      <div class="info">{{projectData.projectName}}<br>投资本金：{{projectData.formatUsedCapital}}元</div>
      <div class="btn-control">
        <router-link to="/product" class="btn-primary">继续投资</router-link>
        <router-link to="/account/wait_establish_invests" class="btn-primary">查看投资记录</router-link>
      </div>
      <div class="prompt">操作中如有疑问，请致电长富理财客服热线400-099-8799</div>
    </div>

  </layout>
</template>
<script>
  export default {
    data () {
      return {
        projectData: {}
      }
    },
    created(){
      if(this.$route.params.projectName !== undefined){
        this.projectData = this.$route.params
      } else {
        this.$router.push('/product')
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .invest-success
    position absolute
    bottom: 0
    left: 0
    right:0
    top:0
    padding: .5rem
    text-align: center
    .icon
      display inline-block
      margin-bottom .5rem
      width 1.32rem
      height: 1.92rem
      background url("/static/images/proudct/invest_success.png") no-repeat
      background-size 1.32rem 1.92rem
    .title
      font-size: .4rem;
      font-weight 600
      color: #D82D2D;
    .info
      padding-top .2rem
      color #666
      line-height 2
    .btn-control
      display: flex;
      display: -webkit-flex;
      width: 100%;
      padding-top: 1.4rem;
      .btn-primary
        flex: 1;
        -webkit-flex: 1;
        width: 100%;
        display: inline-block;
        height: .9rem;
        line-height: .9rem;
        background: #d82d2d;
        border-radius: 3px;
        color: #fff;
        text-align: center;
        font-size: .28rem;
        text-decoration: none;
        border: 0;
      .btn-primary:hover
        text-decoration: none;
        color: #fff;
      .btn-primary:nth-child(2)
        margin-left: .3rem;
    .prompt
      position: absolute;
      left: 0;
      right: 0;
      bottom: .3rem;
      text-align: center;
      font-size: .24rem;
      color: #bbb;
</style>
