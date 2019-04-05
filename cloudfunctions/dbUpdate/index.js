// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
function time() {
  // 添加分隔符“-”
  let seperator = "-";
  // 获取当前月份
  let date = new Date()
  nowMonth = date.getMonth() + 1;
  // 获取当前是几号
  let strDate = date.getDate();
  // 对月份进行处理，1-9月在前面添加一个“0”
  if (nowMonth >= 1 && nowMonth <= 9) {
    nowMonth = "0" + nowMonth;
  }
  // 对月份进行处理，1-9号在前面添加一个“0”
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }

  let hours = date.getHours();
  hours = hours > 9 ? hours : ('0' + hours);
  let minutes = date.getMinutes();
  minutes = minutes > 9 ? minutes : ('0' + minutes);
  let seconds = date.getSeconds();
  seconds = seconds > 9 ? seconds : ('0' + seconds);
  let time = hours + ':' + minutes + ':' + seconds;


  // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
  let nowTime = date.getFullYear() + seperator + nowMonth + seperator + strDate + ' ' + time;
  return nowTime
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ = db.command
  let cltName = 'users',
    timeStr = time(),
    scoreObj = {
      time: timeStr
    },
    searchArr = []

  Object.assign(scoreObj, event.param)
  scores = [].concat(scoreObj)

  console.log("timeStr scoreObj scores:", timeStr, scoreObj, scores)

  await db.collection(cltName).where({
    openId: event.userInfo.openId
  }).get().then(res => {
    console.log("where get:", res.data)
    searchArr = res.data
  })
  if (searchArr.length) {
    await db.collection(cltName).where({
      openId: event.userInfo.openId
    }).update({
      data: {
        scores: _.push(scoreObj)
      }
    }).then(res => {
      console.log("update:", res)
    })
  } else {
    // let scores = [].push(scoreObj)
    console.log("add scores:", scores)
    await db.collection(cltName).add({
      data: {
        openId: event.userInfo.openId,
        scores: scores
      }
    }).then(res => {
      console.log("add:", res)
    })
  }
}

