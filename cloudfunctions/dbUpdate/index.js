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
  let cltName = 'users',
    timeStr = time()
  console.log("timeStr:", timeStr)

  return await db.collection(cltName).where({
    openId: event.userInfo.openId
  }).get().then(res => {
    // res.data 是包含以上定义的两条记录的数组
    console.log("update:", res.data)
    let scoreObj = {
      name: event.param.name,
      score: event.param.score,
      time: timeStr
    }
    if (res.data.length) {
      console.log("update res.data.length")

    } else {
      // let scores = [].push(scoreObj)
      // await db.collection(cltName).add({
      //   data: {
      //     openId: event.userInfo.openId
      //     // openId: "123"
      //   }
      // }).then(res => {
      //   console.log(res)
      // })
    }
  })
}

