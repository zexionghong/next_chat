#!/bin/bash

# NextChat Docker 部署脚本
# 使用方法: ./deploy.sh [start|stop|restart|logs|build]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目名称
PROJECT_NAME="nextchat"

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 和 Docker Compose
check_dependencies() {
    log_info "检查依赖..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    
    log_success "依赖检查完成"
}

# 检查环境文件
check_env() {
    if [ ! -f ".env" ]; then
        log_warning ".env 文件不存在"
        if [ -f ".env.example" ]; then
            log_info "复制 .env.example 到 .env"
            cp .env.example .env
            log_warning "请编辑 .env 文件配置您的 API 密钥"
        else
            log_error "未找到 .env.example 文件"
            exit 1
        fi
    fi
}

# 构建镜像
build() {
    log_info "构建 Docker 镜像..."
    docker-compose build --no-cache
    log_success "镜像构建完成"
}

# 启动服务
start() {
    log_info "启动 NextChat 服务..."
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    if docker-compose ps | grep -q "Up"; then
        log_success "NextChat 服务启动成功！"
        log_info "访问地址: http://localhost:3000"
        log_info "查看日志: ./deploy.sh logs"
    else
        log_error "服务启动失败，请查看日志"
        docker-compose logs
        exit 1
    fi
}

# 停止服务
stop() {
    log_info "停止 NextChat 服务..."
    docker-compose down
    log_success "服务已停止"
}

# 重启服务
restart() {
    log_info "重启 NextChat 服务..."
    stop
    start
}

# 查看日志
logs() {
    log_info "查看服务日志..."
    docker-compose logs -f
}

# 清理
clean() {
    log_info "清理 Docker 资源..."
    docker-compose down -v --rmi all
    log_success "清理完成"
}

# 更新服务
update() {
    log_info "更新 NextChat 服务..."
    
    # 拉取最新代码（如果是 git 仓库）
    if [ -d ".git" ]; then
        log_info "拉取最新代码..."
        git pull
    fi
    
    # 重新构建并启动
    build
    restart
    
    log_success "更新完成"
}

# 显示状态
status() {
    log_info "服务状态:"
    docker-compose ps
}

# 显示帮助
help() {
    echo "NextChat Docker 部署脚本"
    echo ""
    echo "使用方法:"
    echo "  ./deploy.sh [命令]"
    echo ""
    echo "可用命令:"
    echo "  start     启动服务"
    echo "  stop      停止服务"
    echo "  restart   重启服务"
    echo "  build     构建镜像"
    echo "  logs      查看日志"
    echo "  status    查看状态"
    echo "  update    更新服务"
    echo "  clean     清理资源"
    echo "  help      显示帮助"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh start    # 启动服务"
    echo "  ./deploy.sh logs     # 查看日志"
}

# 主函数
main() {
    case "${1:-help}" in
        start)
            check_dependencies
            check_env
            start
            ;;
        stop)
            check_dependencies
            stop
            ;;
        restart)
            check_dependencies
            restart
            ;;
        build)
            check_dependencies
            build
            ;;
        logs)
            check_dependencies
            logs
            ;;
        status)
            check_dependencies
            status
            ;;
        update)
            check_dependencies
            update
            ;;
        clean)
            check_dependencies
            clean
            ;;
        help|--help|-h)
            help
            ;;
        *)
            log_error "未知命令: $1"
            help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
