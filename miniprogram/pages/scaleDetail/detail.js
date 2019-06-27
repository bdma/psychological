// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    // let id=1
    this.getData(id)
  },

  onShow: function () {

  },

  goQuestion(e) {
    let id = e.currentTarget.dataset.id,
      url = '/pages/scaleQuestion/question?id=' + id
    wx.navigateTo({
      url: url
    })
  },
  getData(id) {
    let that = this,
      idArr = JSON.parse("[" + id + "]")
    console.log("id:", idArr)
    console.log("idArr:", idArr)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'dbGet',
      // 传给云函数的参数
      data: {
        cltName: 'tables',
        param: {
          scale_ids: idArr
        }
      },
      fail: console.error,
      success(res) {
        console.log(res.result) // 3
        that.setData({
          question: res.result.data[0]
        })

      }

    })
  },
  onGetUserInfo(e) {
    console.log("onGetUserInfo:", e.detail)
    wx.setStorageSync("userInfo", e.detail.userInfo)
  }
})