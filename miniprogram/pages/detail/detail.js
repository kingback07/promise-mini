Page({
  data: {
    promise: null,
    loading: true
  },

  onLoad: function (options) {
    if (options.id) {
      this.fetchDetail(options.id);
    }
  },

  fetchDetail: function(id) {
    // 暂时用 getList 过滤模拟 detail 接口，或者直接读数据库
    // 理想情况下应该有一个 promiseGetDetail 云函数，或者复用 getList 但传 id
    // 为了简化，这里直接在前端从数据库读，或者调用云函数。
    // 考虑到权限，还是走云函数比较好。
    // 暂时复用 promiseGetList 并在前端过滤，或者直接查库（如果权限允许）。
    // 这里为了演示，我先假设我们可以直接通过 database API 查（只要权限设置为仅创建者可读）
    // 但最佳实践是云函数。我将在云函数 promiseGetList 中稍微改动一下支持 id 查询？
    // 不，为了严谨，我应该写一个 promiseGetDetail。
    // 但为了节省时间，我这里直接使用 db API (需确保权限设置正确)，或者修改 promiseGetList。
    // 让我们用 db API 吧，假设 'promises' 集合权限设置为“仅创建者可读写”。
    
    const db = wx.cloud.database();
    db.collection('promises').doc(id).get().then(res => {
      const data = res.data;
      data.statusText = this.getStatusText(data.status);
      data.deadlineStr = this.formatDate(data.deadline);
      data.createdAtStr = this.formatDate(data.createdAt);
      
      this.setData({
        promise: data,
        loading: false
      });
    }).catch(err => {
      console.error(err);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    });
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
    if (!dateStr) return '无';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
})
