var Constant = require('../../../../utils/constant.js')
var HttpUtils = require('../../../../utils/http-utils.js')
var toastr = require('../../../../utils/toastr-wxapp.js');


Page({
  data: {
    content: '',
    contact: ''
  },
  contactImput(e) {
    this.setData({
      contact: e.detail.value
    })
  },
  contentImput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  submit() {
    if (this.data.content != '' && this.data.contact != '') {
      var that = this
      wx.getStorage({
        key: 'account',
        success: function(res) {
          var param = {
            'content': that.data.content,
            'contact': that.data.contact,
            'name': res.data.name,
            'origin': '1'
          }
          var jsonText = JSON.stringify(param);
          //发送反馈请求
          HttpUtils._post_json(
            Constant.FEEDBACK,
            jsonText,
            //两个回调函数
            that.feedbackSuccess,
            that.feedbackFail
          )
        },
      })
    } else {
      wx.showToast({
        title: '数据不能为空',
        icon: 'none'
      })
    }
  },
  //反馈成功的回调函数
  feedbackSuccess: function(res) {
    console.log(res.data)
    if (res.data.code != 200) {
      toastr.error({
        title: '反馈失败,请稍后重试',
        duration: 1000,
      });
    } else {
      wx.showToast({
        title: '评论成功',
        icon: 'success',
        duration: 2000
      })
    }
  },
  //反馈失败的回调函数
  feedbackFail: function(e) {
    toastr.error({
      title: '反馈失败,请稍后重试',
      duration: 1000,
    });
  }
})