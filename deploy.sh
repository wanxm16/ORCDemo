#!/bin/bash

echo "🚀 开始部署 OCR Demo..."

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "请使用 sudo 运行此脚本"
    exit 1
fi

# 更新系统
echo "📦 更新系统包..."
apt update -y

# 安装 Node.js 18
echo "📦 安装 Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 安装 git
echo "📦 安装 Git..."
apt install -y git

# 创建应用目录
echo "📁 创建应用目录..."
mkdir -p /var/www/ocr-demo
cd /var/www/ocr-demo

# 克隆项目
echo "📥 下载项目代码..."
git clone https://github.com/wanxm16/ORCDemo.git .

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 安装 PM2
echo "📦 安装 PM2..."
npm install -g pm2

# 启动应用
echo "🚀 启动应用..."
pm2 start server.js --name ocr-demo
pm2 save
pm2 startup

# 安装 Nginx
echo "📦 安装 Nginx..."
apt install -y nginx

# 配置 Nginx
echo "⚙️ 配置 Nginx..."
cat > /etc/nginx/sites-available/ocr-demo << 'EOF'
server {
    listen 80;
    server_name _;
    client_max_body_size 10M;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/ocr-demo /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试并重启 Nginx
echo "🔄 重启 Nginx..."
nginx -t && systemctl restart nginx

# 设置防火墙
echo "🔥 配置防火墙..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 获取服务器 IP
SERVER_IP=$(curl -s http://checkip.amazonaws.com)

echo "✅ 部署完成！"
echo "📍 访问地址: http://$SERVER_IP"
echo ""
echo "📝 常用命令："
echo "  查看日志: pm2 logs ocr-demo"
echo "  重启应用: pm2 restart ocr-demo"
echo "  停止应用: pm2 stop ocr-demo"
echo "  查看状态: pm2 status"
