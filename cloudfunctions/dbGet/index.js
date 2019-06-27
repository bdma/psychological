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
  console.log("param,event:", param,event)
  if (cltName == "tables") {

    if (param.scale_ids) {
      result = await db.collection(cltName).where(
        {
          scale_id: _.in(param.scale_ids)
        }
      ).get()
    } else {
      result = await db.collection(cltName).get()

    }
  }
  if (cltName == "users") {
    result = await db.collection(cltName).get()
    console.log("result:", result.data)
    if (param.shareOpenId) {
      let newResult = result.data.filter(ele => {
        let scores = ele.scores.filter(el => {
          el.shareOpenId == param.shareOpenId
        })
        return scores.length
      })

      console.log("newResult:", newResult)
    }
  }

  result.openid = OPENID
  console.log("result:", result)
  return result
}