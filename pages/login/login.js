var Constant = require('../../utils/constant.js')
var HttpUtils = require('../../utils/http-utils.js')
var toastr = require('../../utils/toastr-wxapp.js');

Page({
  data: {
    inputPassword: false,
    isLoading: false,
    password: '',
    username: ''
  },
  onLoad() {
    //登录前清除缓存
    wx.clearStorageSync()
    console.log('清除缓存')
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#4A699F',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  username() {
    this.setData({
      inputPassword: false
    })
  },
  pwdFocus() {
    this.setData({
      inputPassword: true
    })
  },
  formSubmit: function(e) {
    this.setData({
      isLoading: true
    })
    //获得表单数据
    var objData = e.detail.value;
    //如果账号和密码都不为空
    if (objData.username && objData.password) {
      this.setData({
        username: objData.username,
        password: objData.password
      })
      var param = {
        'username': objData.username,
        'password': objData.password
      }
      //发送获取学生信息的请求
      HttpUtils._post(
        Constant.LOGIN,
        param,
        //两个回调函数
        this.loginSuccess,
        this.loginFail
      )
    } else {
      toastr.error({
        title: '不能为空',
        duration: 1000,
      });
    }
    setTimeout(() => {
      this.setData({
        isLoading: false
      })
    }, 1000)

  },
  loginSuccess: function(res) {
    toastr.ok({
      title: '登录成功',
      duration: 1000,
    });
    if (res.data.code == 200) {
      var result = res.data.info
      console.log(result)
      result['password'] = this.data.password
      wx.setStorage({
        key: "account",
        data: result
      })
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else {
      //登录失败
      toastr.error({
        title: '用户名或密码错误',
        duration: 1000,
      });
    }
  },
  loginFail: function(e) {
    console.log(e)
    toastr.error({
      title: '系统异常,请稍后重试',
      duration: 1000,
    });
  }
})