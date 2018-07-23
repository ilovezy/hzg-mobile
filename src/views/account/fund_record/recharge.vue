<template>
  <layout>
  <div class="tab header-tab">
    <div class="tab-head">
    <i class="back-icon" @click="goBack()"></i>
    <ul class="tab-nav">
      <li class="tab-nav-item">
        <router-link to="./fund_record">资金纪录</router-link>
      </li>
      <li class="tab-nav-item tab-active">
        <router-link to="./recharge_record">充值记录</router-link>
      </li>
      <li class="tab-nav-item">
        <router-link to="./cash_record">提现记录</router-link>
      </li>
    </ul>
    </div>
    <div class="tab-panel">
      <div class="notavailable" v-show="this.rechargeRecordList.length == 0">
        <img src="../../../../static/images/notavailable/not_fund.png" alt="暂无待成立项目~" class="not_icon">
        <p class="not_txt">暂无资金纪录~</p>
      </div>
      <infinitescroll :on-infinite="loadRechargeRecord" ref="loadFundRecord" v-show="this.rechargeRecordList.length !== 0">
        <div class="record-list" slot="list">
          <div class="record-item" v-for="item in rechargeRecordList" @click="toggleMore(item)">
            <dl class="record-title">
              <dt>{{item.payMethodName}}</dt>
              <dd>{{item.formatCreateAt}}</dd>
            </dl>
            <dl class="record-info">
              <dt :class="[item.status == 'success' ? '-red': '',item.status == 'processing' ? '-green': '']">{{item.formatAmount}}</dt>
              <dd>{{item.statusName}}</dd>
            </dl>
            <div class="record-remark" :class="item.ismore ? '-show' : ''">
              <p>流水号：{{item.rechargeNo}}</p>
              <p v-if="item.remarks !== undefined">失败原因：{{item.remarks}}</p>
            </div>
            <i class="more" :class="[item.ismore == false ? 'icon-arrow-next': 'icon-arrow-up']" ></i>
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
        rechargeRecordList: '',
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
              this.loadRechargeRecord()
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
              this.loadRechargeRecord()
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
      loadRechargeRecord(){
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/finRechargeLog/certification/list?page=' + this.page + '&size=' + this.size).then(res => {
          if (res.success) {
            var _rechargeRecordList = res.result.content;
            if(_rechargeRecordList === undefined){
              _rechargeRecordList = null
            } else {
              for (var i = 0; i < _rechargeRecordList.length; i++) {
                _rechargeRecordList[i].ismore = false;
              }
            }
            this.rechargeRecordList = [...this.rechargeRecordList, ...(_rechargeRecordList || [])];
//            console.log(this.rechargeRecordList)
            if (_rechargeRecordList === null || _rechargeRecordList.length < this.size || this.page === 10) {
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
