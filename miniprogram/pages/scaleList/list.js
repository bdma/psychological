// miniprogram/pages/scaleList/scaleList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tables: []
  },

  onShow: function () {
    this.getData()
    // this.getUser()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goDetail(e) {
    let id = e.currentTarget.dataset.id,
    url = '/pages/scaleDetail/detail?id='+id
    // console.log(id)
    wx.navigateTo({
      url: url
    })
  },
  getData() {
    let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'dbGet',
      // 传给云函数的参数
      data: {
      },
      fail: console.error,
      success(res) {
        console.log(res.result) // 3
        that.setData({
          tables: res.result.data
        })

      }

    })
  },
  getUser(){
    let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'login',
      // 传给云函数的参数
      data: {
      },
      fail: console.error,
      success(res) {
        console.log(res.result) // 3
        // that.setData({
        //   tables: res.result.data
        // })

      }

    })
  }

})