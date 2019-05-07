//学生登陆
const login ='https://guohe3.com/api/student/login'

//查询学生校历信息
const xiaoli = 'https://guohe3.com/api/justInfo/getSchoolCalendar'

//查询学生的所有课表
const kb = 'https://guohe3.com/api/student/getSchoolTimetable'

//获取云端推送的消息
const get_mess = 'https://guohe3.com/getToast'

//获取学生早操信息
const get_exercise = 'https://guohe3.com/vpnRun'

//获取学生俱乐部信息
const get_sport = 'https://guohe3.com/vpnSport'

//获取学生成绩
const get_grade ='https://guohe3.com/api/student/getScoreAll'

//获取学生绩点
const get_gpa ='https://guohe3.com/api/student/getJidian'

//反馈接口
const feedback ='https://guohe3.com/api/feedback/create'

//首页item数组的信息
const core = [
  [{
      id: 'kb',
      name: '表',
      enable:true
    },
    {
      id: 'score',
      name: '分',
      enable:true
    },
    {
      id: 'classroom',
      name: '屋',
      enable:true
    },
    {
      id: 'library',
      name: '书',
      enable: true,
    },
    {
      id: 'bus',
      name: '车',
      enable: true
    },
    {
      id: 'sport',
      name: '体',
      enable: true
    },
    {
      id: 'guide',
      name: '图',
      enable: true
    }
  ]
]

const card = {
  'kb': {
    show: false,
    time_list: [{
        begin: '8:00',
        end: '8:45'
      },
      {
        begin: '8:55',
        end: '9:40'
      },
      {
        begin: '10:05',
        end: '10:50'
      },
      {
        begin: '11:00',
        end: '11:45'
      },
      {
        begin: '14:00',
        end: '14:45'
      },
      {
        begin: '14:55',
        end: '15:40'
      },
      {
        begin: '16:05',
        end: '16:50'
      },
      {
        begin: '17:00',
        end: '17:45'
      },
      {
        begin: '19:00',
        end: '19:45'
      },
      {
        begin: '19:55',
        end: '20:40'
      },
      {
        begin: '20:50',
        end: '21:35'
      },
      {
        begin: '21:45',
        end: '22:30'
      }
    ],
    data: {}
  },
  'kb': {
    show: true,
    nothing: true,
    data: {
      'last_time': '',
      'balance': 0,
      'cost_status': false,
      'today_cost': {
        value: [],
        total: 0
      }
    }
  },
  'ykt': {
    show: false,
    data: {
      'last_time': '',
      'balance': 0,
      'cost_status': false,
      'today_cost': {
        value: [],
        total: 0
      }
    }
  },
  'jy': {
    show: true,
    data: {}
  },
  'sdf': {
    show: false,
    data: {
      'room': '',
      'record_time': '',
      'cost': 0,
      'spend': 0
    }
  }
}


module.exports = {
  //登陆
  LOGIN:login,
  //获取校历
  XIAO_LI: xiaoli,
  //获取课表
  KB: kb,
  //获取云端推送的消息
  GET_MESS: get_mess,
  CORE: core,
  CARD: card,
  //获取学生早操信息
  EXERCISE: get_exercise,
  //获取学生俱乐部信息
  CLUB: get_sport,
  //获取绩点信息
  GPA:get_gpa,
  //获取成绩信息
  GRADE:get_grade,
  //反馈
  FEEDBACK:feedback
};