<template>
  <layout :showNavbar="isNavbar">
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <section class="protocol-group">
      <div class="protocol-body">
        <table style="border: 1px solid  #ddd; width: 100%">
          <thead>
          <tr>
            <td style="padding: .1rem;width: 1.8rem;border-bottom: 1px solid #ddd">协议编号</td>
            <td style="padding: .1rem;border-bottom: 1px solid #ddd">{{protocolData.contractNo}}</td>
          </tr>
          <tr>
            <td style="padding: .1rem;border-bottom: 1px solid #ddd">签订日期</td>
            <td style="padding: .1rem;border-bottom: 1px solid #ddd">{{protocolData.signTime}}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: .1rem;text-align: left;">签约方：</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td style="padding:0 .1rem">甲方（甲方）</td>
            <td style="padding:0 .1rem">{{protocolData.partyAName}}</td>
          </tr>
          <tr>
            <td style="padding:0 .1rem">乙方（乙方）</td>
            <td style="padding:0 .1rem">{{protocolData.partyBName}}</td>
          </tr>
          <tr>
            <td style="padding:0 .1rem">身份证号</td>
            <td style="padding:0 .1rem">{{protocolData.partyBIdentityNumber}}</td>
          </tr>
          <tr>
            <td style="padding:0 .1rem .1rem">电话</td>
            <td style="padding:0 .1rem .1rem">{{protocolData.partyBMobile}}</td>
          </tr>
          </tbody>
        </table>
        <h2>合同正文</h2>
        <div class="protocol-info">
          甲、乙双方经协商，就甲方按照乙方认购份额向其出让保理债权资产事宜达成本协议。
        </div>
        <div class="protocol-special">
          <strong>特别提醒：</strong>甲、乙双方依照诚实信用原则，协商一致订立本协议。双方确认已充分明确地了解本合同所有内容，对本协议中各条款无疑义、无异议。
        </div>
        <h2>第一条 释义</h2>
        <ul>
          <li>保理业务：指甲方围绕应收账款，为客户提供的账户管理、资信调查、坏账担保、账款融资之一或多项功能的服务。</li>
          <li>保理债权资产：指甲方基于保理业务受让或产生的应收账款，并《保理债权资产清单》特定后的债权资产本金及其收益权。</li>
          <li>保理资产收益权：指甲方基于保理业务产生的对买方的保理费请求权。</li>
          <li>服务费：本协议下的服务费，特指甲方转让给乙方保理债权资产后，为乙方提供资产管理服务按一定方式收取的费用。</li>
          <li>预期收益：指保理债权资产到期后，乙方应收取的保理费收入扣减乙方应支出的服务费后的剩余收益。</li>
          <li>“长富理财平台”：指由昇融资产管理有限公司运营的互联网金融平台。</li>
        </ul>
        <h2>第二条 转让交易</h2>
        <ul>
          <li>
            <span>转让标的：</span>
            <ul>
              <li>保理债权资产为应收账款人民币 壹仟柒佰肆拾贰元整万元及保理收益之和。</li>
              <li>甲方向乙方转让{{protocolData.investNum}}份保理债权资产；</li>
              <li>标的资产到期日为{{protocolData.projectEndTime}}。</li>
            </ul>
          </li>
          <li>
            <span>认购价格：</span>
            <ul>
              <li>份额单价：1元/份；</li>
              <li>乙方应向甲方支付转让价款共计人民币{{protocolData.investAmountCH}}。</li>
            </ul>
          </li>
          <li>
            <span>预期收益率：</span>
            <div class="protocol-special">乙方持有份额预期收益率为{{protocolData.expectAnnualizedRate}}%/年（365天）。</div>
          </li>
          <li>
            <span>逾期罚金：</span>
            <ul>
              <li>逾期罚金率：{{protocolData.overdueAnnualizedRate}}%/日</li>
              <li>计算标准：到期保理债权资产未清偿额*逾期罚金率*逾期时间，逾期时间自保理债权资产到期日次日起算。</li>
            </ul>
          </li>
          <li>
            <span>转让生效：</span>
            <div class="protocol-special">乙方支付转让价款后， {{protocolData.projectStartTime}}视为转让生效，并开始计算乙方预期收益。</div>
          </li>
        </ul>
        <h2>第三条 资产管理</h2>
        <ul>
          <li>
            <span>管理事项</span>
            <div class="protocol-special">保理债权资产存续期间，乙方委托甲方进行债权的管理服务的内容包括但不限于对保理债权资产及买方情况进行监控；对保理债权资产进行催收及清收；在买方出现违约风险的情况下宣布提前到期并要求买方提前清偿；要求保证人代偿；判断是否接受买方的提前还款；配合乙方对买方、保证人提起诉讼和处置担保物；保存档案；进行信息披露等。</div>
          </li>
          <li>
            <span>服务费</span>
            <ul>
              <li>费率：另行约定。</li>
              <li>收取方式:甲方在向乙方划转款项时，从乙方到期的保理债权资产回款中进行扣除。</li>
              <li>
                <span>计算方式：</span>
                <ul>
                  <li>正常回款时，服务费=乙方支付的转让价款*（自债权转让之日起至债权到期日之间的天数/365）*服务费率；</li>
                  <li>提前回款时，服务费=乙方支付的转让价款*（自债权转让日起至债权提前到期日之间的天数/365）*服务费率；</li>
                  <li>出现违约风险进行回收时，服务费=乙方支付的转让价款*（自债权转让日起乙方实际持有债权资产的天数/365）*服务费率。</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        <h2>第三条 陈述说明</h2>
        <ul>
          <li>保理债权资产明细见于《保理债权资产清单》，清单中的保理债权资产为一笔资产，在转让时一并转让。</li>
          <li>保理债权资产进行份额拆分后，每份保理债权资产在份额范围内拥有同等的权利。</li>
          <li>保理债权资产转让后，相应的等额担保视为随之转让，乙方有权向担保人在份额持有范围内主张债权。</li>
          <li>甲方有权根据本次转让活动的进展、按照转让价款支付时间的先后顺序，决定乙方受让债权份额是否属于甲方超额转让的范围；若乙方受让债权份额属于甲方超额转让的范围，则甲方有权于转让日当日与乙方取得联系，并在合理的时间内对乙方支付的转让价款予以退回，双方互不承担责任。</li>
          <li>保理债权资产到期前，买方提前还款的，乙方授权甲方同意接受提前还款并代为收取提前还款的全部款项。届时甲方应至少在到期日前壹个工作日通知乙方提前到期事宜，并履行兑付事宜。</li>
          <li>保理债权资产在出现违约风险情况下，受让人授权出让人宣布债权提前到期，要求买方提前还款，或要求保证人承担保证责任。届时出让人应及时通知受让人债权提前回款事宜，并履行催款和兑付事宜。</li>
        </ul>
        <h2>第四条 甲方权利义务</h2>
        <ul>
          <li>甲方为依据中华人民共和国法律成立并有效存在的企业法人，有完全的民事权利能力和民事行为能力。</li>
          <li>甲方保证转让的保理债权资产真实、合法、有效，保理债权资产未被转让、未被质押、无其它权利瑕疵。</li>
          <li>甲方转让保理债权资产后，应继续履行管理职责，持续跟踪保理债权资产各要素情况及变化，妥善管理相应风险，并履行信息披露义务。</li>
          <li>保理债权资产如未能足额兑付，甲方应进行债权人统计，为经债权申报的乙方提供相关资料、信息，并履行相关手续，以配合乙方追偿工作。</li>
        </ul>
        <h2>第五条 乙方权利义务</h2>
        <ul>
          <li>乙方为中华人民共和国公民，有完全的民事权利能力和民事行为能力。</li>
          <li>乙方已认真阅读《产品说明书》，并确认可以承受上述文件提示的风险，自愿签署本协议。</li>
          <li>乙方保证，其支付的转让价款为合法所有，且只通过借记卡支付，不得通过信用卡等其他方式进行支付，愿意承担违反本承诺对甲方造成的损失。</li>
          <li>乙方保证，受让保理债权资产后，不得将受让份额再次转让给任何第三人或机构。</li>
          <li>保理债权资产到期如未获足额偿付，乙方有权向甲方申报债权，要求甲方提供相关资料、履行相关手续配合乙方追偿。</li>
        </ul>
        <h2>第六条 信息披露</h2>
        <div class="protocol-info">乙方可通过“长富理财平台”获取。</div>
        <h2>第七条 债权人统计</h2>
        <ul>
          <li>统计依据：“长富理财平台”通报给甲方的份额持有人信息。</li>
          <li>统计范围：截止至保理债权资产到期时的份额持有人。</li>
          <li>乙方向甲方申报债权时，对于不属于统计范围内的份额持有人，甲方不予配合追偿。</li>
        </ul>
        <h2>第八条 税务承担</h2>
        <div class="protocol-info">甲、乙双方在转让过程中产生的相关税费，由双方各自自行向税务机关申报、缴纳。</div>
        <h2>第九条 法律适用</h2>
        <div class="protocol-info">本协议的订立、效力、解释、履行及争议解决均适用中华人民共和国法律法规及相关司法解释。</div>
        <h2>第十条 争议解决</h2>
        <div class="protocol-info">凡因本协议履行引起的或与本协议相关的一切争议纠纷，甲、乙双方应协商解决。如协商不成，双方同意由甲方所在地人民法院管辖，通过司法手段解决。</div>
        <h2>第十一条 协议的生效、终止和变更</h2>
        <ul>
          <li>本协议自甲、乙双方签字、盖章之日起生效，至协议内全部权利义务履行完毕之日截止。</li>
          <li>除本合同另有规定外，任何一方无权单方面更改本协议的任何条款，本合同如需修改，需经双方协商一致，并另行签订书面协议。</li>
        </ul>
        <h2>第二十二条 合同份数与附件</h2>
        <ul>
          <li>本协议有效文字为中文，正本壹式贰份，甲方执壹份，乙方执壹份，均有同等效力。</li>
          <li>协议附件是协议的组成部分，与本协议具有同等的法律效力。</li>
        </ul>
        <div class="protocol-line">---------正文部分结束，以下为签署部分--------</div>
        <table class="signed-table">
          <tr>
            <th>甲方（盖章）</th>
            <th>乙方（签字）</th>
          </tr>
          <tr>
            <td><img :src="protocolData.partyASeal"></td>
            <td></td>
          </tr>
        </table>
        <h2>附件：保理债权资产清单</h2>
        <table class="protocol-table attachment">
          <thead>
          <tr>
            <th colspan="2" style="text-align: left;">保理债权资产（包）</th>
          </tr>
          <tr>
            <th style="width: 2rem">资产合计</th>
            <th>{{protocolData.investAmount}}元人民币</th>
          </tr>
          <tr>
            <th>份额单价</th>
            <th>1元/份</th>
          </tr>
          <tr>
            <th>份额总数</th>
            <th>{{protocolData.investNum}}份</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td colspan="2" style="white-space: normal;text-align: left">本次发行涉及的基础资产是{{protocolData.warrantName}}保理为买方向卖方垫付预付款而形成的对买方（债务人）的保理债权资产，详情如下：</td>
          </tr>
          <tr>
            <td>债权人：</td>
            <td>{{protocolData.partyAName}}</td>
          </tr>
          <tr>
            <td>保证人：</td>
            <td>{{protocolData.warrantName}}</td>
          </tr>
          <tr>
            <td>债权本金：</td>
            <td>{{protocolData.investAmountCH}}</td>
          </tr>
          <tr>
            <td>保理费率：</td>
            <td>{{protocolData.expectAnnualizedRate}}%/年</td>
          </tr>
          <tr>
            <td>债权起息日：</td>
            <td>{{protocolData.establishTime}}</td>
          </tr>
          <tr>
            <td>债权到期日：</td>
            <td>{{protocolData.projectEndTime}}</td>
          </tr>
          <tr>
            <td>还款来源：</td>
            <td>{{protocolData.repaySource}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>
  </layout>
</template>
<script>
  export default{
    data(){
      return {
        isNavbar: true,
        transactionNo: '',
        protocolData:''
      }
    }, created(){
      this.isOsAccess()
    },
    methods: {
      isOsAccess(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android' ) {
          this.isNavbar = false
        }
        if( this.$route.query.access_token !== undefined){
          this.$dialog.loading.open('数据加载中...');
          this.axios.get('auth/ucMemebe/info').then((res) => {
            if (res.success) {
              this.accountInfo = res.result
              this.transactionNo = this.$route.query.id
              this.getContractData()
              localStorage.setItem('accountinfo', JSON.stringify(res.result))
            } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
              this.$dialog.toast({mes: res.errorDescription})
              localStorage.clear()
              this.goLogin()
            } else {
              this.$dialog.toast({mes: res.errorDescription})
            }
          })
        } else {
          this.transactionNo = this.$route.query.id
          this.getContractData()
        }
      },
      goBack(){
        this.$router.back()
      },
      getContractData(){
        this.$dialog.loading.open('数据加载中...');
        this.axios.get('auth/myInvest/getContractData/'+ this.transactionNo).then(res => {
          if (res.success) {
            this.protocolData = res.result
          } else if(res.error === 'TC_ORDER_TRANSACTION_NOT_EXISTS_ERROR'){
            this.goInvestsList()
          } else if(res.error === 'MEMBER_TOKEN_INVALID_ERROR'){
            this.goLogin()
          }
        })
      },
      goLogin(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          window.location.href = 'cflc://jsbridge?type=action&name=login'
        } else {
          this.$router.push('/login')
        }
      },
      goInvestsList(){
        if (this.$route.query.os === 'app_ios' || this.$route.query.os === 'app_android') {
          window.location.href = 'cflc://jsbridge?type=event&name=close'
        } else {
          this.$router.push('/account/wait_establish_invests')
        }
      },
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/protocol.styl"
</style>
