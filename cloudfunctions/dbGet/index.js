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
  console.log("param,event:", param, event)
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
    let openIdArr = []
    openIdArr.push(OPENID)

    let scores = await db.collection("results").where(_.or([
      {
        openId: OPENID
      }, {
        fromOpenId: OPENID
      }
    ])
    ).get()
    scores.data.forEach(el => {
      openIdArr.push(el.openId)
    })
    let users = await db.collection(cltName).where(
      {
        openId: _.in(openIdArr)
      }
    ).get()
    // console.log("users openIdArr:", users, users.data, openIdArr)
    // console.log("scores openIdArr:", scores, scores.data, openIdArr)
    result = {
      users: users.data,
      scores: scores.data
    }
  }
  result.openid = OPENID
  console.log("result:", result)
  return result
}