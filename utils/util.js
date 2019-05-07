function formatDate(date, split) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join(split || '')
}


function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate
}


function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function showData(semester, week, currentTab, that) { //week是星期几
  wx.getStorage({
    key: semester,
    success: function(res) {
      console.log("从缓存读取")
      that.setData({
        load: 'hide',
        content: 'show'
      })
      showDataUtil(res.data, semester, week, currentTab, that)
    },
    fail: function() {
      console.log('从网络获取')
      wx.getStorage({
        key: 'account',
        success: function(res) {
          if (res.data) {
            wx.request({
              url: 'https://guohe3.com/api/kb',
              method: 'POST',
              data: {
                username: res.data.username,
                password: res.data.password,
                semester: semester
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function(res) {
                if (res.data.code == 500) {
                  wx.showToast({
                    title: '教务系统异常',
                    icon: 'loding'
                  })
                }
                if (res.data.code == 200) {
                  //设置课表缓存
                  wx.setStorage({
                    key: semester,
                    data: res.data.info,
                  })

                  showDataUtil(res.data.info, semester, week, currentTab, that)
                  that.setData({
                    load: 'hide',
                    content: 'show'
                  })
                }
              },
              fail() {
                wx.showToast({
                  title: '网络获取失败',
                  icon: 'loading',
                  duration: 2000
                })
              }
            })
          }
        },
        fail() {
          console.log('用户未登录')
          wx.showModal({
            title: '提示',
            content: '请先用教务系统账号登录',
            success: function(res) {
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
}

function showDataUtil(info, semester, week, currentTab, that) {
  var data_list = [
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ]

  var date = semester + '_' + (parseInt(week) + 1)

  var _data = info[parseInt(week)][date] //整个学期的课表数据(未转化)

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
    kbData: data_list
  })

  var today_data = data_list[currentTab]
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

  that.setData({
    todayData: today_data_list
  })
}

//获取one的图文信息
function getOneContent(callback) {
  wx.request({
    url: 'https://api.itooi.cn/one/day',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "GET",
    success: function(res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}

function today_dataIsNull(data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].length > 2) {
      return false
    }
  }
  return true;
}

function today_dataIsNull(data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].length > 2) {
      return false
    }
  }
  return true;
}

// 指定排序的比较函数
function compare(property) {
  return function (obj1, obj2) {
    var value1 = obj1[property];
    var value2 = obj2[property];
    return value1 - value2;     // 升序
  }
}

module.exports = {
  // getToplistInfo: getToplistInfo,
  // getSongInfo: getSongInfo,
  // GetRandomNum: GetRandomNum,
  today_dataIsNull: today_dataIsNull,
  formatTime: formatTime,
  formatDate: formatDate,
  showData: showData,
  getOneContent: getOneContent,
  compareByKeys: compare
}