// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let result = "未找到计算公式"

  if (Object.keys(event).length > 0) {
    event.formula_id = Number(event.formula_id)
  }
  console.log("event:", event, event)
  // 累加
  if (event.formula_id == 1) {
    let s = 0;
    for (let i = event.arr.length - 1; i >= 0; i--) {
      s += event.arr[i];
    }
    result = Math.round(s * 1.25);
  }
  return result

}