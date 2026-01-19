const { envList } = require('../envList');

/**
 * 封装云函数调用
 * @param {string} name 云函数名称
 * @param {object} data 传递给云函数的参数
 */
export const callCloudFunction = async (name, data = {}) => {
  try {
    const res = await wx.cloud.callFunction({
      name,
      data,
    });

    const result = res.result;

    // 检查云函数内部定义的业务错误码
    if (result && result.code !== 0) {
      throw new Error(result.msg || `调用失败 code:${result.code}`);
    }

    return result.data;
  } catch (err) {
    console.error(`[CloudFunction] ${name} Failed:`, err);
    
    // 统一 UI 反馈
    wx.showToast({
      title: err.message || '系统繁忙，请稍后重试',
      icon: 'none',
      duration: 3000
    });

    // 重新抛出错误，以便调用方可以进行额外处理（如果需要）
    // 标记此步骤任务失败
    throw err;
  }
};
