#!/bin/bash

# 部署脚本 - 在EC2上运行
# 支持两种部署方式：
# 1. 直接在EC2上运行 (需要配置AWS CLI)
# 2. 通过SSM从外部调用 (推荐)

set -e

# 环境变量
ECR_REGISTRY=${ECR_REGISTRY}
ECR_REPOSITORY=${ECR_REPOSITORY}
RDS_CONNECTION_STRING=${RDS_CONNECTION_STRING}
AWS_REGION=${AWS_REGION:-us-east-1}

echo "开始部署 Settly API..."


if [ -n "$SSM_COMMAND_ID" ]; then
    echo "通过SSM执行部署命令..."
fi


echo "停止现有容器..."
docker stop settly-api || true
docker rm settly-api || true

echo "拉取最新镜像..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
docker pull ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest

echo "启动新容器..."
docker run -d \
  --name settly-api \
  --restart unless-stopped \
  -p 5100:5100 \
  -e ApiConfigs__DBConnection="${RDS_CONNECTION_STRING}" \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ASPNETCORE_URLS=http://0.0.0.0:5100 \
  ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest

# 等待服务启动
echo "等待服务启动..."
sleep 10

# 检查服务状态
if docker ps | grep -q settly-api; then
    echo "✅ 部署成功！"
    echo "容器状态:"
    docker ps | grep settly-api
else
    echo "❌ 部署失败！"
    docker logs settly-api
    exit 1
fi

# 清理未使用的镜像
echo "清理未使用的镜像..."
docker image prune -f

echo "部署完成！" 