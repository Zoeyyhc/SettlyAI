# GitHub Actions CI/CD 配置说明

## 概述

这个项目包含完整的 CI/CD 流程，分为两个主要工作流：

### CI 流程 (持续集成)
1. **前端构建** - 使用 pnpm 构建 React 应用
2. **后端构建** - 编译 .NET 应用并构建 Docker 镜像

### CD 流程 (持续部署)
1. **数据库检查** - 检测是否为首次部署
2. **数据库初始化** - 首次部署时执行迁移和种子数据
3. **应用部署** - 部署到 EC2 实例
4. **数据库更新** - 后续部署时更新数据库架构

## 工作流触发条件

- **CI**: 每次推送到任何分支时触发
- **CD**: 仅在 CI 成功完成且推送到 `main` 分支时触发

## 需要配置的 GitHub Secrets

### AWS 相关配置

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下 secrets：

#### 1. AWS_ROLE_ARN
- **描述**: AWS IAM Role 的 ARN，用于 GitHub Actions 访问 AWS 服务
- **格式**: `arn:aws:iam::123456789012:role/github-actions-role`
- **权限要求**: 
  - ECR: 镜像推送和拉取权限
  - SSM: 执行命令权限
  - STS: 身份验证权限

#### 2. AWS_REGION
- **描述**: AWS 区域
- **示例**: `ap-southeast-1`, `us-east-1`

#### 3. ECR_REPOSITORY_NAME
- **描述**: ECR 仓库名称
- **示例**: `settly-backend`

#### 4. EC2_INSTANCE_ID
- **描述**: 目标 EC2 实例 ID
- **格式**: `i-1234567890abcdef0`

#### 5. RDS_CONNECTION_STRING
- **描述**: PostgreSQL 数据库连接字符串
- **格式**: `Host=your-rds-endpoint;Port=5432;Database=settly;User Id=username;Password=password;Include Error Detail=true`


## 工作流程详解

### CI 流程

#### 1. 前端作业
- 安装 Node.js 22.x
- 设置 pnpm
- 安装依赖
- 构建应用
- 缓存优化

#### 2. 后端作业
- 安装 .NET 8.0
- 编译应用
- 配置 AWS 凭据
- 登录 ECR
- 构建 Docker 镜像
- 推送到 ECR（包含 commit-hash 和 latest 标签）


### CD 流程

#### 1. 数据库检查
- 使用 `dotnet ef database update --dry-run` 检查数据库是否存在
- 设置 `first_deployment` 输出变量

#### 2. 数据库初始化（首次部署）
- **数据库迁移**: 创建数据库结构
- **数据种子**: 填充初始数据
- 使用临时容器执行，避免影响主应用

#### 3. 应用部署
- 停止旧容器
- 拉取最新镜像
- 启动新容器
- 配置环境变量

#### 4. 数据库更新（后续部署）
- 在运行中的容器内更新数据库架构
- 不重复种子数据

## 数据库管理策略

### 首次部署
```bash
# 1. 数据库迁移
docker run --rm -e ApiConfigs__DBConnection="..." image:latest \
  dotnet ef database update --startup-project /app/SettlyApi --project /app/SettlyModels

# 2. 数据种子
docker run --rm -e ApiConfigs__DBConnection="..." image:latest \
  bash -c "cd /app/SettlyDbManager && dotnet run -- --seed"
```

### 后续部署
```bash
# 在运行中的容器内更新架构
docker exec settly-api dotnet ef database update --startup-project /app/SettlyApi --project /app/SettlyModels
```

## 镜像标签策略

- **commit-hash**: 每次提交的唯一标识，如 `abc1234`
- **latest**: 最新版本标签

## 环境要求

### EC2 实例
- 安装 Docker
- 安装 AWS CLI
- 配置 SSM Agent
- 配置适当的 IAM 角色

### RDS 数据库
- PostgreSQL 实例
- 配置安全组允许 EC2 访问
- 创建数据库和用户

## 故障排除

### 常见问题

#### CI 相关问题
1. **AWS 权限错误**: 检查 IAM Role 权限是否完整
2. **ECR 登录失败**: 确认 AWS_REGION 和 ECR_REPOSITORY_NAME 正确
3. **构建超时**: 检查 Dockerfile 是否优化，依赖是否过多
4. **推送失败**: 确认 ECR 仓库存在且有推送权限

#### CD 相关问题
1. **SSM 命令失败**: 检查 EC2 实例是否安装了 SSM Agent
2. **数据库连接失败**: 验证 RDS_CONNECTION_STRING 格式和网络连接
3. **迁移失败**: 检查数据库权限和迁移文件
4. **容器启动失败**: 检查环境变量和端口配置

### 调试步骤

1. **检查 SSM 命令执行**:
   ```bash
   aws ssm describe-instance-information --region your-region
   ```

2. **查看容器日志**:
   ```bash
   docker logs settly-api
   ```

3. **验证数据库连接**:
   ```bash
   docker exec settly-api dotnet ef database update --dry-run
   ```

