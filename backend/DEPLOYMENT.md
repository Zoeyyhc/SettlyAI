# Backend 部署指南

## 概述
本指南说明如何将 Settly API 部署到 EC2 实例并连接到 RDS 数据库。

## 前提条件
1. EC2 实例已安装 Docker
2. EC2 实例已安装 SSM Agent 并配置适当的 IAM 权限
3. EC2 实例的 IAM 角色包含以下权限：
   - `AmazonSSMManagedInstanceCore` (用于SSM连接)
   - `AmazonEC2ContainerRegistryReadOnly` (用于拉取ECR镜像)
4. RDS 数据库已创建并配置
5. ECR 仓库已创建

## IAM 角色配置

### EC2 实例 IAM 角色
EC2 实例需要以下 IAM 角色权限：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:UpdateInstanceInformation",
        "ssm:SendCommand",
        "ssm:GetCommandInvocation"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    }
  ]
}
```

或者直接附加以下托管策略：
- `AmazonSSMManagedInstanceCore`
- `AmazonEC2ContainerRegistryReadOnly`

### GitHub Actions IAM 角色
GitHub Actions 需要以下权限：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:SendCommand",
        "ssm:DescribeInstanceInformation",
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    }
  ]
}
```

## 环境变量配置
在 EC2 上创建 `.env` 文件：

```bash
# ECR 配置
ECR_REGISTRY=123456789012.dkr.ecr.us-east-1.amazonaws.com
ECR_REPOSITORY=settly-api
AWS_REGION=us-east-1

# RDS 数据库连接字符串
RDS_CONNECTION_STRING=Host=your-rds-endpoint.region.rds.amazonaws.com;Port=5432;Database=your_database_name;User Id=your_username;Password=your_password;Include Error Detail=true

Host=my-settly-ai-db.cbo88qok427h.ap-southeast-2.rds.amazonaws.com;Port=5432;Database=settlyai;User Id=settlyai_admin;Password=SettlyAI2024!Secure;Include Error Detail=true

# 应用配置
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:5100
```

## 部署方式

### 方式 1: 使用 GitHub Actions (推荐)
1. 配置 GitHub Secrets:
   - `EC2_INSTANCE_ID`: EC2 实例的实例ID (例如: i-1234567890abcdef0)
   - `RDS_CONNECTION_STRING`: RDS 连接字符串
   - `AWS_ROLE_ARN`: AWS IAM 角色 ARN (用于GitHub Actions)
   - `AWS_REGION`: AWS 区域
   - `ECR_REPOSITORY_NAME`: ECR 仓库名称

2. 推送代码到 main 分支，CI 完成后会自动触发 CD

### 方式 2: 手动部署
1. 在 EC2 上运行部署脚本：
```bash
chmod +x deploy.sh
source .env
./deploy.sh
```

### 方式 3: 使用 Docker Compose
```bash
source .env
docker-compose -f docker-compose.prod.yml up -d
```

## 验证部署
```bash
# 检查容器状态
docker ps

# 查看日志
docker logs settly-api

# 测试健康检查
curl http://localhost:5100/health
```

## 故障排除
1. 检查容器日志: `docker logs settly-api`
2. 检查网络连接: `docker exec settly-api ping your-rds-endpoint`
3. 检查环境变量: `docker exec settly-api env | grep ApiConfigs`

## 回滚
如果需要回滚到之前的版本：
```bash
docker pull ${ECR_REGISTRY}/${ECR_REPOSITORY}:${PREVIOUS_TAG}
docker stop settly-api
docker rm settly-api
docker run -d --name settly-api [其他参数] ${ECR_REGISTRY}/${ECR_REPOSITORY}:${PREVIOUS_TAG}
``` 