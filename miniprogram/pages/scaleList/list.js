// miniprogram/pages/scaleList/scaleList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    tables: [],
    results: {},
    showPop: true
  },

  onShow: function () {
    this.getData('dbGet')
    this.getData('dbGet', {
      cltName: 'users',
      param: {}
    })
  },

  onShareAppMessage: function () {

  },
  getData(functionName, data = {
    cltName: 'tables',
    param: {}
  }) {
    let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: functionName,
      // 传给云函数的参数
      data,
      fail: console.error,
      success(res) {
        if (data.cltName == "tables") {
          console.log("量表列表", res.result) // 3
          that.setData({
            tables: res.result.data
          })
        } else if (data.cltName == "users") {
          res.result.data.forEach(ele => {
            ele.scores_keys = Object.keys(ele.scores)
          });
          console.log("已测列表", res.result.data) // 3
          that.setData({
            results: res.result.data
          })
        }

      }

    })
  },
  goDetail(e) {
    let id = e.currentTarget.dataset.id,
      url = '/pages/scaleDetail/detail?id=' + id
    console.log(id)
    wx.navigateTo({
      url: url
    })
  },
  selecttab(e) {
    this.setData({
      tab: e.currentTarget.dataset.tab
    })

  },
  selectShareScore(e) {
    let index = e.currentTarget.dataset.index
    this.data.tables[index].selected = !this.data.tables[index].selected
    this.setData({
      tables: this.data.tables
    })
    console.log(this.data.tables)
  },
  closePop() {
    this.setData({
      showPop: false
    })

  },
  showPop() {
    this.setData({
      showPop: true
    })
  },
  selectedAll() {
    this.data.tables.forEach(ele =>{
      ele.selected = !ele.selected
      
    })
  }

})