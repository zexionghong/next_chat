# NextChat Docker 部署指南

本指南将帮助您使用 Docker 和 Docker Compose 快速部署 NextChat 应用。

## 📋 前置要求

- Docker (版本 20.10 或更高)
- Docker Compose (版本 2.0 或更高)
- 至少 2GB 可用内存
- 至少 5GB 可用磁盘空间

## 🚀 快速开始

### 1. 克隆项目（如果还没有）

```bash
git clone https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web.git
cd ChatGPT-Next-Web
```

### 2. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置您的 API 密钥：

```bash
# 基础配置
CODE=your-access-password
OPENAI_API_KEY=sk-your-openai-api-key

# 其他 AI 服务配置（可选）
GOOGLE_API_KEY=your-google-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
# ... 更多配置请参考 .env.example
```

### 3. 使用部署脚本（推荐）

我们提供了一个便捷的部署脚本：

```bash
# 给脚本执行权限
chmod +x deploy.sh

# 启动服务
./deploy.sh start
```

### 4. 手动部署

如果您不想使用脚本，也可以手动执行：

```bash
# 构建并启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 📖 部署脚本使用说明

部署脚本 `deploy.sh` 提供了以下命令：

```bash
./deploy.sh start     # 启动服务
./deploy.sh stop      # 停止服务
./deploy.sh restart   # 重启服务
./deploy.sh build     # 重新构建镜像
./deploy.sh logs      # 查看实时日志
./deploy.sh status    # 查看服务状态
./deploy.sh update    # 更新服务（拉取代码+重建+重启）
./deploy.sh clean     # 清理所有 Docker 资源
./deploy.sh help      # 显示帮助信息
```

## 🔧 配置说明

### 端口配置

默认情况下，应用将在 `http://localhost:3000` 上运行。如需修改端口，请编辑 `docker-compose.yml` 文件：

```yaml
services:
  nextchat:
    ports:
      - "8080:3000"  # 将本地 8080 端口映射到容器 3000 端口
```

### 环境变量

主要环境变量说明：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `CODE` | 访问密码 | `your-password` |
| `OPENAI_API_KEY` | OpenAI API 密钥 | `sk-xxx` |
| `BASE_URL` | 自定义 API 基础 URL | `https://api.openai.com` |
| `GOOGLE_API_KEY` | Google AI API 密钥 | `AIxxx` |
| `ANTHROPIC_API_KEY` | Anthropic API 密钥 | `sk-ant-xxx` |

更多环境变量请参考 `.env.example` 文件。

### 数据持久化

应用数据将保存在 Docker 卷 `nextchat_data` 中，即使容器重启也不会丢失。

## 🔍 故障排除

### 查看日志

```bash
# 查看所有服务日志
./deploy.sh logs

# 或者手动查看
docker-compose logs -f
```

### 重新构建镜像

如果遇到问题，可以尝试重新构建镜像：

```bash
./deploy.sh build
./deploy.sh restart
```

### 完全重置

如果需要完全重置（会删除所有数据）：

```bash
./deploy.sh clean
./deploy.sh start
```

### 常见问题

1. **端口被占用**
   - 修改 `docker-compose.yml` 中的端口映射
   - 或者停止占用端口的其他服务

2. **内存不足**
   - 确保系统有足够的可用内存
   - 可以尝试关闭其他不必要的应用

3. **构建失败**
   - 检查网络连接
   - 尝试使用国内镜像源

## 🔄 更新应用

### 自动更新

```bash
./deploy.sh update
```

### 手动更新

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose build --no-cache
docker-compose up -d
```

## 🛡️ 安全建议

1. **设置访问密码**：在 `.env` 文件中设置 `CODE` 变量
2. **使用 HTTPS**：在生产环境中建议使用反向代理（如 Nginx）配置 HTTPS
3. **限制访问**：可以通过防火墙或网络策略限制访问来源
4. **定期更新**：定期更新应用和 Docker 镜像

## 📊 监控和维护

### 健康检查

应用包含内置的健康检查，可以通过以下方式查看：

```bash
# 查看容器健康状态
docker-compose ps

# 手动健康检查
curl http://localhost:3000/api/health
```

### 资源监控

```bash
# 查看容器资源使用情况
docker stats

# 查看磁盘使用情况
docker system df
```

## 🆘 获取帮助

如果遇到问题，可以：

1. 查看项目的 [GitHub Issues](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues)
2. 参考官方文档
3. 在社区论坛寻求帮助

## 📝 许可证

本项目遵循 MIT 许可证。
