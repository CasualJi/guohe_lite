// pages/core/classroom/classroom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoad: false,
    empty_classroom_info: [],
    username: '',
    password: '',
    school_year: '2018-2019-2',
    areaArray: [
      "东校区",
      "南校区",
      "西校区",
      "张家港",
      "苏州理工"
    ],
    weekArray: [
      "周一",
      "周二",
      "周三",
      "周四",
      "周五",
      "周六",
      "周日"
    ],
    chooseBuildingArray: [
      "综合楼B",
      "综合楼C",
      "综合楼D",
      "教三",
      "教四",
      "实验楼11",
      "计算中心"
    ],

    eastBuildingArray: [
      "综合楼B",
      "综合楼C",
      "综合楼D",
      "教三",
      "教四",
      "实验楼11",
      "计算中心"
    ],
    southBuildingArray: [
      "一综",
      "二综",
      "A楼",
      "实验楼"
    ],
    westBuildingArray: [
      "西综",
      "图书馆"
    ],
    zhangBuildingArray: [
      "教学楼E",
      "教学楼F"
    ],
    suBuildingArray: [
      "教学楼A",
      "教学楼B",
      "教学楼C",
      "教学楼D",
      "外语楼",
      "经管数理",
      "船海土木"
    ],
    zcArray: [
      '第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周',
      '第9周', '第10周', '第11周', '第12周', '第13周', '第14周', '第15周', '第16周', '第17周', '第18周', '第19周', '第20周'
    ],
    building_para_list: {
      "综合楼B": 2,
      "综合楼C": 3,
      "综合楼D": 4,
      "教三": 5,
      "教四": 6,
      "实验楼11": 7,
      "计算中心": 15,
      "一综": 12,
      "二综": 23,
      "A楼": 13,
      "实验楼": 16,
      "西综": 10,
      "图书馆": 11,
      "教学楼E": 26,
      "教学楼F": 27,
      "教学楼A": 18,
      "教学楼B": 19,
      "教学楼C": 20,
      "教学楼D": 21,
      "外语楼": 22,
      "经管数理": 24,
      "船海土木": 25
    },

    area_para_list: {
      "东校区": '01',
      "南校区": '02',
      "西校区": '03',
      "张家港": '04',
      "苏州理工": '05'
    },
    area_index: 0,
    area: '东校区',
    area_para: '01',

    zc_index: 0,
    zc: '第一周',
    zc_para: '1',

    building_index: 0,
    building: '综合楼B',
    building_para: '2',

    week_index: 0,
    week: '周一',
  },
  // 切换校区
  bindAreaChange: function(e) {
    var that = this
    var area_value = this.data.areaArray[e.detail.value]
    // console.log(e.detail.value)
    // console.log(area_value)
    that.setData({
      area_index: e.detail.value,
      area: area_value,
      area_para: this.data.area_para_list[area_value]
    })
    if (this.data.area_index == 0) {
      that.setData({
        chooseBuildingArray: this.data.eastBuildingArray,
        building_para: 2,
        building: '综合楼B'
      })
    } else if (this.data.area_index == 1) {
      that.setData({
        chooseBuildingArray: this.data.southBuildingArray,
        building_para: 12,
        building: '一宗'
      })
    } else if (this.data.area_index == 2) {
      that.setData({
        chooseBuildingArray: this.data.westBuildingArray,
        building_para: 10,
        building: '西综'
      })
    } else if (this.data.area_index == 3) {
      that.setData({
        chooseBuildingArray: this.data.zhangBuildingArray,
        building_para: 26,
        building: '教学楼E'
      })
    } else {
      that.setData({
        chooseBuildingArray: this.data.suBuildingArray,
        building_para: 18,
        building: '教学楼A'
      })
    }
  },
  //切换周次
  bindZcChange: function(e) {
    var that = this
    var zc_value = this.data.zcArray[e.detail.value]
    that.setData({
      zc_index: e.detail.value,
      zc: zc_value,
      zc_para: Number(e.detail.value) + 1
    })
  },
  // 切换楼
  bindBuildingChange: function(e) {
    var that = this
    var building_value = this.data.chooseBuildingArray[e.detail.value]
    that.setData({
      building_index: e.detail.value,
      building: building_value,
      building_para: this.data.building_para_list[building_value]
    })
  },
  // 切换星期几
  bindWeekChange: function(e) {
    var that = this
    var weekIndex = e.detail.value
    that.setData({
      week_index: weekIndex,
      week: this.data.weekArray[weekIndex],
    })
  },

  search: function(event) {
    this.setData({
      isLoad: true,
    })
    var that = this
    wx.getStorage({
      key: 'account',
      success: function(res) {
        if (res.data) {
          var account = res.data
          that.setData({
            username: account.username,
            password: account.password
          })
          wx.request({
            url: 'https://guohe3.com/vpnClassroom',
            method: 'POST',
            data: {
              username: that.data.username,
              password: that.data.password,
              school_year: that.data.school_year,
              area_id: that.data.area_para,
              building_id: that.data.building_para,
              zc1: that.data.zc_para
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              if (res.data.code == 200) {
                var weekIndex = that.data.week_index
                var roomsInfo = res.data.info
                var weekArray = ["Mon", "Tue", "Wedn", "Thur", "Fri", "Sat", "Sun"]
                var result = []
                for (var i = 0; i < roomsInfo.length; i++) {
                  if (roomsInfo[i].weekday == weekArray[weekIndex]) {
                    var room = {
                      place: roomsInfo[i].place,
                      time: that.timeChange(roomsInfo[i].time),
                      weekday: that.data.weekArray[weekIndex]
                    }
                    result.push(room)
                  }
                }

                that.setData({
                  empty_classroom_info: result,
                  isLoad: false,
                })

                console.log(result)
              } else {
                console.log("空教室查询失败")
              }
            }
          })
        } else {
          console.log("未登录")
        }
      },
    })
  },

  //根据需要更换课时信息
  timeChange: function(time) {
    var timeChanged = ''
    switch (time) {
      case '0102':
        timeChanged = '第1大节'
        break
      case '0304':
        timeChanged = '第2大节'
        break
      case '0506':
        timeChanged = '第3大节'
        break
      case '0708':
        timeChanged = '第4大节'
        break
      case '091011':
        timeChanged = '第5大节'
        break
    }
    return timeChanged
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var that = this
    // wx.getStorage({
    //     key: 'account',
    //     success: function(res) {
    //         if (res.data) {
    //             var account = res.data
    //             that.setData({
    //                 username: account.username,
    //                 password: account.password
    //             })
    //             wx.request({
    //                 url: 'https://guohe3.com/vpnClassroom',
    //                 method: 'POST',
    //                 data: {
    //                     username: that.data.username,
    //                     password: that.data.password,
    //                     school_year: that.data.school_year,
    //                     area_id: that.data.area_para,
    //                     building_id: that.data.building_para,
    //                     zc1: that.data.zc_para
    //                 },
    //                 header: {
    //                     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //                 },
    //                 success: function(res) {
    //                     if (res.data.code == 200) {
    //                         that.setData({
    //                             isLoad: false,
    //                             empty_classroom_info: res.data.info
    //                         })
    //                         console.log(that.data.empty_classroom_info)
    //                     } else {
    //                         console.log("空教室查询失败")
    //                     }
    //                 }
    //             })
    //         } else {
    //             console.log("未登录")
    //         }
    //     },
    // })

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.search()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面分享
   */
  onShareAppMessage: function(res) {
    return {
      title: '点击查看空教室',
      path: 'pages/core/classroom/classroom'
    }
  }
})