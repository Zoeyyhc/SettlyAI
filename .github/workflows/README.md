# GitHub Actions CI/CD 配置说明

## 概述

这个CI流程包含以下主要步骤：
1. **前端构建** - 使用pnpm构建React应用
2. **后端构建** - 编译.NET应用并构建Docker镜像
3. **安全扫描** - 使用Trivy进行漏洞扫描

## 需要配置的GitHub Secrets

### AWS相关配置

在GitHub仓库的Settings > Secrets and variables > Actions中添加以下secrets：

#### 1. AWS_ROLE_ARN
- **描述**: AWS IAM Role的ARN，用于GitHub Actions访问AWS服务
- **格式**: `arn:aws:iam::123456789012:role/github-actions-role`
- **权限要求**: 
  - ECR:GetAuthorizationToken
  - ECR:BatchCheckLayerAvailability
  - ECR:GetDownloadUrlForLayer
  - ECR:BatchGetImage
  - ECR:InitiateLayerUpload
  - ECR:UploadLayerPart
  - ECR:CompleteLayerUpload
  - ECR:PutImage

#### 2. AWS_REGION
- **描述**: AWS区域，如 `us-east-1`, `ap-southeast-1`
- **示例**: `ap-southeast-1`

#### 3. ECR_REPOSITORY_NAME
- **描述**: ECR仓库名称
- **示例**: `settly-backend`

## IAM Role配置示例

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage"
      ],
      "Resource": "*"
    }
  ]
}
```

## 工作流程

### 1. 前端作业
- 安装Node.js 22.x
- 设置pnpm
- 安装依赖
- 构建应用
- 缓存优化

### 2. 后端作业
- 安装.NET 8.0
- 编译应用
- 配置AWS凭据
- 登录ECR
- 构建Docker镜像
- 推送到ECR（包含commit-hash和latest标签）

### 3. 安全扫描
- 使用Trivy扫描代码
- 上传结果到GitHub Security tab

## 镜像标签策略

- **commit-hash**: 每次提交的唯一标识，如 `abc1234`
- **latest**: 最新版本标签

## 注意事项

1. **权限最小化**: IAM Role只包含必要的ECR权限
2. **缓存优化**: 使用pnpm store缓存加速依赖安装
3. **多阶段构建**: Dockerfile使用多阶段构建减小镜像大小
4. **生产环境**: 运行时使用ASP.NET Core运行时镜像，不包含SDK

## 故障排除

### 常见问题

1. **AWS权限错误**: 检查IAM Role权限是否完整
2. **ECR登录失败**: 确认AWS_REGION和ECR_REPOSITORY_NAME正确
3. **构建超时**: 检查Dockerfile是否优化，依赖是否过多
4. **推送失败**: 确认ECR仓库存在且有推送权限 

# edit iam role trust policy