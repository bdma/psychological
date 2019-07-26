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
    let query = wx.getStorageSync("query"),
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
    console.log("list onShow query,scaleParam:", query, scaleParam)
    this.getData('dbGet', {
      cltName: 'tables',
      param: scaleParam
    })
    this.getData('dbGet', {
      cltName: 'users',
      param: scaleParam
    })


    function downLoadImg(netUrl, storageKeyUrl) {
      console.log("downLoadImg", netUrl)
      wx.getImageInfo({
        src: netUrl,    //请求的网络图片路径
        success: function (res) {
          // console.log("downLoadImg")
          //请求成功后将会生成一个本地路径即res.path,然后将该路径缓存到storageKeyUrl关键字中
          wx.setStorage({
            key: storageKeyUrl,
            data: res.path,
          });
          console.log("downLoadImg", res.path)
        },
        complete: function (res) {
          // console.log("downLoadImg",res)
        }
      })
    }

    // downLoadImg("https://img.pyyx.com/a8cfaf0bf4b4d7067f48b847202393632880745c5c812737bc29a.jpg", "shareImg")//调用如上方法
    // var headUrl = wx.getStorageSync("shareImg"); //下面用canvas绘制头像 
    // const ctx = wx.createCanvasContext('myCanvas', this);

    // var wxSys = wx.getSystemInfoSync();
    // var screenScale = wxSys.screenWidth * 2 / 750;

    // ctx.save(); // 保存当前ctx的状态 
    // // 起始一条路径，或重置当前路径
    // ctx.beginPath();
    // ctx.arc(screenScale * 12, screenScale * 35, screenScale * 220, 0, 2000 * Math.PI, false);
    // ctx.strokeStyle = '#e3e7e8'; 
    // ctx.stroke(); 
    // ctx.clip(); //裁剪上面的圆形 

    // if (typeof (headUrl) != 'undefined' && headUrl != '') {
    //   console.log("headUrl", headUrl, screenScale)
    //   ctx.drawImage(headUrl, screenScale * 10, screenScale * 33, screenScale * 404, screenScale * 404); // 在刚刚裁剪的园上画图  
    // }
    // ctx.restore();
    // // 画出来
    // ctx.draw();
  },

  onShareAppMessage: function () {
    let selectedScaleArr = []
    this.data.tables.forEach(ele => {
      if (ele.selected) {
        selectedScaleArr.push(ele.scale_id)
      }
    })
    let selectedScaleIds = selectedScaleArr.join(),
      path = `/page/scaleList/list?shareOpenId=${this.data.openId}&scale_ids=${selectedScaleIds}`

    console.log("分享 shareOpenId,selectedScaleId,path:", this.data.openId, selectedScaleIds, path)
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
    this.setData({
      tab: e.detail.current
    })
  }

})