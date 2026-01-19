# 一言为定 (Promise Mini) - 架构设计说明书

## 1. 技术架构概览

### 1.1 架构设计原则
- **基于腾讯小程序生态**：使用微信小程序云开发（CloudBase）一体化方案。
- **简化架构**：针对初期用户量（并发<100，总用户<10000），采用云开发简化部署。
- **云原生**：使用云函数、云数据库、云存储，无需独立服务器。
- **AI服务集成**（规划中）：计划接入AI能力，辅助用户生成承诺内容或进行智能提醒。

## 2. 数据模型 (Schema)

使用云数据库 (Cloud Database) 存储数据。

### 2.1 Users (用户表)
集合名称: `users`
```json
{
  "_id": "openid",             // 用户的唯一标识 (OpenID)
  "userInfo": {
    "nickName": "String",      // 昵称
    "avatarUrl": "String"      // 头像地址
  },
  "createdAt": "Date"          // 注册时间
}
```

### 2.2 Promises (承诺表)
集合名称: `promises`
```json
{
  "_id": "uuid",               // 承诺唯一ID
  "_openid": "creator_openid", // 创建者的 OpenID
  "title": "String",           // 承诺标题 (例如: "每天背10个单词")
  "content": "String",         // 承诺具体内容
  "status": "Number",          // 状态: 0=进行中, 1=已完成, 2=已放弃
  "deadline": "Date",          // 截止日期
  "createdAt": "Date",         // 创建时间
  "updatedAt": "Date"          // 更新时间
}
```

## 3. 云函数设计 (Cloud Functions)

业务逻辑运行在云端，保障安全。

- **login**: 用户登录，获取 OpenID。
- **createPromise**: 创建新的承诺。
- **getPromiseList**: 获取我的承诺列表。
- **updatePromise**: 更新承诺状态（完成/放弃）。

## 4. 目录结构
```
/workspace
  ├── cloudfunctions/        # 云函数代码
  │   ├── login/
  │   ├── createPromise/
  │   └── getPromiseList/
  ├── miniprogram/           # 小程序端代码
  │   ├── components/
  │   ├── pages/
  │   │   ├── index/         # 首页 (列表)
  │   │   └── create/        # 创建页
  │   ├── app.js
  │   └── envList.js         # 环境配置
  └── project.config.json
```
