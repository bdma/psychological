// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // return await db.collection('tables').get()
  // const wxContext = cloud.getWXContext()
  let cltName = event.cltName || 'tables'
  let param = event.param || {}
  if (Object.keys(param).length > 0) {
    param.scale_id = Number(param.scale_id)
  }
  console.log("param:", param)
  let result = await db.collection(cltName).where(param).get()
  if (Object.keys(param).length > 0) {
    result = result.data[0]
  }
  // result.param = param
  return result
}