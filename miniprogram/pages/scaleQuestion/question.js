// miniprogram/pages/question/question.js
let selectArr = [],
  startTime = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: [],
    curQuestionIndex: 0,
    percent: 10,
    score: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    // let id = 1
    console.log("id:", id)
    this.getData(id)
  },

  onShow: function () {
    this.setData({
      curQuestionIndex: 0

    })
    selectArr = []

    // wx.showNavigationBarLoading()
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    // wx.makePhoneCall({
    //   phoneNumber: '16601716968' // 仅为示例，并非真实的电话号码
    // })
    // wx.scanCode({
    //   success(res) {
    //     console.log(res)
    //   }
    // })

  },
  getData(id) {
    let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'dbGet',
      // 传给云函数的参数
      data: {
        cltName: 'tables',
        param: {
          scale_id: id
        }
      },
      fail: console.error,
      success(res) {
        console.log(res.result) // 3
        that.setData({
          detail: res.result,
          name: res.result.name,
          questions: res.result.questions,
          resultStatus: res.result.result_status.split('，'),
          percent: (that.data.curQuestionIndex + 1) * 100 / res.result.questions.length
        })

      }

    })
  },
  selectAnswer(e) {
    wx.vibrateShort()

    let score = e.currentTarget.dataset.score,
      index = e.currentTarget.dataset.index,

      that = this

    selectArr.push(score)
    this.setData({
      selectAnswerIndex: index
    })
    console.log("curQuestionIndex :", that.data.curQuestionIndex, that.data.questions.length)
    if (that.data.curQuestionIndex == 0) {
      startTime = (new Date()).getTime()

    }
    if (that.data.curQuestionIndex + 1 >= that.data.questions.length) {
      let that = this,
        endTime = (new Date()).getTime(),
        takeTime = (endTime - startTime) / 1000,
        userInfoObj = wx.getStorageSync("userInfo"),
        score = this.getTotalScore(selectArr)
        console.log("this.data.detail.formula_id:", this.data.detail.formula_id)
      wx.cloud.callFunction({
        name: 'formula',
        data: {
          formula_id: this.data.detail.formula_id,
          arr: selectArr
        },
        fail: console.error,
        success(res) {
          console.log("formula:", res) // 3
          score = res.result
          that.setData({
            score,

          })
          let param = {
            scoreObj: {
              score,
              takeTime,
              table_name: this.data.name
            },
            userInfoObj
          }
          console.log("score takeTime:", score, startTime, endTime, takeTime, param)
          that.updateScore(param)
          return
        }
      })


      // let url = '/pages/scaleResult/result?score=' + score + '&name=' + that.data.name + '&result_status=' + that.data.detail.result_status + '&take_time=' + takeTime
      // console.log(id)
    }

    // 显示下一题
    setTimeout(() => {
      that.setData({
        selectAnswerIndex: -1, //重置上一题选中状态
        curQuestionIndex: that.data.curQuestionIndex + 1,
        percent: (that.data.curQuestionIndex + 2) * 100 / that.data.questions.length
      })

    }, 200);


  },
  getTotalScore(arr) {
    if (this.data.detail.formula == "total_product") {
      let s = 0;
      for (let i = arr.length - 1; i >= 0; i--) {
        s += arr[i];
      }
      return Math.round(s * 1.25);
    }
  },
  backPre() {
    this.setData({
      curQuestionIndex: this.data.curQuestionIndex - 1,
      percent: (this.data.curQuestionIndex - 1) * 100 / this.data.questions.length
    })
  },
  updateScore(obj) {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'dbUpdate',
      // 传给云函数的参数
      data: {
        param: obj
      },
      fail: console.error,
      success(res) {
        console.log(res) // 3
      }
    })
  }


})