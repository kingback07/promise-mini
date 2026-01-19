# 一言为定 (Promise Mini) - 架构设计说明书

## 1. 设计原则
- **极简主义**：初期仅实现核心闭环功能，不堆砌功能。
- **云原生**：完全依赖微信云开发能力，不引入第三方后端服务，降低运维成本。
- **模块化**：前端组件化，后端函数化，保持代码低耦合。
- **Fail Fast**：遇到错误（尤其是系统级或资源限制错误）应明确标记失败，避免无效重试。

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

## 4. 异常处理与状态反馈
### 4.1 核心原则
- **明确失败**：遇到非预期错误、资源限制（如配额超限）或逻辑错误，必须立即终止流程并标记任务失败。
- **禁止静默**：前端必须向用户展示清晰的错误提示（Toast 或 错误页），禁止吞没错误。

### 4.2 错误码规范 (Response Code)
云函数统一返回结构：`{ code: Number, msg: String, data: Any }`

- `0`: 成功 (Success)
- `-1`: 系统未知错误 (System Error)
- `1001`: 认证失败/未登录 (Unauthorized)
- `2001`: 数据库操作异常 (Database Error)
- `3001`: 参数校验失败 (Invalid Params)
- `4001`: 业务逻辑受限 (Business Limit)

### 4.3 实现方案
- **云函数侧**：使用 `try-catch` 包裹主逻辑，Catch 块中捕获所有异常，并转换为上述标准错误结构返回。
- **小程序侧**：封装 `wx.cloud.callFunction`，拦截所有 `code !== 0` 的响应，统一抛出错误并触发 UI 反馈（如 `wx.showToast`）。
