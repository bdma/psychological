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
    // let score=options.score
    // let name = options.name
    let name = ""
    let score = 88
    this.setData({
      score,
      name
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