<template>
  <layout class="bg-white">
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="my-profit">
      <h1 class="title">{{profit.formatTotalProfit}}元</h1>
      <div class="not-mymoney" v-if="profit.totalProfit === 0"></div>
      <div class="charts" v-else>
        <div id="myChart" :style="{width:'100%',height:'3rem'}"></div>
      </div>
      <cell-group class="myprofit-cell">
        <cell-item>
          <div slot="left" class="showBar" id="chart1"></div>
          <span slot="left">已收利息</span> <span slot="right">{{profit.formatPayedInterest}}元</span>
        </cell-item>
        <cell-item>
          <div slot="left" class="showBar" id="chart2"></div>
          <span slot="left">待收利息 <i @click="toastNone()" class="icon-question"></i></span>
          <span slot="right">{{profit.formatWaitPayedInterest}}元</span>
        </cell-item>
        <cell-item style="margin-top: .5rem">
          <div slot="left" class="showBar" id="chart3"></div>
          <span slot="left">已用红包</span> <span slot="right">{{profit.formatUsedCoupon}}元</span>
        </cell-item>
        <cell-item></cell-item>
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
        profit: Array,
        optionData: [{value: 0, name: '可用余额', itemStyle: {normal: {color: '#ff4858'}, emphasis: {color: '#ff4858'}}},
          {value: 0, name: '冻结金额', itemStyle: {normal: {color: '#fdc748'}, emphasis: {color: '#fdc748'}}},
          {value: 0, name: '待收本金', itemStyle: {normal: {color: '#48b1ff'}, emphasis: {color: '#48b1ff'}}}],
        showBar1Data: [{value: 0, name: '可用余额', itemStyle: {normal: {color: '#ff4858'}, emphasis: {color: '#ff4858'}}},
          {value: 0, name: '其他金额', itemStyle: {normal: {color: '#f3f3f3'}, emphasis: {color: '#f3f3f3'}}}],
        showBar2Data: [{value: 0, name: '冻结金额', itemStyle: {normal: {color: '#fdc748'}, emphasis: {color: '#fdc748'}}},
          {value: 0, name: '其他金额', itemStyle: {normal: {color: '#f3f3f3'}, emphasis: {color: '#f3f3f3'}}}],
        showBar3Data: [{value: 0, name: '待收利息', itemStyle: {normal: {color: '#48b1ff'}, emphasis: {color: '#48b1ff'}}},
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
          mes: '<div style="font-size:.26rem">待收利息 = 已成立且已放款的项目待收利息总和</div>',
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
              this.getProfit()
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
              this.getProfit()
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
      getProfit() {
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/myProfit/index').then((res) => {
          if (res.success) {
            this.profit = res.result
            this.showEchart()
            this.showChart1()
            this.showChart2()
            this.showChart3()
          } else {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.push('/login')
          }
        })
      },
      showEchart() {
        this.optionData[0].value = this.profit.payedInterest
        this.optionData[1].value = this.profit.waitPayedInterest
        this.optionData[2].value = this.profit.usedCoupon
        var myChart = echarts.init(document.getElementById('myChart'));
        myChart.setOption({
          animation: false,
          series: [
            {
              name: '我的收益',
              type: 'pie',
              radius: ['60%', '90%'],
              avoidLabelOverlap: false,
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
        if (this.profit.payedInterest === 0) {
          this.showBar1Data[0].value = this.profit.payedInterest
          this.showBar1Data[1].value = 100
        } else {
          this.showBar1Data[0].value = this.profit.payedInterest
          this.showBar1Data[1].value = this.profit.waitPayedInterest + this.profit.usedCoupon
        }
        var myChart1 = echarts.init(document.getElementById('chart1'));
        myChart1.setOption({
          animation: false,
          color: ['#f86871', '#f3f3f3'],
          series: [
            {
              name: '已收利息',
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
        if (this.profit.waitPayedInterest === 0) {
          this.showBar2Data[0].value = this.profit.waitPayedInterest
          this.showBar2Data[1].value = 100
        } else {
          this.showBar2Data[0].value = this.profit.waitPayedInterest
          this.showBar2Data[1].value = this.profit.payedInterest + this.profit.usedCoupon
        }
        var myChart2 = echarts.init(document.getElementById('chart2'));
        myChart2.setOption({
          color: ['#f8df68', '#f3f3f3'],
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
        if (this.profit.usedCoupon === 0) {
          this.showBar3Data[0].value = this.profit.usedCoupon
          this.showBar3Data[1].value = 100
        } else {
          this.showBar3Data[0].value = this.profit.usedCoupon
          this.showBar3Data[1].value = this.profit.payedInterest + this.profit.waitPayedInterest
        }
        var myChart3 = echarts.init(document.getElementById('chart3'));
        myChart3.setOption({
          color: ['#a4ea80', '#f3f3f3'],
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
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .my-profit
    .title
      height: 1rem;
      text-align: center;
      font-size: .4rem;
      font-weight: 500
    .not-mymoney
      height: 3rem
      background url("../../../static/images/notavailable/not_myfund_myprofit.png") no-repeat center top
      background-size 6.94rem 2.84rem
    /*.tips*/
    /*position: absolute*/
    /*left: 0*/
    /*bottom .36rem*/
    /*width 100%*/
    /*text-align: center*/
    /*font-size .22rem*/
    /*color #bbb*/
    .showBar
      width 1rem
      height 0.9rem
      margin-right .3rem
    .myprofit-cell
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
