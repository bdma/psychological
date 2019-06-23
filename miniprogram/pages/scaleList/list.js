// miniprogram/pages/scaleList/scaleList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    tables: [],
    results: {},
    hadselectedAll: false,
    showPop: false
  },

  onShow: function () {
    let query = wx.getStorageSync("query")
    console.log("list onShow query:", query)
    this.getData('dbGet', {
      cltName: 'tables',
      param: query.scale_ids
    })
    this.getData('dbGet', {
      cltName: 'users',
      param: {}
    })
  },

  onShareAppMessage: function () {
    let selectedScaleArr = []
    this.data.tables.forEach(ele => {
      if (ele.selected) {
        selectedScaleArr.push(ele.scale_id)
      }
    })
    let selectedScaleIds = selectedScaleArr.join(),
      path = `/page/user?openid=${this.data.openId}&scale_ids=${selectedScaleIds}`

    console.log("分享 openid,selectedScaleId,path:", this.data.openId, selectedScaleIds, path)
    this.setData({
      showPop: false
    })
    return {
      title: '分享所选表格',
      path
    }
  },
  onGetUserInfo(e) {
    console.log("onGetUserInfo:", e.detail)
    wx.setStorageSync("userInfo", e.detail.userInfo)
    this.setData({
      showPop: true
    })
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
            tables: res.result.data,
            openId: res.result.openid
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

    let allSelected = this.data.tables.every(ele => {
      return ele.selected
    })
    console.log(allSelected, this.data.tables)

    this.setData({
      tables: this.data.tables,
      hadselectedAll: allSelected
    })

  },
  selectedAll() {
    this.data.tables.forEach(ele => {
      ele.selected = !this.data.hadselectedAll

    })
    this.setData({
      tables: this.data.tables,
      hadselectedAll: !this.data.hadselectedAll
    })
  },
  closePop() {
    this.setData({
      showPop: false
    })

  }

})