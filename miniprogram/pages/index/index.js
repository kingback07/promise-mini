Page({
  data: {
    promises: [],
    loading: true
  },

  onShow: function() {
    this.fetchPromises();
  },

  fetchPromises: function() {
    this.setData({ loading: true });
    
    wx.cloud.callFunction({
      name: 'getPromiseList',
      data: {}
    }).then(res => {
      const result = res.result;
      if (result.code === 0) {
        const promises = result.data.map(item => {
          // Format date and status
          item.formattedDeadline = item.deadline ? new Date(item.deadline).toLocaleDateString() : '';
          const statusMap = {0: '进行中', 1: '已完成', 2: '已放弃'};
          item.statusText = statusMap[item.status] || '未知';
          return item;
        });
        this.setData({
          promises: promises,
          loading: false
        });
      } else {
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        });
        this.setData({ loading: false });
      }
    }).catch(err => {
      console.error(err);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
      this.setData({ loading: false });
    });
  },

  goToCreate: function() {
    wx.navigateTo({
      url: '/pages/create/create',
    });
  }
});
