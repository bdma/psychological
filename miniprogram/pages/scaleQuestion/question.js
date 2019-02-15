// miniprogram/pages/question/question.js
let selectArr = []

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: [],
    curQuestionIndex: 0,
    answerArr: [],
    percent:10

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let id=options.id
    let id = 1
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
          questions: res.result.questions,
          percent:(that.data.curQuestionIndex+1)*100/res.result.questions.length
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
    // 显示下一题
    setTimeout(() => {
      that.setData({
        selectAnswerIndex: -1,
        curQuestionIndex: that.data.curQuestionIndex+1,
        percent:(that.data.curQuestionIndex+2)*100/that.data.questions.length
      })
      
    }, 200);


  },
  upAnswer(){
    
  }

})