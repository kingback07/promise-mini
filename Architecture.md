# 一言为定 (Promise Mini) - 架构设计说明书

## 1. 设计原则
- **极简主义**：初期仅实现核心闭环功能，不堆砌功能。
- **云原生**：完全依赖微信云开发能力，不引入第三方后端服务，降低运维成本。
- **模块化**：前端组件化，后端函数化，保持代码低耦合。

## 2. 数据模型 (Schema)
使用云数据库 (JSON Document) 存储数据。

### 2.1 Users (用户表)
```json
{
  "_id": "openid",
  "userInfo": {
    "nickName": "String",
    "avatarUrl": "String"
  },
  "createdAt": "Date"
}
```

### 2.2 Promises (承诺表)
```json
{
  "_id": "uuid",
  "_openid": "creator_openid", // 创建者
  "title": "String", // 承诺主题
  "content": "String", // 承诺详情
  "status": "Number", // 0: 进行中, 1: 已完成, 2: 已失效
  "deadline": "Date", // 截止时间
  "images": ["String"], // 图片凭证 fileID
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 3. 云函数设计
所有业务逻辑收归云函数，小程序端只负责展示和简单交互。

- `login`: 用户登录与信息同步
- `promiseCreate`: 创建新承诺
- `promiseGetList`: 获取承诺列表
- `promiseUpdateStatus`: 更新承诺状态

## 4. 异常处理
- **全局错误捕获**：在 `app.js` 中捕获全局异常。
- **云函数错误**：统一返回格式 `{ code: 0, msg: 'success', data: ... }`，异常时 `code` 非 0。
