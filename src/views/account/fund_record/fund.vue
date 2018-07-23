<template>
  <layout>
  <div class="tab header-tab">
    <div class="tab-head">
    <i class="back-icon" @click="goBack()"></i>
    <ul class="tab-nav">
      <li class="tab-nav-item tab-active">
        <router-link to="./fund_record">资金纪录</router-link>
      </li>
      <li class="tab-nav-item">
        <router-link to="./recharge_record">充值记录</router-link>
      </li>
      <li class="tab-nav-item">
        <router-link to="./cash_record">提现记录</router-link>
      </li>
    </ul>
    </div>
    <div class="tab-panel" v-if="this.accountInfo !== null">
      <div class="notavailable" v-show="this.fundRecordList.length == 0">
        <img src="../../../../static/images/notavailable/not_fund.png" alt="暂无资金纪录~" class="not_icon">
        <p class="not_txt">暂无资金纪录~</p>
      </div>
      <infinitescroll :on-infinite="loadRecord" ref="loadFundRecord" v-show="this.fundRecordList.length !== 0">
        <div class="record-list" slot="list">
          <div class="record-item" v-for="item in fundRecordList"  @click="toggleMore(item)">
            <dl class="record-title">
              <dt>{{item.typeName}}</dt>
              <dd>{{item.createAt}}</dd>
            </dl>
            <dl class="record-info">
              <dt :class="[item.amountType == 'income' ? '-red': '',item.amountType == 'outlay' ? '-green': '']">{{item.amountType == 'outlay' ? '-' :'+'}}{{item.formatAmount}}</dt>
              <dd>余额：{{item.formatBalance}}元</dd>
            </dl>
            <div class="record-remark" :class="item.ismore ? '-show' : ''">
              <p>{{item.remark}}</p>
            </div>
            <i class="more"  v-if="item.remark !== undefined" :class="[item.ismore == false ? 'icon-arrow-next': 'icon-arrow-up']"></i>
          </div>
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
        fundRecordList: '',
        page: 0,
        size: 10,
        accountInfo: ''
      }
    },
    created(){
      this.isLogin()
    },
    methods: {
      goBack(){
        this.$router.push({path: '/account'})
      },
      isLogin(){
        const _token = localStorage.getItem('token')
        if (_token !== null) {
          const _accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
          if (_accountInfo !== null) {
            this.accountInfo = _accountInfo
            if (this.accountInfo.status === 'un_auth') {
              this.$router.replace('/account/certification')
            } else {
              this.loadRecord()
            }
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
            if (this.accountInfo.status === 'un_auth') {
              this.$router.replace('/account/certification')
            } else {
              this.loadRecord()
            }
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      loadRecord(){
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/finCapitalInOutLog/list?page=' + this.page + '&size=' + this.size).then(res => {
          if (res.success) {
            var _fundRecordList = res.result.content;
            if(_fundRecordList === undefined){
              _fundRecordList = null
            } else {
              for (var i = 0; i < _fundRecordList.length; i++) {
                if (_fundRecordList[i].remark !== undefined) {
                  _fundRecordList[i].ismore = false;
                }
              }
            }
            this.fundRecordList = [...this.fundRecordList, ...(_fundRecordList || [])];
//            console.log(this.fundRecordList)
            if (_fundRecordList === null || _fundRecordList.length < this.size || this.page === 10) {
              // 所有数据加载完毕
              this.$refs.loadFundRecord.$emit('cf.infinitescroll.loadedDone');
              return;
            }
            // 单次请求数据完毕
            this.$refs.loadFundRecord.$emit('cf.infinitescroll.finishLoad');
            this.page++
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      toggleMore(item){
        item.ismore = !item.ismore
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../assets/stylus/fund_record.styl"
</style>
