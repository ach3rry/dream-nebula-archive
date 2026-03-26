# 部署指南 / Deployment Guide

## 🚀 Vercel 部署（推荐）

### 前端部署（Next.js）

1. **Fork 并克隆项目**
   ```bash
   git clone https://github.com/ach3rry/dream-nebula-archive.git
   cd dream-nebula-archive
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**

   在 Vercel 项目设置中添加以下环境变量：

   ```
   NEXT_PUBLIC_DEMO_MODE=true
   ```

   **Demo 模式说明：**
   - 设置为 `true`：使用 Mock 数据，无需后端，可直接展示
   - 设置为 `false`：需要部署后端 API

4. **部署到 Vercel**
   ```bash
   # 安装 Vercel CLI
   npm i -g vercel

   # 部署
   vercel
   ```

### Demo 模式部署（最简单）

如果你想快速部署一个 Demo 版本：

1. 在 Vercel 中创建项目
2. 设置环境变量：`NEXT_PUBLIC_DEMO_MODE=true`
3. 部署完成！

Demo 模式下包含：
- ✅ 32 条高质量诗意梦境
- ✅ 完整的情感分析 Mock
- ✅ 8 个详细的梦境解读示例
- ✅ 3D 梦境星云可视化
- ✅ 响应式设计

### 完整功能部署（需要后端）

如果你想使用完整的 DeepSeek AI 分析功能：

1. **先部署后端**（需要 VPS 或支持 Python 的平台）
   - 参考 `backend/README.md`
   - 确保 YashanDB 数据库正常运行
   - 配置 DeepSeek API Key

2. **配置前端环境变量**
   ```
   NEXT_PUBLIC_DEMO_MODE=false
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   ```

3. **部署前端**

## 📦 本地开发

### 前端开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 后端开发

```bash
cd backend

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 启动后端
python main.py
```

### YashanDB 数据库

使用 Docker 快速启动：

```bash
docker run -d \
  -p 1688:1688 \
  -v ~/yashan/data:/data/yashan \
  -v ~/yashan/yasboot:/home/yashan/.yasboot \
  -e SYS_PASSWD=your-password \
  --name yashandb \
  yashandb/yasdb:latest
```

详细配置请参考：[YashanDB Docker 部署](https://github.com/yashan-technologies/yashandb)

## 🎨 功能特性

### 已实现功能

- ✅ **梦境记录** - 记录和保存你的梦境
- ✅ **情感分析** - AI 分析梦境情感类型
- ✅ **梦境解读** - 赛博周公 AI 解梦
- ✅ **3D 星云可视化** - Three.js 梦境星云图谱
- ✅ **统计仪表板** - 梦境情感分布统计
- ✅ **响应式设计** - 支持桌面和移动端
- ✅ **Demo 模式** - 无需后端即可体验

### 技术栈

- **前端**：Next.js 15.5 + React 19 + TypeScript
- **3D 渲染**：Three.js + React Three Fiber
- **样式**：Tailwind CSS + Framer Motion
- **后端**：Python + FastAPI
- **数据库**：YashanDB
- **AI 分析**：DeepSeek API

## 📝 环境变量说明

### 前端环境变量

```env
# Demo 模式开关
NEXT_PUBLIC_DEMO_MODE=true/false

# 后端 API 地址（Demo 模式下不使用）
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 后端环境变量

```env
# YashanDB 配置
YASHANDB_USER=dream_user
YASHANDB_PASSWORD=Dream1234
YASHANDB_DSN=localhost:1688

# DeepSeek API
DEEPSEEK_API_KEY=sk-xxx
```

## 🐛 常见问题

### Demo 模式下无法看到数据？

检查 `.env.local` 文件是否设置了 `NEXT_PUBLIC_DEMO_MODE=true`

### 3D 星云无法显示？

确保浏览器支持 WebGL，并检查网络连接

### Vercel 部署后页面空白？

1. 检查环境变量是否正确配置
2. 查看 Vercel 部署日志
3. 确保构建成功无误

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 🙏 致谢

- [YashanDB](https://yashandb.com/) - 崖山数据库
- [DeepSeek](https://www.deepseek.com/) - AI 分析引擎
- [Three.js](https://threejs.org/) - 3D 渲染引擎
- [Next.js](https://nextjs.org/) - React 框架

## 📧 联系方式

- GitHub Issues: [提交问题](https://github.com/ach3rry/dream-nebula-archive/issues)
- Email: your-email@example.com

---

**参赛项目**：YashanDB AI 应用挑战赛
**项目名称**：梦境星云档案馆 (Dream Nebula Archive)
