<template>
  <layout>
    <navbar :title="$route.meta.title" slot="navbar">
      <navbar-back-icon @click.native="goBack" slot="left"></navbar-back-icon>
    </navbar>
    <div class="avatars">
      <div class="upload">
        <form id="formData" name="formdata" enctype="multipart/form-data">
          <input name="file" type="file" class="file-logo" @change="onFileChange" required>
          <img src="/static/images/avatars.png" v-if="accountInfo.avatars == undefined">
          <img :src="accountInfo.avatars+'?imageView2/5/w/200/h/200'" v-else>
        </form>
      </div>
      <div class="upload-bar">
        <a class="upload-change" href="" v-if="accountInfo.avatars">修改头像</a>
        <a class="upload-change" href="" v-else>上传头像</a>
        <input class="change" @change="onFileChange" type="file">
      </div>
    </div>
    <cell-group>
      <cell-item>
        <span slot="left">手机号码</span> <span slot="right" v-text="accountInfo.mobileMask"></span>
      </cell-item>
      <cell-item arrow type="link" href="certification" v-if="this.accountInfo.status !== 'authed'">
        <span slot="left">姓名</span> <span slot="right" style="color: #999">您尚未开通银行存管</span>
      </cell-item>
      <cell-item v-else>
        <span slot="left">姓名</span> <span slot="right" v-text="accountInfo.trueName"></span>
      </cell-item>
    </cell-group>
    <cell-group>
      <cell-item arrow type="link" href="edit_username" v-if="accountInfo.username == undefined">
        <span slot="left">昵称</span> <span slot="right" style="color: #999">去设置</span>
      </cell-item>
      <cell-item v-else>
        <span slot="left">昵称</span> <span slot="right" v-text="accountInfo.username"></span>
      </cell-item>
      <!--<cell-item arrow type="link" href="./personal_address">-->
      <!--<span slot="left">地址</span> <span slot="right"></span>-->
      <!--</cell-item>-->
    </cell-group>
  </layout>
</template>
<script>
  export default {
    data() {
      return {
        accountInfo: '',
        accountDetail: '',
        fileName: '',
        fileToken: '',
        avatars: '',
        fd: ''
      }
    },
    created() {
      this.getAccount()
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      getAccount() {
        this.accountInfo = JSON.parse(localStorage.getItem('accountinfo'))
        if (this.accountInfo === null) {
          this.$dialog.toast({mes: '您还没有登录或登录已失效，请重新登录！'})
          localStorage.clear()
          this.$router.push('/login')
        }
      },
      onFileChange(e) {
        var form = document.getElementById('formData')
        this.fd = new FormData(form)
        var files = e.target.files || e.dataTransfer.files
        var fileType = ['jpeg', 'jpg', 'png', 'gif'];
        var maxSize = 8  // 1 = 1mb
//        console.log(files[0].size)
//        验证图片格式
        var type = files[0].name.split('.').pop();
        if (fileType.indexOf(type.toLocaleLowerCase()) === -1) {
          this.$dialog.toast({mes: '暂不支持该类型的文件，请重新选择'})
          return;
        }
//        验证图片大小
        if (maxSize && files[0].size > maxSize * 1024 * 1024) {
          this.$dialog.toast({mes: '请上传小于' + maxSize + 'M的文件'})
          return;
        }
        if (!files.length) return
        this.fileName = files[0].name
        this.fd.append('file', files[0])
        this.$dialog.loading.open('头像上传处理中...');
        //获取上传图片权限
        this.axios.get('auth/qiniu/getToken?filename=' + this.fileName).then(res => {
          if (res.success) {
            this.fileToken = res.result.token
            this.uploadQiniu()
          } else if (res.error === 'MEMBER_TOKEN_INVALID_ERROR') {
            this.$dialog.toast({mes: res.errorDescription})
            localStorage.clear()
            this.$router.replace('/login')
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      uploadQiniu() {
        //生成远程服务器图片的url
        this.axios.post('auth/qiniu/uploadImage', this.fd).then(res => {
          if (res.success) {
            this.$dialog.alert({mes: '上传成功'})
            this.avatars = res.result
            this.uploadImgData()
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      },
      uploadImgData() {
        //把远程服务器得图片url保存到本地
        this.axios.post('auth/ucMemebe/updateAvatars?imgUrl=' + this.avatars).then(res => {
          if (res.success) {
            this.accountInfo = res.result
            localStorage.setItem('accountinfo', JSON.stringify(res.result))
          } else {
            this.$dialog.toast({mes: res.errorDescription})
          }
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .avatars
    padding: .4rem
    text-align: center
    color: #666
    & img
      display inline-block
      margin-bottom .1rem
      width: 2rem
      height: 2rem
      border-radius: 2rem
      border: 0
      background-color #FFF
    .file-logo
      width 2rem
      height 2rem
      opacity 0
      position absolute
      top 0px
      left 0px
    .upload
      position relative
      width 2rem
      height 2rem
      margin 0 auto
      margin-bottom .1rem
    .logo-img
      width 100%
      height 100%
    .upload-bar
      width 1.1rem
      height .4rem
      line-height .4rem
      margin 0 auto
      /*background-color red*/
      position relative
    .upload-chang
      position absolute
      top 0
      left 0
    .change
      position absolute
      top 0
      left 0
      width 1.1rem
      height .4rem
      opacity 0
</style>
