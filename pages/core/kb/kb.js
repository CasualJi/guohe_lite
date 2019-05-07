//index.js
//获取应用实例
var app = getApp()
var HttpUtils = require('../../../utils/http-utils.js')
var Constant = require('../../../utils/constant.js')
Page({
  data: {
    colorArrays: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],
    wlist: [], //要显示的课程的list
    kb: [], //所有课表的list
    weekList: [],
    weekIndex: 0,
    yearList: [],
    yearIndex: 0,

  },
  onLoad: function() {
    //初始化头部Picker的数据源
    this.initHeaderData()

    //初始化课表
    this.initKb()

  },

  //初始化头部Picker的数据源
  initHeaderData: function() {
    //填充学年数组
    try {
      var value = wx.getStorageSync('all_year')
      var thisYearIndex = wx.getStorageSync('thisYearIndex')
      if (!thisYearIndex)
        thisYearIndex = 0
      if (value) {
        this.setData({
          yearList: value,
          yearIndex: thisYearIndex
        })
      }
    } catch (e) {
      console.log(e)
    }

    //填充周次数组
    var array = []
    for (var i = 1; i < 21; i++) {
      array.push('第' + i + '周')
    }
    try {
      var value = wx.getStorageSync('week_num')
      if (value) {
        // Do something with return value
        var week = 0
        if (value > 0 && value < 21)
          week = value - 1
        else week = 1
        this.setData({
          weekList: array,
          weekIndex: week
        })
      }
    } catch (e) {
      // Do something when catch error
    }

  },

  //初始化课表
  initKb: function() {
    var that = this
    //判断本地是否有课表缓存
    wx.getStorage({
      key: 'allKb',
      success: function(res) {
        //若有课表的缓存就显示
        console.log('有课表缓存')
        that.showKbInWeek(that.data.weekIndex + 1)
        //    showKb(res)
      },
      //如果没有课表缓存，则从服务器获取课表信息
      fail: this.getKbInfo
    })
  },

  //获取课表信息
  getKbInfo: function() {
    console.log('无课表缓存')
    try {
      var account = wx.getStorageSync('account')
      var thisYearIndex = wx.getStorageSync('thisYearIndex')
      console.log(thisYearIndex)
      if (!thisYearIndex)
        thisYearIndex = 0
      if (account) {
        wx.showLoading({
          title: '正在获取课表，请稍后',
        })
        var year = this.data.yearList[thisYearIndex]
        console.log(year)
        var param = {
          'username': account.username,
          'password': account.password,
          'semester': year
        }
        var that = this
        HttpUtils._post(
          Constant.KB,
          param,
          this.getKbInfoSuccess,
          this.getKbInfoFail
        )
      }
    } catch (e) {
      // Do something when catch error
      console.log(e)
    }
  },

  //获取课表成功的回调函数
  getKbInfoSuccess: function(res) {
    console.log('获取课表成功的回调函数')
    console.log(res.data)
    if (res.data.code = 200) {
      this.handleKbInfo(res.data.info)
    }

    wx.showToast({
      title: '课表获取完成',
      icon: 'success',
      duration: 1000
    })

    wx.hideLoading()
  },

  //获取课表失败的回调函数
  getKbInfoFail: function() {
    wx.showToast({
      title: '课表获取失败，请稍后重试',
      icon: 'fail',
      duration: 1000
    })
    wx.hideLoading()
  },

  //处理课表信息
  handleKbInfo: function(data) {
    console.log(data)
    this.setData({
      kb: []
    })
    for (var i = 0; i < data.length; i++) {
      //设置课程信息,2*i+1表示节次
      this.setCourse(2 * i + 1, data[i])
    }
    this.setData({
      wlist: this.data.kb
    })
    try {
      wx.setStorageSync('allKb', this.data.kb)
      console.log('所有课表缓存完成')

      //显示当前周的课程
      this.showKbInWeek(this.data.weekIndex + 1)
    } catch (e) {
      console.log(e)
    }
  },

  //设置课程信息
  setCourse: function(jieci, object) {
    var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    for (var i = 0; i < days.length; i++) {
      //i+1表示星期几
      var des = object[days[i]]
      if (des) {
        this.handleCourseInfo(des, i + 1, jieci)
      }
    }
  },

  //处理课程信息,返回的是每天的课
  handleCourseInfo: function(des, xqj, jieci) {
    var cArray = []
    var dess = des.split("---------------------")
    //先把所有的课都显示上去并且设置背景为灰色
    for (var i = 0; i < dess.length; i++) {
      var couese = dess[i].split('@')
      var cName = couese[1]
      var cRoom = couese[4]
      if (cRoom == undefined)
        cRoom = ''
      var day = {
        "xqj": xqj,
        "skjc": jieci,
        "skcd": 2,
        "info": cName + "\n" + cRoom,
        "des": dess[i],
        "color": "#D3D3D3"
      };
      if (day) {
        this.data.kb.push(day)
      }
    }
  },

  //显示课表
  showCourseInfo: function(event) {
    var cDes = event.currentTarget.dataset.des
    var course = cDes.split('@')
    var num = course[0] //课程号
    var name = course[1] //课程名
    var teacher = course[2] //老师
    var zhouci = course[3] //周次
    var room = course[4] //教室
    console.log(cDes)
    var content = "课程号：" + num +
      "\r\n课程名：" + name +
      "\r\n教室：" + room +
      "\r\n教师：" + teacher +
      "\r\n周次：" + zhouci
    wx.showModal({
      title: '课程信息',
      content: content,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //根据所有课程获取每周对应的课程
  showKbInWeek: function(week) {
    var that = this
    this.setData({
      wlist: this.data.kb
    })
    try {
      var allKb = wx.getStorageSync('allKb')
      if (that.data.kb) {
        this.setData({
          wlist: allKb
        })
      }
      if (allKb) {
        for (var i = 0; i < allKb.length; i++) {
          var o = allKb[i]
          var zhouci = o.des.split('@')[3]
          var zhoucis = zhouci.substring(-1, zhouci.length - 3).split(',')
          for (var j = 0; j < zhoucis.length; j++) {
            var ss = zhoucis[j].split('-')
            var begin = ss[0]
            var end = ss[1]
            if (week >= begin && week <= end || week == begin || week == end) {
              var xqj = o.xqj
              var jieci = o.skjc
              var couese = o.des.split('@')
              var cName = couese[1]
              var cRoom = couese[4]
              var index = Math.floor((Math.random() * that.data.colorArrays.length));
              if (cRoom == undefined)
                cRoom = ''
              var day = {
                "xqj": xqj,
                "skjc": jieci,
                "skcd": 2,
                "info": cName + "\n" + cRoom,
                "des": o.des,
                "color": that.data.colorArrays[index]
              };
              if (day) {
                that.data.wlist.push(day)
              }
            }
          }
        }
      }
    } catch (e) {
      console.log(e)
    }

    this.setData({
      wlist: this.data.wlist
    })
  },

  //点击更换周次
  bindWeekChange: function(e) {
    var week = e.detail.value
    this.setData({
      weekIndex: week
    })
    this.showKbInWeek(new Number(week) + 1)
  },

  //点击更换学年
  bindYearChange: function(e) {
    var thisYearIndex = e.detail.value
    this.setData({
      yearIndex: thisYearIndex
    })
    try {
      wx.setStorageSync('thisYearIndex', thisYearIndex)
    } catch (e) {
      console.log(e)
    }
    this.getKbInfo()
  },
  /**
   * 页面分享
   */
  onShareAppMessage: function(res) {
    return {
      title: '点我查看课表',
      path: 'pages/core/kb/kb'
    }
  }
})