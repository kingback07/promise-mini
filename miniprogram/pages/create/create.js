Page({
  data: {
    deadline: '',
    minDate: '',
    submitting: false
  },

  onLoad: function (options) {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    this.setData({
      minDate: this.formatDate(today),
      deadline: this.formatDate(nextWeek)
    });
  },

  formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  onDateChange: function(e) {
    this.setData({
      deadline: e.detail.value
    })
  },

  onSubmit: function(e) {
    const { title, content } = e.detail.value;
    
    if (!title) {
      wx.showToast({ title: '请输入主题', icon: 'none' });
      return;
    }
    if (!content) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    wx.cloud.callFunction({
      name: 'promiseCreate',
      data: {
        title,
        content,
        deadline: this.data.deadline
      },
      success: res => {
        this.setData({ submitting: false });
        if (res.result && res.result.code === 0) {
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({
            title: '创建失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error(err);
        this.setData({ submitting: false });
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  }
})
