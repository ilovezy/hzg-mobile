<template>
  <layout class="bg-white">
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="myfund">
      <h1 class="title">{{fund.formatFund}}元</h1>
      <div class="not-mymoney" v-if="fund.fund == 0"></div>
      <div class="charts" v-else>
        <div id="myChart" :style="{width:'100%',height:'3rem'}"></div>
      </div>
      <cell-group class="myfund-cell">
        <cell-item>
          <div slot="left" class="showBar" id="chart1"></div>
          <span slot="left">可用余额</span> <span slot="right">{{fund.formatAvailableBalance}}元</span>
        </cell-item>
        <cell-item>
          <div slot="left" class="showBar" id="chart2"></div>
          <span slot="left">冻结金额 <i @click="toastNone()" class="icon-question"></i></span>
          <span slot="right">{{fund.formatFrozenAssets}}元</span>
        </cell-item>
        <cell-item style="margin-top: .5rem">
          <div slot="left" class="showBar" id="chart3"></div>
          <span slot="left">待收本金</span> <span slot="right">{{fund.formatFoundedPrincipal}}元</span>
        </cell-item>
        <cell-item>
          <div slot="left" class="showBar" id="chart4"></div>
          <span slot="left">待收利息</span> <span slot="right">{{fund.formatExpectInterest}}元</span>
        </cell-item>
        <i></i>
      </cell-group>
    </div>
  </layout>
</template>
<script>
  var echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie');
  export default {
    data() {
      return {
        fund: Array,
        optionData: [{value: 0, name: '可用余额', itemStyle: {normal: {color: '#ff4858'}, emphasis: {color: '#ff4858'}}},
          {value: 0, name: '冻结金额', itemStyle: {normal: {color: '#fdc748'}, emphasis: {color: '#fdc748'}}},
          {value: 0, name: '待收本金', itemStyle: {normal: {color: '#5add3a'}, emphasis: {color: '#5add3a'}}},
          {value: 0, name: '待收利息', itemStyle: {normal: {color: '#48b1ff'}, emphasis: {color: '#48b1ff'}}}],
        showBar1Data: [{value: 0, name: '可用余额', itemStyle: {normal: {color: '#ff4858'}, emphasis: {color: '#ff4858'}}},
          {value: 0, name: '其他金额', itemStyle: {normal: {color: '#f3f3f3'}, emphasis: {color: '#f3f3f3'}}}],
        showBar2Data: [{value: 0, name: '冻结金额', itemStyle: {normal: {color: '#fdc748'}, emphasis: {color: '#fdc748'}}},
          {value: 0, name: '其他金额', itemStyle: {normal: {color: '#f3f3f3'}, emphasis: {color: '#f3f3f3'}}}],
        showBar3Data: [{value: 0, name: '待收本金', itemStyle: {normal: {color: '#5add3a'}, emphasis: {color: '#5add3a'}}},
          {value: 0, name: '其他金额', itemStyle: {normal: {color: '#f3f3f3'}, emphasis: {color: '#f3f3f3'}}}],
        showBar4Data: [{value: 0, name: '待收利息', itemStyle: {normal: {color: '#48b1ff'}, emphasis: {color: '#48b1ff'}}},
          {value: 0, name: '其他金额', itemStyle: {normal: {color: '#f3f3f3'}, emphasis: {color: '#f3f3f3'}}}],
        accountInfo: ''
      }
    },
    created() {
      this.isLogin()
    },
    methods: {
      toastNone() {
        this.$dialog.toast({
          mes: '<div style="font-size:.26rem">冻结金额＝提现在途金额＋投资冻结金额</div>',
          timeout: 3000
        });
      },
      goBack() {
        this.$router.back()
      },
      isLogin() {
        const _token = localStorage.getItem('token')
        if (_token !== null) {
          const _accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
          if (_accountInfo !== null) {
            this.accountInfo = _accountInfo
            if (this.accountInfo.status === 'un_auth') {
              this.$router.replace('/account/certification')
            } else {
              this.getFund()
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
      getUserInfo() {
        //获取账户信息
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/ucMemebe/info').then(res => {
          if (res.success) {
            this.accountInfo = res.result
            localStorage.setItem('accountinfo', JSON.stringify(res.result))
            if (this.accountInfo.status === 'un_auth') {
              this.$router.replace('/account/certification')
            } else {
              this.getFund()
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
      getFund() {
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/myFund/index').then(res => {
          if (res.success) {
            this.fund = res.result
            this.showEchart()
            this.showChart1()
            this.showChart2()
            this.showChart3()
            this.showChart4()
          } else {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.push('/login')
          }
        })
      },
      showEchart() {
        this.optionData[0].value = this.fund.availableBalance
        this.optionData[1].value = this.fund.frozenAssets
        this.optionData[2].value = this.fund.foundedPrincipal
        this.optionData[3].value = this.fund.expectInterest
        var myChart = echarts.init(document.getElementById('myChart'));
        myChart.setOption({
          color: ['#ff4858', '#fdc748', '#5add3a', '#48b1ff'],
          animation: false,
          series: [
            {
              name: '总资产',
              type: 'pie',
              radius: ['60%', '90%'],
              avoidLabelOverlap: true,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                }
              },
              data: this.optionData
            }]
        })
      },
      showChart1() {
        if (this.fund.availableBalance === 0) {
          this.showBar1Data[0].value = this.fund.availableBalance
          this.showBar1Data[1].value = 100
        } else {
          this.showBar1Data[0].value = this.fund.availableBalance
          this.showBar1Data[1].value = this.fund.frozenAssets + this.fund.foundedPrincipal + this.fund.expectInterest
        }
        var myChart1 = echarts.init(document.getElementById('chart1'));
        myChart1.setOption({
          animation: false,
          color: ['#ff4858', '#f3f3f3'],
          series: [
            {
              name: '可用余额',
              type: 'pie',
              radius: '70%',
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                }
              },
              data: this.showBar1Data
            }]
        })
      },
      showChart2() {
        if (this.fund.frozenAssets === 0) {
          this.showBar2Data[0].value = this.fund.frozenAssets
          this.showBar2Data[1].value = 100
        } else {
          this.showBar2Data[0].value = this.fund.frozenAssets
          this.showBar2Data[1].value = this.fund.availableBalance + this.fund.foundedPrincipal + this.fund.expectInterest
        }
        var myChart2 = echarts.init(document.getElementById('chart2'));
        myChart2.setOption({
          color: ['#fdc748', '#f3f3f3'],
          animation: false,
          series: [
            {
              name: '总资产',
              type: 'pie',
              radius: '70%',
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                }
              },
              data: this.showBar2Data
            }]
        })
      },
      showChart3() {
        if (this.fund.foundedPrincipal === 0) {
          this.showBar3Data[0].value = this.fund.foundedPrincipal
          this.showBar3Data[1].value = 100
        } else {
          this.showBar3Data[0].value = this.fund.foundedPrincipal
          this.showBar3Data[1].value = this.fund.frozenAssets + this.fund.availableBalance + this.fund.expectInterest
        }
        var myChart3 = echarts.init(document.getElementById('chart3'));
        myChart3.setOption({
          color: ['#5add3a', '#f3f3f3'],
          animation: false,
          series: [
            {
              name: '待收本金',
              type: 'pie',
              radius: '70%',
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                }
              },
              data: this.showBar3Data
            }]
        })
      },
      showChart4() {
        if (this.fund.expectInterest === 0) {
          this.showBar4Data[0].value = this.fund.expectInterest
          this.showBar4Data[1].value = 100
        } else {
          this.showBar4Data[0].value = this.fund.expectInterest
          this.showBar4Data[1].value = this.fund.frozenAssets + this.fund.availableBalance + this.fund.foundedPrincipal
        }
        var myChart4 = echarts.init(document.getElementById('chart4'));
        myChart4.setOption({
          color: ['#48b1ff', '#f3f3f3'],
          animation: false,
          series: [
            {
              name: '总资产',
              type: 'pie',
              radius: '70%',
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                }
              },
              data: this.showBar4Data
            }]
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .myfund
    .title
      height: 1rem
      text-align: center
      font-size: .4rem
      font-weight: 500
    .not-mymoney
      height: 3rem
      background url("../../../static/images/notavailable/not_myfund_myprofit.png") no-repeat center top
      background-size 6.94rem 2.84rem
    .showBar
      width 1rem
      height 0.9rem
      margin-right .3rem
    .myfund-cell
      margin-top .3rem
      .cell-item
        padding .1rem .3rem
        .cell-right
          padding-right 0
      .cell-item:after
        left: 1.3rem
      .icon-question
        color #bbbbbb
</style>
