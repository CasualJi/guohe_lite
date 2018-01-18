var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    load:'show',
    content:'hide',
    array: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周',
      '第9周', '第10周', '第11周', '第12周', '第13周', '第14周', '第15周', '第16周', '第17周', '第18周','第19周', '第20周',],
    semesterArray:[
      '2017-2018-1',
      '2017-2018-2'
    ],
    Sindex:1,//第几个学年
    index: 0,//第几周
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值 周几
    scrollLeft: 0, //tab标题的滚动条位置,
    kbData: [],//一周的课表数据
    todayData: [],//当天的课表数据,
    semester:'2017-2018-2',//学年,
    xiaoli:{}
  },
  //切换学年
  bindSemesterChange: function (e) {
    this.setData({
      load: 'show',
      content: 'hide'
      })
    var semsester_value = this.data.semesterArray[e.detail.value]

    this.setData({
      Sindex: e.detail.value,
      semester: semsester_value
    })
    util.showData(semsester_value, e.detail.value, this.data.currentTab,this)
  },
  //切换周数
  bindPickerChange: function (e) {
    
    this.setData({
      index: e.detail.value
    })
    var semester_value=this.data.semester
    
    util.showData(semester_value, e.detail.value, this.data.currentTab,this)
  },
  //切换天数
  switchTab: function (e) {
    var kb_data = this.data.kbData//获取本周数据
    
    this.setData({
      currentTab: e.detail.current,
    });
    var today_data = kb_data[this.data.currentTab]
    
    var today_data_list = new Array()
    for (var i = 0; i < today_data.length; i++) {
      var temp = {}
      if (today_data[i]) {
        var info_list = today_data[i].split("@")
        temp.index = (i * 2 + 1) + '-' + (i * 2 + 2)
        temp.cnum = info_list[0]
        if (info_list[1].length >= 20) {
          temp.cname = info_list[1].split(' ', 1).join(' ')
        } else {
          temp.cname = info_list[1]
        }
        temp.tname = info_list[2]
        temp.address = info_list.length >= 4 ? info_list[3] : '未指定'

      }
      
      if (JSON.stringify(temp) != "{}") {
        today_data_list.push(temp)
      }
      
    }
    //更新显示今天的数据
   
    this.setData({
      todayData: today_data_list
    })
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    
    var that=this
    //获取校历
    wx.request({
      url: 'https://guohe3.com/api/xiaoli',
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          var currentTab=0;
          var info = res.data.info
          if (info.currentTab == '星期二') {
            currentTab = 1
          }
          else if (info.currentTab == '星期三') {
            currentTab = 2
          }
          else if (info.currentTab == '星期四') {
            currentTab = 3
          }
          else if (info.currentTab == '星期五') {
            currentTab = 4
          }
          else if (info.currentTab == '星期六') {
            currentTab = 5
          }
          else if (info.currentTab == '星期日') {
            currentTab = 6
          }else{
            currentTab = 0
          }
          var index = info.index
          wx.getStorage({
            key: that.data.semester,
            success: function(res) {
              console.log("从缓存中读取课表")
              var data_list = [[], [], [], [], [], [], []]
              var semester = '2017-2018-2'
              var date = semester + '_' + (parseInt(index - 1) + 1)
              var _data = res.data[parseInt(index - 1)][date]//整个学期的课表数据(未转化)

              //把行数据转换为列数据
              for (var i = 0; i < _data.length; i++) {
                for (var key in _data[i]) {
                  if (key == 'monday') {
                    data_list[0].push(_data[i][key])

                  }
                  if (key == 'tuesday') {
                    data_list[1].push(_data[i][key])
                  }
                  if (key == 'wednesday') {
                    data_list[2].push(_data[i][key])
                  }
                  if (key == 'thursday') {
                    data_list[3].push(_data[i][key])
                  }
                  if (key == 'friday') {
                    data_list[4].push(_data[i][key])
                  }
                  if (key == 'saturday') {
                    data_list[5].push(_data[i][key])
                  }
                  if (key == 'sunday') {
                    data_list[6].push(_data[i][key])
                  }
                }
              }

              that.setData({
                kbData: data_list,
                index: index - 1,
                currentTab: currentTab,
                load: 'hide',
                content: 'show'
              })
            },fail(){
              wx.getStorage({
                key: 'account',
                success: function (res) {
                  if (res.data) {
                    wx.request({
                      url: 'https://guohe3.com/api/kb',
                      method: 'POST',
                      data: {
                        username: res.data.username,
                        password: res.data.password,
                        semester: that.data.semester
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded' // 默认值
                      },
                      success: function (res) {
                        if (res.data.code == 200) {
                          //设置课表缓存
                          wx.setStorage({
                            key: that.data.semester,
                            data: res.data.info,
                          })
                          console.log('设置课表缓存')
                          var data_list = [[], [], [], [], [], [], []]
                          var semester = '2017-2018-2'
                          var date = semester + '_' + (parseInt(index - 1) + 1)
                          var _data = res.data.info[parseInt(index - 1)][date]//整个学期的课表数据(未转化)

                          //把行数据转换为列数据
                          for (var i = 0; i < _data.length; i++) {
                            for (var key in _data[i]) {
                              if (key == 'monday') {
                                data_list[0].push(_data[i][key])

                              }
                              if (key == 'tuesday') {
                                data_list[1].push(_data[i][key])
                              }
                              if (key == 'wednesday') {
                                data_list[2].push(_data[i][key])
                              }
                              if (key == 'thursday') {
                                data_list[3].push(_data[i][key])
                              }
                              if (key == 'friday') {
                                data_list[4].push(_data[i][key])
                              }
                              if (key == 'saturday') {
                                data_list[5].push(_data[i][key])
                              }
                              if (key == 'sunday') {
                                data_list[6].push(_data[i][key])
                              }
                            }
                          }

                          that.setData({
                            kbData: data_list,
                            index: index - 1,
                            currentTab: currentTab,
                            load: 'hide',
                            content: 'show'
                          })


                        }
                        else {
                          console.log('用户名或密码错误')
                        }
                      },
                      fail() {
                        wx.showToast({
                          title: '网络获取失败',
                          icon: 'loading',
                          duration: 2000
                        })

                        that.onLoad()
                      }
                    })
                  }
                }, fail() {
                  console.log('账号未登录')
                  wx.showModal({
                    title: '提示',
                    content: '请先用教务系统账号登录',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                          url: '/pages/login/login',
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
              })
            }
          })
        
          

          
          // var semester = that.data.semester
          // var week = index-1
          
         
          // util.showData(semester, week, currentTab, that)
         
         
        }
      },fail(){
        that.onLoad()
      }
    })

    
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
       
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  footerTap: app.footerTap
})