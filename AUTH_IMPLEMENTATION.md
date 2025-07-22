# 认证系统实现说明

## 概述

本系统实现了基于 localStorage 的认证检查机制，当页面刷新或打开时会自动检查认证状态，如果认证无效则重定向到指定的认证页面。

## 实现的功能

1. **页面加载时认证检查**：应用启动时自动检查 localStorage 中的认证数据
2. **页面可见性变化检查**：当用户切换标签页回到应用时重新检查认证
3. **API Key 集成**：从认证数据中提取 API Key 并集成到现有的访问控制系统
4. **测试页面**：提供测试界面用于验证认证逻辑

## 配置

### 环境变量

在 `.env` 文件中添加重定向 URL：

```env
NEXT_PUBLIC_AUTH_REDIRECT_URL=https://tools-dev.718ai.cn
```

## 认证数据格式

系统期望在 localStorage 中找到 key 为 `share_code_auth` 的数据，格式如下：

```json
{
  "code": "bdee11f7e7bd1fa6d8aac788e09a8e21",
  "to": "/chat",
  "config": {
    "data": {
      "id": "23c8ba98-4a4e-49d9-bdbc-325d41b6bf87",
      "name": "333",
      "description": "333",
      "type": "Communication",
      "config": {},
      "usage_count": 0,
      "created_at": "2025-07-22T02:43:49.930588Z",
      "updated_at": "2025-07-22T12:51:02.390154Z",
      "api_key_info": {
        "id": 3,
        "name": "FastAccess413",
        "value": "ak_xxxxxxxxxxxx",
        "provider_name": "",
        "status": "active"
      },
      "model_info": {
        "id": 91,
        "name": "gpt-4.1",
        "provider_name": "",
        "type": ""
      },
      "tool_info": {
        "id": "chatbot",
        "name": "AI Chatbot",
        "description": "Create intelligent conversational AI",
        "category": "Communication",
        "icon": "solar:chat-round-bold-duotone",
        "color": "#45B7D1",
        "path": null
      }
    },
    "message": "Tool instance retrieved successfully",
    "success": true
  },
  "timestamp": 1753188845466
}
```

## 核心文件

### 1. `app/utils/auth-check.ts`
认证检查的核心逻辑，包含以下函数：
- `hasValidAuth()`: 检查认证是否有效
- `getApiKeyFromAuth()`: 从认证数据中获取 API Key
- `checkAuthAndRedirect()`: 检查认证并在无效时重定向

### 2. `app/components/home.tsx`
主应用组件，在 `useEffect` 中添加了认证检查逻辑

### 3. `app/store/access.ts`
访问控制存储，集成了从认证数据中获取 API Key 的逻辑

## 测试

### 测试页面
访问 `/auth-test` 路径可以打开测试页面，该页面提供：
- 查看当前认证状态
- 生成测试数据
- 保存/清除认证数据
- 验证认证逻辑

### 测试步骤
1. 启动应用：`npm run dev` 或 `yarn dev`
2. 访问 `http://localhost:3000/auth-test`
3. 点击 "Generate Test Data" 生成测试数据
4. 点击 "Save Test Data" 保存到 localStorage
5. 点击 "Refresh Status" 查看认证状态
6. 点击 "Clear Data" 清除数据（应该触发重定向逻辑）

## 工作流程

1. **应用启动**：
   - Home 组件的 useEffect 执行
   - 调用 `checkAuthAndRedirect()`
   - 检查 localStorage 中的 `share_code_auth`
   - 验证 `api_key_info.value` 是否存在且有效
   - 如果无效，重定向到配置的 URL

2. **页面可见性变化**：
   - 监听 `visibilitychange` 事件
   - 当页面变为可见时重新检查认证

3. **API Key 使用**：
   - 访问控制系统优先使用认证数据中的 API Key
   - 如果认证数据中没有 API Key，回退到用户设置的自定义 API Key

## 注意事项

1. 测试页面 (`/auth-test`) 会跳过认证检查，以便进行测试
2. 认证检查只在客户端进行，不影响服务端渲染
3. 重定向 URL 必须使用 `NEXT_PUBLIC_` 前缀才能在客户端访问
4. 系统会在控制台输出认证检查的日志信息，便于调试

## 扩展功能

可以根据需要添加以下功能：
- 认证数据过期检查（基于 timestamp）
- 认证失败重试机制
- 认证状态变化的事件通知
- 更复杂的认证数据验证逻辑
