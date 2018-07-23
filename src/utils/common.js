/**
 * Created by ymjdev on 2017/9/20.
 */
//全局变量
//4-21位昵称
global.vUsername = /^[\u4E00-\u9FA5\uf900-\ufa2dA-Za-z]{2,21}$/
//国内手机号码格式
global.vMobile = /^(((13[0-9]{1})|(14[0-9]{1})||(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/
//6-16位密码必须字母+数字
global.vPassword = /^(?![^a-zA-Z]+$)(?!\D+$)(?!^[_#@]+$).{6,16}/
//2-6位中文名
global.vChinese = /^[\u4e00-\u9fa5]{2,6}/
//身份证格式
global.vCardNo = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
// global.vCardNo = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/
// global.vCardNo = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/i
//金额格式，两位小数
global.vMoney = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
//验证为数字
global.vNumber = /^[0-9]*$/