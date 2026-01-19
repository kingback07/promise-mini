// index.js
const app = getApp()

Page({
  data: {
    promiseList: [],
    loading: true
  },

  onLoad: function() {
    // 页面加载逻辑
  },

  onShow: function() {
    this.fetchPromiseList()
  },

  fetchPromiseList: function() {
    this.setData({ loading: true })
    wx.cloud.callFunction({
      name: 'promiseGetList',
      success: res => {
        if (res.result && res.result.data) {
          const list = res.result.data.map(item => {
            return {
              ...item,
              statusText: this.getStatusText(item.status),
              deadlineStr: this.formatDate(item.deadline)
            }
          })
          this.setData({
            promiseList: list,
            loading: false
          })
        } else {
          this.setData({ loading: false })
        }
      },
      fail: err => {
        console.error('failed to get promise list', err)
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
        this.setData({ loading: false })
      }
    })
  },

  getStatusText: function(status) {
    switch(status) {
      case 0: return '进行中';
      case 1: return '已完成';
      case 2: return '已失效';
      default: return '未知';
    }
  },

  formatDate: function(dateStr) {
    if (!dateStr) return '无截止日期';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  goToCreate: function() {
    wx.navigateTo({
      url: '/pages/create/create',
    })
  },

  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  }
})
