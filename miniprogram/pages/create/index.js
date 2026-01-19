Page({
  data: {
    date: '',
    startDate: '',
    submitting: false
  },

  onLoad() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    this.setData({
      date: dateStr,
      startDate: dateStr
    });
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  onSubmit(e) {
    const { title, content } = e.detail.value;
    if (!title) {
      wx.showToast({ title: '请输入主题', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    wx.cloud.callFunction({
      name: 'promiseCreate',
      data: {
        title,
        content,
        deadline: this.data.date
      },
      success: res => {
        this.setData({ submitting: false });
        if (res.result.code === 0) {
          wx.showToast({ title: '创建成功' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({ title: '创建失败', icon: 'none' });
        }
      },
      fail: err => {
        this.setData({ submitting: false });
        wx.showToast({ title: '网络错误', icon: 'none' });
        console.error(err);
      }
    });
  }
});
