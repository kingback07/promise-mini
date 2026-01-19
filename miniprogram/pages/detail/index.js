Page({
  data: {
    detail: {},
    statusMap: {
      0: '进行中',
      1: '已完成',
      2: '已失效'
    }
  },

  onLoad() {
    const detail = wx.getStorageSync('currentPromise');
    if (detail) {
        if (detail.createdAt) {
            detail.createdAtFormat = new Date(detail.createdAt).toLocaleDateString();
        }
        this.setData({ detail });
    }
  },

  updateStatus(e) {
    const status = parseInt(e.currentTarget.dataset.status);
    const id = this.data.detail._id;

    wx.showModal({
      title: '提示',
      content: status === 1 ? '确认已完成该承诺？' : '确认该承诺已失效？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '更新中' });
          wx.cloud.callFunction({
            name: 'promiseUpdateStatus',
            data: { id, status },
            success: res => {
              wx.hideLoading();
              if (res.result.code === 0) {
                wx.showToast({ title: '更新成功' });
                const detail = this.data.detail;
                detail.status = status;
                this.setData({ detail });
                // Update previous page list
                const pages = getCurrentPages();
                const prevPage = pages[pages.length - 2];
                if (prevPage) {
                   prevPage.getList();
                }
              } else {
                wx.showToast({ title: '更新失败', icon: 'none' });
              }
            },
            fail: err => {
              wx.hideLoading();
              wx.showToast({ title: '网络错误', icon: 'none' });
            }
          });
        }
      }
    });
  }
});
