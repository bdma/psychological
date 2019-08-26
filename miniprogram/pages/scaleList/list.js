// miniprogram/pages/scaleList/scaleList.js
let Query = {}
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
  onLoad(e) {
    console.log("onload:", e)
    Query = e
  },
  onShow: function () {
    this.inite()
  },

  onShareAppMessage: function () {
    let selectedScaleArr = []
    this.data.tables.forEach(ele => {
      if (ele.selected) {
        selectedScaleArr.push(ele.scale_id)
      }
    })
    let selectedScaleIds = selectedScaleArr.join(),
      path = `/pages/scaleList/list?shareOpenId=${this.data.openId}&scale_ids=${selectedScaleIds}`

    console.log("分享 shareOpenId,selectedScaleId,path:", this.data.openId, selectedScaleIds, path)
    this.setData({
      showPop: false
    })
    let nickName = wx.getStorageSync("userInfo").nickName
    // nickName="马里奥看看姐姐礼哦撒空间的哈家"
    // nickName.split("")
    if (nickName.split("").length > 10) {
      nickName = nickName.substring(0, 10) + "..."
    }
    return {
      title: nickName + ' 分享的量表',
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
  inite() {
    let query = Query,
      scaleParam = {}
    if (query.scale_ids) {
      let arr = query.scale_ids.split(",")
      for (let i = 0, l = arr.length; i < l; i++) {
        arr[i] = ~~arr[i]
      }
      scaleParam.scale_ids = arr
    }
    if (query.shareOpenId) {
      scaleParam.shareOpenId = query.shareOpenId
    }
    console.log("onShow query,scaleParam:", query, scaleParam)
    this.getData('dbGet', {
      cltName: 'tables',
      param: scaleParam
    })
    this.getData('dbGet', {
      cltName: 'users',
      param: scaleParam
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
          // res.result.data.forEach(ele => {
          //   ele.scores_keys = Object.keys(ele.scores)
          // });
          res.result.scores.reverse()
          console.log("已测列表", res.result) // 3

          that.setData({
            results: res.result
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

  },
  swiperListen(e) {
    console.log("swiperListen", e.detail)
    this.inite()
    this.setData({
      tab: e.detail.current
    })
  },
  handleContact(e) {
    console.log("客服handleContact e.path,e.query:", e.path, e.query)
  }

})