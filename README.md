# 跨境AI圈 (KJAI)

跨境出海行业的一站式 AI 赋能平台，基于 Next.js 15+ 构建，面向 Vercel 部署优化。

## 功能模块

- **AI 导航** (`/directory`) — 多级分类、外链跳转、Aff 追踪、24h 热度榜
- **工具商店** (`/hub`) — 厂商上架、优惠码、详情页
- **服务市场** (`/marketplace`) — 信息撮合、联系方式锁定
- **论坛** (`/community`) — 发帖回帖、标签分类
- **资讯** (`/media`) — 快讯与 VIP 付费墙
- **活动** (`/events`) — 第三方票务 / 站内报名

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 16 + React 19 + Tailwind CSS 4 |
| 部署 | Vercel (ISR + Edge Middleware) |
| 数据库 | Neon PostgreSQL + Drizzle ORM |
| 缓存 | Upstash Redis |
| 认证 | Auth.js (NextAuth v5) + JWT |

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入 DATABASE_URL、AUTH_SECRET 等

# 3. 推送数据库 Schema 并初始化数据
npm run db:push
npm run db:seed   # 创建管理员 admin@kjai.com / admin123456

# 4. 启动开发服务器
npm run dev
```

> 未配置 `DATABASE_URL` 时，站点会使用内置 Demo 数据正常运行，便于快速预览 UI。

## 部署到 Vercel

1. 将仓库推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量：
   - `DATABASE_URL` — [Neon](https://neon.tech) 连接串
   - `AUTH_SECRET` — 随机密钥
   - `NEXTAUTH_URL` — 生产域名（如 `https://your-domain.vercel.app`）
   - `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — [Upstash](https://upstash.com)
   - `CRON_SECRET` — Vercel Cron 鉴权
4. 部署完成后执行 `npm run db:push` 初始化数据库

## 用户角色

| 角色 | 权益 |
|------|------|
| 普通用户 | 每日 3 次查看联系方式、论坛发帖 |
| VIP | 无限查看联系方式、解锁付费文章 |
| 厂商/服务商 | 商户工作台、提交 AI 工具审核 |
| 管理员 | 审核工具、刷新 ISR 缓存、死链监控 |

## 项目结构

```
app/                  # Next.js App Router 页面与 API
components/           # UI 组件与布局
drizzle/              # 数据库 Schema
lib/                  # 工具函数、Auth、Redis、数据层
middleware.ts         # Edge 鉴权
vercel.json           # Cron 定时任务
```
