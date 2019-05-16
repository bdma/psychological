// miniprogram/pages/scaleList/scaleList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: false,
    tables: []
  },

  onShow: function () {
    this.getData('dbGet')
    this.getData('dbGet')
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
      url = '/pages/scaleDetail/detail?id=' + id
    console.log(id)
    wx.navigateTo({
      url: url
    })
  },
  getData(tableName) {
    let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: tableName,
      // 传给云函数的参数
      data: {},
      fail: console.error,
      success(res) {
        console.log(res.result) // 3
        that.setData({
          tables: res.result.data
        })

      }

    })
  },
  getUser() {
    let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'login',
      // 传给云函数的参数
      data: {},
      fail: console.error,
      success(res) {
        console.log(res.result) // 3
        // that.setData({
        //   tables: res.result.data
        // })

      }

    })
  },
  selecttab(e) {
    this.setData({
      tab: e.currentTarget.dataset.tab
    })

  }

})