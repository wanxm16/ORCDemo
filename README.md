# 繁体字OCR识别与简体转换工具

这是一个基于百度OCR API的繁体字识别和简体转换工具，可以将繁体中文图片中的文字识别出来并转换为简体中文。

## 功能特点

- 📷 支持图片拖拽上传
- 🔤 使用百度OCR API进行文字识别
- 🔄 使用OpenCC专业库进行智能繁简转换
- 📋 支持一键复制结果
- 🎨 现代化的UI设计
- 🚀 支持词组级别的繁简转换

## 使用前准备

### 1. 安装Node.js

请确保您的电脑已安装Node.js（建议版本14.0以上）。

检查是否已安装：
```bash
node --version
npm --version
```

如未安装，请访问 [Node.js官网](https://nodejs.org/) 下载安装。

### 2. 安装依赖

在项目目录下打开终端，运行：

```bash
npm install
```

## 使用方法

### 1. 启动服务器

在项目目录下运行：

```bash
npm start
```

您应该会看到：
```
🚀 OCR服务器已启动！
📍 访问地址: http://localhost:3000
📄 请在浏览器中打开 http://localhost:3000/ocr_tool.html
```

### 2. 使用工具

1. 在浏览器中打开 http://localhost:3000/ocr_tool.html
2. 点击上传区域或拖拽图片到上传区域
3. 点击"开始识别与转换"按钮
4. 查看识别结果，可切换查看繁体原文和简体转换结果
5. 使用"复制结果"按钮复制文字

## 文件说明

- `server.js` - Node.js服务器，处理OCR API调用
- `ocr_tool.html` - 主要的前端界面
- `package.json` - 项目依赖配置文件
- `README.md` - 项目说明文档
- `测试图片/` - 包含测试用的繁体字图片

## 测试图片

项目中提供了几张测试图片，位于`测试图片`文件夹中：
- Weixin Image_2025-08-22_082515_475.jpg
- Weixin Image_20250822082529_220.jpg
- Weixin Image_20250822082533_221.jpg
- Weixin Image_20250822082537_222.jpg

## API配置

当前使用的百度OCR API配置：
- AppID: 7019773
- API Key: p9lPOjASq8eVETBigjyg8wIu
- Secret Key: rbg1Wka1ZaIfxNaOSu0woYfnpO8uKrXD

注意：这些是演示用的API密钥，请勿在生产环境使用。

## 常见问题

### Q: 为什么不能直接打开HTML文件使用？

A: 由于浏览器的安全限制（CORS），百度OCR API不能从浏览器直接调用，必须通过服务器代理。



### Q: 服务器启动失败怎么办？

A: 
1. 确保已运行 `npm install` 安装依赖
2. 检查3000端口是否被占用
3. 查看错误信息并根据提示解决

### Q: 识别效果不好怎么办？

A: 
1. 确保图片清晰，文字部分对比度高
2. 避免图片过小或过大（建议宽度800-2000像素）
3. 确保图片中的文字是正向的

## 技术栈

- 前端：HTML5 + CSS3 + JavaScript
- 后端：Node.js + Express
- OCR：百度智能云OCR API
- 繁简转换：OpenCC专业库（服务器端）

## 许可证

MIT License
