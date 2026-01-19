// miniprogram/pages/index/index.js
const app = getApp()

Page({
  data: {
    promises: [], // 承诺列表数据
    loading: true, // 加载状态
    hasUserInfo: false,
    userInfo: null
  },

  onLoad: function () {
    // 检查是否有用户信息
    // 实际项目中可能需要更完善的登录逻辑，这里简化处理
    this.fetchPromises()
  },

  onShow: function() {
    // 每次显示页面时刷新列表，确保数据最新
    this.fetchPromises()
  },

  // 获取承诺列表
  fetchPromises: function() {
    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'promiseGetList',
      data: {},
      success: res => {
        console.log('[云函数] [promiseGetList] 调用成功: ', res)
        if (res.result && res.result.success) {
          this.setData({
            promises: res.result.data,
            loading: false
          })
        } else {
          // 处理业务错误
          this.setData({ loading: false })
          wx.showToast({
            title: res.result.msg || '获取失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.error('[云函数] [promiseGetList] 调用失败', err)
        this.setData({ loading: false })
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        })
      }
    })
  },

  // 跳转到创建页面
  goToCreate: function() {
    // TODO: 实现创建页面后取消注释
    // wx.navigateTo({
    //   url: '../create/create',
    // })
    wx.showToast({
      title: '创建功能开发中',
      icon: 'none'
    })
  },

  // 跳转到详情页
  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id
    // TODO: 实现详情页面后取消注释
    // wx.navigateTo({
    //   url: `../detail/detail?id=${id}`,
    // })
    console.log('点击承诺 ID:', id)
  },
  
  // 下拉刷新
  onPullDownRefresh: function() {
    this.fetchPromises()
    wx.stopPullDownRefresh()
  }
})
