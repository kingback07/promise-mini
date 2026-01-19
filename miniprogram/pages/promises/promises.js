// miniprogram/pages/promises/promises.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 'ongoing', // ongoing, completed, expired
    list: [],
    loading: false,
    statusMap: {
      0: '进行中',
      1: '已完成',
      2: '已失效'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 每次显示页面时刷新列表，确保数据最新
    // 可以优化为只在需要时刷新
    this.fetchList();
  },

  /**
   * 切换 Tab
   */
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.currentTab) return;

    this.setData({
      currentTab: tab,
      list: [] // 清空列表，避免显示旧数据
    });

    this.fetchList();
  },

  /**
   * 获取承诺列表
   */
  fetchList: function() {
    this.setData({ loading: true });

    const statusMap = {
      'ongoing': 0,
      'completed': 1,
      'expired': 2
    };

    const status = statusMap[this.data.currentTab];

    // Return the promise so onPullDownRefresh can wait for it
    return wx.cloud.callFunction({
      name: 'promiseGetList',
      data: {
        status: status
      }
    }).then(res => {
      // 处理返回的数据
      const result = res.result;
      if (result && result.code === 0) {
        const formattedList = (result.data || []).map(item => {
          return {
            ...item,
            deadlineFormatted: this.formatDate(new Date(item.deadline))
          };
        });
        
        this.setData({
          list: formattedList,
          loading: false
        });
      } else {
        console.error('获取列表失败', result);
        this.setData({ loading: false });
        // 如果是开发环境且没部署云函数，可以使用 Mock 数据
        // this.mockData(status); 
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('云函数调用失败', err);
      this.setData({ loading: false });
      
      // 容错处理：如果云函数不存在，展示 Mock 数据方便演示
      // 注意：实际发布时应移除
      // this.mockData(status);
      
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    });
  },

  /**
   * 简单的日期格式化
   */
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * 跳转到详情页
   */
  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/promise-detail/promise-detail?id=${id}`,
      fail: () => {
        wx.showToast({
          title: '详情页暂未开发',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 跳转到创建页
   */
  goToCreate: function() {
    wx.navigateTo({
      url: '/pages/promise-create/promise-create',
      fail: () => {
        wx.showToast({
          title: '创建页暂未开发',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.fetchList().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
