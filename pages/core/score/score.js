// pages/school/library/library.js

var Constant = require('../../../utils/constant.js')
var HttpUtils = require('../../../utils/http-utils.js')
var toastr = require('../../../utils/toastr-wxapp.js');
var wxCharts = require('../../../utils/wxcharts-min.js');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    grade_years: [],
    scores: {},
    flag: true,
    flag_choose: 'hide',
    change_scores: {},
    loadStyle: 'show',
    tableStyle: 'hide',
    gradePoint: {},
    currentSemester: '选择学期',
    windowWidth: 0 //当前界面可用的屏幕宽度
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let windowWidth = 320;
    try {
      let res = wx.getSystemInfoSync();
      console.log(res)
      windowWidth = res.windowWidth;
      this.setData({
        windowWidth: windowWidth
      })
      //获取成绩
      this.getScore()
      //获取绩点
      this.getGPA()
    } catch (e) {
      // do something when get system info failed
    }
  },

  //获取成绩
  getScore: function() {
    try {
      //查看是否已经登录
      var account = wx.getStorageSync('account')
      if (account) {
        //已经登陆
        var username = account.username;
        var password = account.password;
        var param = {
          'username': username,
          'password': password
        }
        //发送获取学生校历信息的请求
        HttpUtils._post(
          Constant.GRADE,
          param,
          //两个回调函数
          this.getScoreSuccess,
          this.getScoreFail
        )
      } else {
        //没有数据缓存信息
        toastr.error({
          title: '系统异常',
          duration: 1000,
        });
      }
    } catch (e) {
      // Do something when catch error
      console.log(e)
    }
  },

  //获取成绩信息成功的回调函数
  getScoreSuccess: function(res) {
    console.log('getScoreSuccess: ' + res)
    var status = res.statusCode
    if (status == 200) {
      var code = res.data.code
      var mess = res.data.msg
      console.log(res.data.info)
      if (code == 200) {
        this.setData({
          scores: res.data.info,
          change_scores: res.data.info,
        })
      } else {
        this.setData({
          loadStyle: 'hide',
          tableStyle: 'show'
        })
        wx.showToast({
          title: mess,
          icon: 'loading',
          duration: 2000
        })
      }
    } else {
      toastr.error({
        title: '系统异常',
        duration: 1000,
      });
    }
  },

  //获取成绩信息失败的回调函数
  getScoreFail: function() {
    toastr.error({
      title: '系统异常',
      duration: 1000,
    });
  },

  //获取绩点
  getGPA: function() {
    try {
      //查看是否已经登录
      var account = wx.getStorageSync('account')
      if (account) {
        //已经登陆
        var username = account.username;
        var password = account.password;
        var param = {
          'username': username,
          'password': password
        }
        //发送获取学生校历信息的请求
        HttpUtils._post(
          Constant.GPA,
          param,
          //两个回调函数
          this.getGPASuccess,
          this.getGPAFail
        )
      } else {
        //没有数据缓存信息
        wx.showToast({
          title: '系统异常',
          icon: 'loading',
          duration: 2000
        })
      }
    } catch (e) {
      // Do something when catch error
      console.log(e)
    }
  },

  //获取绩点成功的回调函数
  getGPASuccess: function(res) {
    console.log(res)
    var status = res.statusCode
    if (status == 200) {
      var code = res.data.code
      var mess = res.data.msg
      if (code == 200) {
        console.log(res.data)
        var info = res.data.info
        var year_list = new Array()
        var point_list = new Array()
        console.log(point_list)
        for (var i = 1; i < info.length; i++) {
          year_list.push(info[i].year)
          point_list.push(info[i].point)
        }

        new wxCharts({
          canvasId: 'point',
          type: 'line',
          categories: year_list,
          series: [{
            name: '绩点变化',
            data: point_list,
          }],
          yAxis: {
            title: 'GPA'
          },
          width: this.data.windowWidth,
          height: 200,

        });
        var years = [];
        for (var i = 0; i < res.data.info.length; i++) {
          years[i] = res.data.info[i].year
        }

        this.setData({
          gradePoint: res.data.info,
          grade_years: years,
          loadStyle: 'hide',
          tableStyle: 'show'
        })
      } else {
        this.setData({
          loadStyle: 'hide',
          tableStyle: 'show'
        })
        wx.showToast({
          title: mess,
          icon: 'loading',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '系统异常',
        icon: 'loading',
        duration: 2000
      })
    }

  },

  //获取绩点失败的回调函数
  getGPAFail: function() {
    toastr.error({
      title: '系统异常',
      duration: 1000,
    });
  },

  //选择学期时的回掉函数
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.detail.value == '0') {
      this.setData({
        change_scores: this.data.scores,
        currentSemester: '所有学期',
        flag_choose: 'hide'
      })
    } else {
      var temp = this.data.scores
      var result = []
      var years = this.data.grade_years
      for (var i = 0; i < temp.length; i++) {
        //根据学年信息筛选
        if (temp[i]['startSemester'].indexOf(years[e.detail.value]) >= 0) {
          console.log(temp[i]['startSemester'])
          result.push(temp[i])
        }
      }
      this.setData({
        change_scores: result,
        currentSemester: this.data.grade_years[e.detail.value],
        flag_choose: 'show'
      })
      var after_choose_scores = this.data.change_scores

      var name_list = new Array()
      var score_list = new Array()
      for (var i = 1; i < after_choose_scores.length; i++) {
        var subjectName = after_choose_scores[i]['courseName'].substring(0, 5)
        var subjectScore = after_choose_scores[i]['score']
        var subjectMethod = after_choose_scores[i]['examinationMethod']
        if (subjectScore % 1 === 0 && subjectMethod != '') {
          name_list.push(subjectName)
          score_list.push(subjectScore)
        }
      }
      var that = this
      new wxCharts({
        canvasId: 'score',
        type: 'column',
        categories: name_list,
        series: [{
          name: '科目',
          data: score_list,
        }],
        yAxis: {
          titie: "分数",
          min: 0
        },
        width: that.data.windowWidth,
        height: 200
      });
    }
    this.setData({
      index: e.detail.value
    })
  },
  switchSemester: function(e) {
    this.setData({
      flag: false,
    })
  },
})