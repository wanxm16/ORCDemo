# OCR Demo - 繁体字图片识别与转换工具

一个基于百度OCR API和OpenCC的繁体字图片识别与简体字转换工具。支持竖排/横排文字识别，以及从左到右/从右到左的阅读方向。

## 功能特点

- 🖼️ **图片上传**：支持拖拽上传和点击选择图片
- 🔍 **OCR识别**：使用百度OCR API进行高精度文字识别
- 🔄 **繁简转换**：使用OpenCC进行专业的繁体转简体转换
- 📐 **版式设置**：支持竖排/横排文字识别
- ↔️ **阅读方向**：支持从左到右/从右到左的阅读方向
- 🚀 **本地服务器**：通过Node.js服务器解决CORS问题

## 技术栈

- **前端**：HTML5、CSS3、JavaScript (原生)
- **后端**：Node.js、Express
- **OCR服务**：百度OCR API
- **繁简转换**：OpenCC-js
- **文件处理**：Multer

## 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/wanxm16/ORCDemo.git
cd ORCDemo
```

2. 安装依赖
```bash
npm install
```

3. 启动服务器
```bash
npm start
```

4. 打开浏览器访问
```
http://localhost:3000/ocr_tool.html
```

## 使用说明

1. **上传图片**：
   - 拖拽图片到上传区域
   - 或点击"选择图片"按钮选择文件

2. **版式设置**：
   - 文字方向：选择"竖排文字（古诗词）"或"横排文字"
   - 阅读方向：选择"从右到左 ←"或"从左到右 →"

3. **开始识别**：
   - 点击"开始识别与转换"按钮
   - 等待处理完成

4. **查看结果**：
   - 左侧显示识别的繁体字
   - 右侧显示转换后的简体字
   - 可以复制文字内容

## 项目结构

```
OCR demo/
├── ocr_tool.html        # 前端页面
├── server.js            # Node.js服务器
├── package.json         # 项目配置
├── package-lock.json    # 依赖锁定文件
├── .gitignore          # Git忽略文件
├── README.md           # 项目说明
└── 测试图片/           # 测试用图片
    ├── Weixin Image_2025-08-22_082515_475.jpg
    ├── Weixin Image_20250822082529_220.jpg
    ├── Weixin Image_20250822082533_221.jpg
    └── Weixin Image_20250822082537_222.jpg
```

## API配置

项目使用百度OCR API，相关配置已内置在`server.js`中：
- AppID: 7019773
- API Key: p9lPOjASq8eVETBigjyg8wIu
- Secret Key: rbg1Wka1ZaIfxNaOSu0woYfnpO8uKrXD

## 注意事项

- 图片大小限制：5MB
- 支持的图片格式：JPG、JPEG、PNG、BMP
- 需要稳定的网络连接来调用百度API
- 建议使用Chrome、Firefox等现代浏览器

## 常见问题

1. **CORS错误**：确保通过`npm start`启动本地服务器，而不是直接打开HTML文件
2. **图片识别失败**：检查图片大小是否超过5MB，或网络连接是否正常
3. **转换结果不准确**：可以尝试调整版式设置，选择合适的文字方向和阅读方向

## 开发说明

### 启动开发环境
```bash
# 使用nodemon自动重启服务器
npm run dev
```

### 主要依赖
- express: Web服务器框架
- cors: 处理跨域请求
- multer: 处理文件上传
- axios: HTTP客户端
- opencc-js: 繁简转换库

## License

ISC

## 作者

wanxm16

## 贡献

欢迎提交Issue和Pull Request！