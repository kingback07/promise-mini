Page({
  data: {
    currentTab: -1, // -1: All, 0: Ongoing, 1: Completed, 2: Failed
    list: [],
    statusMap: {
      0: '进行中',
      1: '已完成',
      2: '已失效'
    }
  },

  onShow() {
    this.getList();
  },

  switchTab(e) {
    const status = parseInt(e.currentTarget.dataset.status);
    this.setData({ currentTab: status });
    this.getList();
  },

  getList() {
    wx.showLoading({ title: '加载中...' });
    const params = {};
    if (this.data.currentTab !== -1) {
      params.status = this.data.currentTab;
    }

    wx.cloud.callFunction({
      name: 'promiseGetList',
      data: params,
      success: res => {
        wx.hideLoading();
        if (res.result.code === 0) {
          const list = res.result.data.map(item => {
            item.deadlineFormat = new Date(item.deadline).toLocaleDateString();
            return item;
          });
          this.setData({ list });
        } else {
          wx.showToast({ title: '加载失败', icon: 'none' });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
        console.error(err);
      }
    });
  },

  goToCreate() {
    wx.navigateTo({ url: '/pages/create/index' });
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.list.find(i => i._id === id);
    wx.setStorageSync('currentPromise', item);
    wx.navigateTo({ url: '/pages/detail/index' });
  }
});
