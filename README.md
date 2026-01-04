# Keyzen Course API

Keyzen 课程商店 API - 基于 Cloudflare Workers 的课程数据服务

## 项目结构

```
keyzen-course/
├── src/
│   └── index.ts           # Worker API 实现
├── data/
│   ├── metadata.json      # 课程列表元数据
│   └── lessons/           # 课程内容文件（.ron 格式）
│       ├── 1001.ron
│       ├── 1002.ron
│       └── 1003.ron
├── wrangler.toml          # Cloudflare Workers 配置
├── package.json
├── tsconfig.json
└── README.md
```

## API 端点

### 1. 获取课程列表

```bash
GET https://keyzen.pingfury.top/api/lessons
```

**响应示例：**
```json
{
  "lessons": [
    {
      "id": 1001,
      "title": "基础练习 - ASDF JKL;",
      "description": "练习键盘中排基础按键，掌握正确的手指位置",
      "author": "pingfury",
      "difficulty": "初级",
      "download_url": "https://keyzen.pingfury.top/api/lessons/1001",
      "version": "1.0.0",
      "tags": ["基础", "中排键"]
    }
  ]
}
```

### 2. 获取课程内容

```bash
GET https://keyzen.pingfury.top/api/lessons/:id
```

**示例：**
```bash
curl https://keyzen.pingfury.top/api/lessons/1001
```

**响应：** 返回 `.ron` 格式的课程内容文件

## 本地开发

### 1. 安装依赖

```bash
pnpm install
```

需要安装的依赖：
- `wrangler` - Cloudflare Workers CLI
- `typescript` - TypeScript 编译器
- `@cloudflare/workers-types` - Workers 类型定义

### 2. 本地运行

```bash
pnpm dev
```

服务将在 `http://localhost:8787` 启动

测试 API：
```bash
# 获取课程列表
curl http://localhost:8787/api/lessons

# 获取课程内容
curl http://localhost:8787/api/lessons/1001
```

### 3. 部署到 Cloudflare

```bash
pnpm deploy
```

## 添加新课程

### 1. 创建课程内容文件

在 `data/lessons/` 目录下创建新的 `.ron` 文件，例如 `1004.ron`：

```ron
(
    id: 1004,
    title: "你的课程标题",
    description: "课程描述",
    exercises: [
        (
            target: "练习文本",
            hint: Some("提示信息"),
        ),
    ],
)
```

### 2. 更新元数据

在 `data/metadata.json` 中添加课程信息：

```json
{
  "id": 1004,
  "title": "你的课程标题",
  "description": "课程描述",
  "author": "你的名字",
  "difficulty": "初级/中级/高级",
  "download_url": "https://keyzen.pingfury.top/api/lessons/1004",
  "version": "1.0.0",
  "tags": ["标签1", "标签2"]
}
```

### 3. 更新 Worker 代码

在 `src/index.ts` 中：

```typescript
// 导入新课程
import lesson1004 from '../data/lessons/1004.ron';

// 添加到映射表
const lessonsContent: Record<number, string> = {
  1001: lesson1001,
  1002: lesson1002,
  1003: lesson1003,
  1004: lesson1004, // 新增
};
```

### 4. 重新部署

```bash
pnpm deploy
```

## 技术栈

- **运行环境**: Cloudflare Workers
- **语言**: TypeScript
- **部署工具**: Wrangler CLI
- **数据格式**: JSON (元数据) + RON (课程内容)

## 注意事项

1. **大小限制**: Cloudflare Workers 有 1MB 大小限制（压缩后），适合 10-20 个课程
2. **更新流程**: 修改课程数据需要重新部署 Worker
3. **CORS**: API 已启用 CORS，支持跨域访问
4. **版本控制**: 所有课程数据都在 Git 中管理

## 许可证

MIT
