Page({
  data: {
    title: '',
    content: '',
    deadline: '',
    today: '',
    submitting: false
  },

  onLoad: function() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    this.setData({
      today: todayStr
    });
  },

  onTitleInput: function(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput: function(e) {
    this.setData({ content: e.detail.value });
  },

  onDateChange: function(e) {
    this.setData({ deadline: e.detail.value });
  },

  submitPromise: function() {
    if (!this.data.title) {
      wx.showToast({ title: '请填写承诺标题', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    wx.cloud.callFunction({
      name: 'createPromise',
      data: {
        title: this.data.title,
        content: this.data.content,
        deadline: this.data.deadline
      }
    }).then(res => {
      this.setData({ submitting: false });
      if (res.result.code === 0) {
        wx.showToast({ title: '承诺已许下', icon: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({ title: '创建失败', icon: 'none' });
      }
    }).catch(err => {
      console.error(err);
      this.setData({ submitting: false });
      wx.showToast({ title: '网络错误', icon: 'none' });
    });
  }
});
