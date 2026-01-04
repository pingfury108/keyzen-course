---
name: generate-lesson
description: This skill should be used when the user asks to "生成课程", "generate lesson", "创建课程", "create a lesson", "添加课程", mentions "keyzen 课程", or discusses creating typing practice lessons for Keyzen.
version: 1.0.0
---

# Generate Keyzen Lesson

这个 skill 用于为 Keyzen 打字练习应用生成符合格式的课程数据文件。

## 何时使用此 Skill

当用户提出以下需求时，此 skill 会自动激活：
- "生成一个练习数字键的课程"
- "创建一个 Python 语法练习课程"
- "添加《静夜思》练习课程"
- 提到 "keyzen 课程"、"打字练习课程"
- 讨论课程数据生成

## Keyzen 课程数据格式

### 标准 RON 格式

```ron
Lesson(
    id: <4位数字>,
    lesson_type: <Prose | Code | Symbols>,
    language: "<语言代码>",
    title: "<课程标题>",
    description: "<课程描述>",
    exercises: [
        Exercise(content: "<练习内容>", hint: Some("<提示信息>")),
        Exercise(content: "<练习内容>", hint: None),
    ],
    meta: LessonMeta(
        difficulty: <Beginner | Intermediate | Advanced>,
        tags: ["<标签1>", "<标签2>"],
        estimated_time: (<秒>, 0),
        prerequisite_ids: [<前置课程ID>],
    ),
)
```

### 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | u32 | 4位数字课程ID | 1001 |
| `lesson_type` | enum | 课程类型 | Prose, Code, Symbols |
| `language` | string | 语言代码 | "zh-CN", "en-US", "code" |
| `title` | string | 课程标题 | "基础练习 - ASDF" |
| `description` | string | 课程描述 | "练习键盘中排..." |
| `exercises` | array | 练习列表 | 见下文 |
| `meta` | object | 元数据 | 见下文 |

**Exercise 字段：**
- `content`: 练习内容（必填）
- `hint`: 提示信息
  - 有提示：`Some("提示文本")`
  - 无提示：`None`

**LessonMeta 字段：**
- `difficulty`: 难度级别（Beginner/Intermediate/Advanced）
- `tags`: 标签数组，如 `["基础", "数字键"]`
- `estimated_time`: 预估时间 `(秒, 毫秒)`
- `prerequisite_ids`: 前置课程ID数组

### ID 分配规则

- **1000-1999**: 基础练习（键位、字母、数字）
- **2000-2999**: 代码练习（编程语言语法）
- **3000-3999**: 中文练习（诗词、文章）
- **4000-4999**: 符号练习（标点、特殊符号）

## 课程设计原则

### 1. 渐进式难度
从简单到复杂：
- 单个字符重复
- 字符组合
- 短句/代码片段
- 完整内容

### 2. 练习数量建议
- 基础课程：8-15 个练习
- 中级课程：15-25 个练习
- 高级课程：25-40 个练习

### 3. 时间估算
- 基础：300-600 秒（5-10 分钟）
- 中级：600-1200 秒（10-20 分钟）
- 高级：1200-1800 秒（20-30 分钟）

### 4. 提示使用
- 新内容首次出现时添加 hint
- 关键练习添加提示
- 重复练习可不加 hint

## 工作流程

### 步骤 1: 分析需求

理解用户想要什么类型的课程：
- 基础键位练习？→ ID 1000-1999, Prose
- 代码语法练习？→ ID 2000-2999, Code
- 文章/诗词练习？→ ID 3000-3999, Prose
- 符号练习？→ ID 4000-4999, Symbols

### 步骤 2: 分配课程 ID

1. 使用 Read 工具读取 `data/metadata.json`
2. 查看已有课程ID，避免冲突
3. 根据类型分配新ID
4. 告知用户分配的ID

### 步骤 3: 设计练习序列

根据内容类型设计合理的练习：

**数字键练习示例：**
```
1. 111 222 333 (单数字重复) - hint: "练习单个数字"
2. 444 555 666
3. 123 456 789 (组合)
4. 1234567890 (完整) - hint: "完整数字序列"
```

**代码练习示例：**
```
1. def if else for (关键字) - hint: "Python 关键字"
2. print("hello") (简单语句)
3. def add(a, b): (函数定义)
4. 完整函数代码
```

**诗词练习示例：**
```
1. 床前明月光 (第一句) - hint: "静夜思第一句"
2. 疑是地上霜 (第二句)
3. 举头望明月 (第三句)
4. 低头思故乡 (第四句)
5. 完整诗词
```

### 步骤 4: 生成课程文件

使用 Write 工具创建 `data/lessons/{id}.ron`

**示例（数字键练习）：**
```ron
Lesson(
    id: 1004,
    lesson_type: Prose,
    language: "zh-CN",
    title: "数字键练习 - 0123456789",
    description: "练习键盘数字行，掌握数字输入",
    exercises: [
        Exercise(content: "111 222 333", hint: Some("练习单个数字")),
        Exercise(content: "444 555 666", hint: None),
        Exercise(content: "777 888 999", hint: None),
        Exercise(content: "000", hint: None),
        Exercise(content: "123 456 789", hint: Some("数字组合")),
        Exercise(content: "147 258 369", hint: None),
        Exercise(content: "1234567890", hint: Some("完整数字序列")),
        Exercise(content: "0987654321", hint: None),
    ],
    meta: LessonMeta(
        difficulty: Beginner,
        tags: ["基础", "数字键"],
        estimated_time: (300, 0),
        prerequisite_ids: [1001, 1002, 1003],
    ),
)
```

### 步骤 5: 更新 metadata.json

使用 Read + Edit 工具更新 `data/metadata.json`。

在 `lessons` 数组中添加：
```json
{
  "id": 1004,
  "title": "数字键练习 - 0123456789",
  "description": "练习键盘数字行，掌握数字输入",
  "author": "pingfury",
  "difficulty": "初级",
  "download_url": "https://keyzen.pingfury.top/api/lessons/1004",
  "version": "1.0.0",
  "tags": ["基础", "数字键"]
}
```

### 步骤 6: 更新 src/index.ts

使用 Read + Edit 工具更新 `src/index.ts`：

**添加导入：**
```typescript
import lesson1004 from '../data/lessons/1004.ron';
```

**添加到映射表：**
```typescript
const lessonsContent: Record<number, string> = {
  1001: lesson1001,
  1002: lesson1002,
  1003: lesson1003,
  1004: lesson1004,  // 新增
};
```

### 步骤 7: 提示部署

告知用户：
```
✅ 课程已生成！

文件位置：
- data/lessons/1004.ron
- 已更新 data/metadata.json
- 已更新 src/index.ts

部署命令：
pnpm run deploy
```

## 格式注意事项

### 必须遵守的规则

1. **字符串使用双引号**：`"text"` 不是 `'text'`
2. **hint 格式严格**：`Some("...")` 或 `None`，不能是 `Some()` 或 `""`
3. **数组末尾无逗号**：最后一个元素后不加逗号
4. **UTF-8 编码**：确保中文正确保存
5. **RON 语法**：严格遵守括号、逗号规则

### 常见错误对照表

| ❌ 错误 | ✅ 正确 |
|---------|---------|
| `target:` | `content:` |
| `hint: ""` | `hint: None` |
| `hint: Some()` | `hint: Some("提示")` |
| `tags: [基础]` | `tags: ["基础"]` |
| `'string'` | `"string"` |
| `exercises: [],` (末尾逗号) | `exercises: []` |

## 示例场景

### 场景 1: 用户说 "生成一个练习数字键的课程"

**执行步骤：**
1. 确认课程类型：基础练习 → ID 1004
2. 设计 8 个练习：单数字 + 组合 + 序列
3. 生成 1004.ron 文件
4. 更新 metadata.json
5. 更新 index.ts
6. 提示部署

### 场景 2: 用户说 "生成一个 Python 函数练习课程"

**执行步骤：**
1. 确认课程类型：代码练习 → ID 2001
2. 设计练习：关键字 → 语句 → 函数 → 完整代码
3. lesson_type: Code, language: "code"
4. difficulty: Intermediate
5. 执行生成流程

### 场景 3: 用户说 "生成《静夜思》练习课程"

**执行步骤：**
1. 确认课程类型：中文练习 → ID 3001
2. 设计练习：分句 → 上下半首 → 完整诗词
3. lesson_type: Prose, language: "zh-CN"
4. difficulty: Beginner
5. 执行生成流程

## 执行规则

1. **始终使用工具**：Read、Write、Edit
2. **验证格式**：生成后检查 RON 语法
3. **避免ID冲突**：检查 metadata.json
4. **完整流程**：完成所有 7 个步骤
5. **清晰反馈**：告知用户每步进展

## 项目配置

当前项目的关键路径：
- 课程目录：`data/lessons/`
- 元数据文件：`data/metadata.json`
- API 入口：`src/index.ts`
- 部署 URL：`https://keyzen.pingfury.top/api/lessons`

按照以上流程，严格执行课程生成任务！
