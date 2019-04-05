// miniprogram/pages/scaleResult/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let score = options.score,
      name = options.name,
      take_time = options.take_time,
      result_status = options.result_status.split('，')
    // let name = "",
    //   score = 88
    this.setData({
      score,
      name,
      take_time,
      result_status
    })
  },

  onShow: function () {
    this.upAnswer()
  },

  onShareAppMessage: function () {

  },
  upAnswer() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'dbUpdate',
      // 传给云函数的参数
      data: {
        param: {
          score: this.data.score,
          take_time: this.data.take_time,
          name: this.data.name
        }
      },
      fail: console.error,
      success(res) {
        console.log(res) // 3
      }
    })
  }
})