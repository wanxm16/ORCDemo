# 🚀 OCR工具快速部署指南

以下是几种简单快速的部署方案，按照从简单到复杂排序：

## 方案1：Render 一键部署（推荐，有免费套餐）

### 步骤：
1. 注册 [Render](https://render.com) 账号
2. 点击 "New +" → "Web Service"
3. 连接您的GitHub账号，选择 `ORCDemo` 仓库
4. 填写服务信息：
   - Name: `ocr-demo`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. 选择免费套餐（Free）
6. 点击 "Create Web Service"
7. 等待部署完成，您会获得一个类似 `https://ocr-demo-xxx.onrender.com` 的网址

**优点**：完全免费，自动部署，支持HTTPS
**缺点**：免费版15分钟无访问会休眠，首次访问需等待启动

---

## 方案2：Railway 部署（简单，有免费额度）

### 步骤：
1. 访问 [Railway](https://railway.app)
2. 使用GitHub登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择您的 `ORCDemo` 仓库
5. Railway会自动检测并部署
6. 部署完成后，点击 "Settings" → "Generate Domain"
7. 获得公网访问地址

**优点**：部署极其简单，有免费额度
**缺点**：免费额度用完需付费

---

## 方案3：宝塔面板部署（适合有VPS的用户）

### 前提：您已有一台安装了宝塔面板的VPS

### 步骤：
1. 在宝塔面板中安装：
   - Nginx
   - PM2管理器
   - Node.js版本管理器（选择Node.js 18+）

2. 创建网站：
   - 点击"网站" → "添加站点"
   - 输入域名或使用IP
   - 选择纯静态

3. 上传代码：
   - 通过宝塔文件管理器上传代码到网站目录
   - 或使用SSH： `git clone https://github.com/wanxm16/ORCDemo.git`

4. 安装依赖：
   ```bash
   cd /www/wwwroot/您的网站目录
   npm install
   ```

5. 使用PM2启动：
   - 在宝塔PM2管理器中
   - 点击"添加项目"
   - 启动文件选择 `server.js`
   - 项目名称：`ocr-demo`

6. 配置反向代理：
   - 网站设置 → 反向代理
   - 添加反向代理：
     - 代理名称：`nodejs`
     - 目标URL：`http://127.0.0.1:3000`

**优点**：可视化管理，稳定可靠
**缺点**：需要有VPS服务器

---

## 方案4：Vercel 部署（适合静态部署）

由于Vercel主要用于静态网站，需要稍作修改：

### 创建 vercel.json：
```json
{
  "functions": {
    "server.js": {
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/server.js"
    }
  ]
}
```

但注意：Vercel对服务器端功能有限制，可能不完全支持文件上传。

---

## 方案5：使用腾讯云/阿里云轻量服务器

### 一键部署脚本：

创建 `deploy.sh`：
```bash
#!/bin/bash

# 更新系统
sudo apt update -y

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 git
sudo apt install -y git

# 克隆项目
git clone https://github.com/wanxm16/ORCDemo.git
cd ORCDemo

# 安装依赖
npm install

# 安装 PM2
sudo npm install -g pm2

# 启动应用
pm2 start server.js --name ocr-demo
pm2 save
pm2 startup

# 安装 Nginx
sudo apt install -y nginx

# 配置 Nginx
sudo tee /etc/nginx/sites-available/ocr-demo << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 启用站点
sudo ln -s /etc/nginx/sites-available/ocr-demo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "部署完成！请访问 http://您的服务器IP"
```

执行部署：
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🌟 最简单推荐方案

如果您想要：
- **最简单 + 免费**：选择 Render
- **最快速 + 稳定**：选择 Railway
- **最专业 + 可控**：选择 VPS + 宝塔面板

## 注意事项

1. **API密钥安全**：
   - 生产环境建议使用环境变量存储API密钥
   - 可以在部署平台设置环境变量

2. **域名访问**：
   - 如需自定义域名，各平台都支持绑定域名
   - 需要在域名DNS中添加相应记录

3. **性能优化**：
   - 大量用户访问时，考虑使用CDN
   - 可以添加Redis缓存重复识别的图片

需要我帮您准备特定平台的部署配置文件吗？
