# 一言为定 (Promise Mini) - 小程序项目文档

## 1. 项目简介
“一言为定”是一款帮助你记录承诺、约定的微信小程序。即使不懂代码，你也可以轻松拥有自己的承诺记录工具。

**核心功能**：
- **创建承诺**：记录下你想做的事情，设定截止时间。
- **承诺列表**：查看所有承诺的状态（进行中、已完成、已失效）。
- **承诺管理**：完成承诺后打卡，或者标记失败。

## 2. 部署指南 (小白必看)

如果你是第一次开发小程序，请严格按照以下步骤操作：

### 第一步：准备工作
1. 注册一个微信小程序账号（在 [微信公众平台](https://mp.weixin.qq.com/)）。
2. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。

### 第二步：导入项目
1. 打开微信开发者工具，选择“导入项目”。
2. 目录选择本项目的根目录 (`/workspace`)。
3. AppID 填入你注册的小程序 AppID。

### 第三步：开通云开发
1. 在开发者工具左上角点击“云开发”按钮，开通云服务（选择免费版即可）。
2. 获取你的**环境ID**（例如 `cloud1-xxxx`）。

### 第四步：配置环境
1. 打开文件 `miniprogram/envList.js`。
2. 将你的环境ID填入：
   ```javascript
   const envList = [{"envId":"你的环境ID","alias":"my-env"}]
   ```
3. 打开 `cloudfunctions/login/index.js`, `cloudfunctions/promiseCreate/index.js` 等所有云函数文件夹下的 `index.js`，确认初始化代码：
   ```javascript
   cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 这样写不需要手动改云函数里的环境ID
   ```

### 第五步：部署云函数 (关键！)
1. 在文件列表中找到 `cloudfunctions` 文件夹。
2. 依次右键点击 `login`、`promiseCreate`、`promiseGetList`、`promiseUpdateStatus` 四个文件夹。
3. 选择“上传并部署：云端安装依赖”。
4. 等待部署成功提示。

### 第六步：创建数据库集合
1. 打开“云开发”控制台 -> “数据库”。
2. 点击“+”号创建集合，名称必须填写为 `promises`。
3. 权限设置：选择“所有用户可读，仅创建者可读写”。

### 第七步：完成
点击开发者工具顶部的“编译”按钮，现在你可以尝试创建一个承诺了！

## 3. 技术架构
- **前端**：微信小程序原生代码
- **后端**：微信云开发 (无需购买服务器)
- **数据库**：云数据库 (自动扩容)

## 4. 目录结构
```
/workspace
  ├── cloudfunctions/        # 云函数 (后端逻辑)
  │   ├── login/             # 登录
  │   ├── promiseCreate/     # 创建承诺
  │   ├── promiseGetList/    # 获取列表
  │   └── promiseUpdateStatus/ # 更新状态
  ├── miniprogram/           # 小程序 (前端界面)
  │   ├── pages/
  │   │   ├── index/         # 首页(列表)
  │   │   ├── create/        # 创建页
  │   │   └── detail/        # 详情页
  │   └── app.js             # 入口
  └── project.config.json    # 配置文件
```

## 5. 功能更新日志
- **V1.0**: 基础功能上线，支持承诺的增删改查（创建、列表、详情、状态变更）。
