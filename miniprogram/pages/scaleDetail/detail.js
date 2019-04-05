// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.id
    // let id=1
    this.getData(id)
  },

  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goQuestion(e){
    let id = e.currentTarget.dataset.id,
    url='/pages/scaleQuestion/question?id='+id
    wx.navigateTo({
      url:url
    })
  },
  getData(id) {
    let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'dbGet',
      // 传给云函数的参数
      data: {
        param:{
          scale_id:id
        }
      },
      fail: console.error,
      success(res) {
        console.log(res.result) // 3
        that.setData({
          question: res.result
        })

      }

    })
  }
})