// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID, APPID, UNIONID } = cloud.getWXContext()
  try {
    const result = await cloud.openapi.customerServiceMessage.send({
      touser: OPENID,
      msgtype: 'text',
      text: {
        content: '收到',
      },
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}