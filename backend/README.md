# Backend: Next Serverless API

用于 Vercel 部署的 Next.js serverless 接口层。当前使用内存 mock repository，`data/sql` 提供正式数据库初始化设计。

## 目录

- `app/api/profiles`：档案列表、新建/编辑接口
- `app/api/profiles/[id]`：档案详情聚合接口
- `app/api/clues`：线索确认保存接口
- `app/api/ai/parse-clue`：AI 线索解析接口 mock
- `data/sql`：初始化 SQL 和示例数据
- `data/mock`：本地 mock 数据
- `lib`：类型、mock db、AI 解析

## 多用户隔离

所有业务表均包含 `user_id`。serverless 接口通过 `x-user-id` header 获取当前用户；未提供时使用 `demo-user`。
