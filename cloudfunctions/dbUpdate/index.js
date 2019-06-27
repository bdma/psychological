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
  // console.log("nowTime:", nowTime)
  return nowTime
}
// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID, APPID, UNIONID } = cloud.getWXContext()
  const _ = db.command


  let userArr = [],
    scoreObj = event.param.scoreObj
  //时间字段过长，干掉年
  scoreObj.time = time().slice(5)

  scoreObj.openId = OPENID
  console.log("scoreObj:", scoreObj)
  //写入测试结果
  await db.collection('results').add({
    data: scoreObj
  }).then(res => {
    console.log("写入测试结果:", res)
  })
  // 查询用户信息
  await db.collection('users').where({
    openId: OPENID
  }).get().then(res => {
    console.log("查询用户信息:", res.data)
    userArr = res.data
  })
  if (!userArr.length) {
    //写入用户信息
    let userInfoObj = event.param.userInfoObj
    userInfoObj.openId = OPENID
    console.log("userInfoObj:", userInfoObj)
    await db.collection('users').add({
      data: userInfoObj
    }).then(res => {
      console.log("写入用户信息:", res)
    })
  }
}

