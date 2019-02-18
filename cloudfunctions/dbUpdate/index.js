// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let cltName = event.cltName || 'tables'
  let param = event.param || {}

  try {
    return await db.collection('mydata').add({
      data:{
        filed1:filedvalue1,
        filed2:filedvalue2
      }
    })
  } catch (e) {
    console.log(e)
  }
  
}