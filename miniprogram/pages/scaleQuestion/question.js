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
    answerArr: [],
    percent: 10

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
  },
  getData(id) {
    let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'dbGet',
      // 传给云函数的参数
      data: {
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
          percent: (that.data.curQuestionIndex + 1) * 100 / res.result.questions.length
        })

      }

    })
  },
  selectAnswer(e) {
    let score = e.currentTarget.dataset.score,
      index = e.currentTarget.dataset.index,
      that = this

    selectArr.push(score)
    this.setData({
      selectAnswerIndex: index,
      answerArr: selectArr //储存所选答案
    })
    console.log("curQuestionIndex :", that.data.curQuestionIndex, that.data.questions.length)
    if (that.data.curQuestionIndex == 0) {
      startTime = (new Date()).getTime()
    }
    if (that.data.curQuestionIndex + 1 >= that.data.questions.length) {
      let endTime = (new Date()).getTime(),
        takeTime = (endTime - startTime) / 1000,
        score = this.getTotalScore(selectArr)

      console.log("score takeTime:", score, startTime, endTime, takeTime)

      let url = '/pages/scaleResult/result?score=' + score + '&name=' + that.data.name + '&result_status=' + that.data.detail.result_status + '&take_time=' + takeTime
      // console.log(id)
      return wx.navigateTo({
        url: url
      })
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
  }


})