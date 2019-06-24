// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let cltName = event.cltName,
    param = event.param,
    result
  const { OPENID, APPID, UNIONID } = cloud.getWXContext()
  if (param.scale_ids) {
    result = await db.collection(cltName).where(
      {
        scale_id: _.in(param.scale_ids)
      }
    ).get()
  } else {
    result = await db.collection(cltName).get()

  }
  console.log("param,query:", param)
  // if (Object.keys(param).length > 0) {
  //   result = result.data[0]

  // }
  result.openid = OPENID
  console.log("result:", result)
  return result
}