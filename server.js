const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const OpenCC = require('opencc-js');

const app = express();
const port = process.env.PORT || 3000;

// 百度OCR API配置
const API_KEY = 'p9lPOjASq8eVETBigjyg8wIu';
const SECRET_KEY = 'rbg1Wka1ZaIfxNaOSu0woYfnpO8uKrXD';
const TOKEN_URL = 'https://aip.baidubce.com/oauth/2.0/token';
const OCR_URL = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic';

// 中间件配置
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('.'));

// 配置multer用于处理文件上传
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB限制
});

// 存储access token
let accessToken = null;
let tokenExpireTime = null;

// 获取Access Token
async function getAccessToken() {
    // 如果token还有效，直接返回
    if (accessToken && tokenExpireTime && new Date() < tokenExpireTime) {
        return accessToken;
    }
    
    try {
        const response = await axios.post(TOKEN_URL, null, {
            params: {
                grant_type: 'client_credentials',
                client_id: API_KEY,
                client_secret: SECRET_KEY
            }
        });
        
        accessToken = response.data.access_token;
        // Token有效期为30天，这里设置29天后过期
        tokenExpireTime = new Date();
        tokenExpireTime.setDate(tokenExpireTime.getDate() + 29);
        
        return accessToken;
    } catch (error) {
        console.error('获取Access Token失败:', error.message);
        throw new Error('获取API访问权限失败');
    }
}

// OCR识别接口
app.post('/api/ocr', upload.single('image'), async (req, res) => {
    try {
        if (!req.file && !req.body.image) {
            return res.status(400).json({ error: '请提供图片' });
        }
        
        // 获取图片的base64编码
        let base64Image;
        if (req.file) {
            // 如果是文件上传
            base64Image = req.file.buffer.toString('base64');
        } else if (req.body.image) {
            // 如果是base64字符串
            base64Image = req.body.image;
        }
        
        // 获取版式参数
        const verticalText = req.body.verticalText === true || req.body.verticalText === 'true'; // 是否竖排文字
        const readingDirection = req.body.readingDirection || 'ltr'; // ltr: 从左到右, rtl: 从右到左
        
        console.log('版式参数:', { verticalText, readingDirection });
        
        // 获取access token
        const token = await getAccessToken();
        
        // 调用百度OCR API
        const formData = new URLSearchParams();
        formData.append('image', base64Image);
        formData.append('language_type', 'CHN_ENG');
        formData.append('detect_direction', 'true');
        formData.append('detect_language', 'true');
        formData.append('probability', 'true');
        formData.append('vertexes_location', 'true'); // 返回文字外接多边形顶点位置
        formData.append('paragraph', 'true'); // 段落检测
        
        // 如果是竖排文字，使用高精度版API可能效果更好
        const apiUrl = verticalText 
            ? 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic'  // 高精度版
            : OCR_URL;  // 通用版
        
        const response = await axios.post(
            `${apiUrl}?access_token=${token}`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        const data = response.data;
        
        if (data.error_code) {
            throw new Error(data.error_msg || 'OCR识别失败');
        }
        
        // 提取识别的文字
        let text = '';
        let wordsResult = data.words_result || [];
        
        if (wordsResult.length > 0) {
            // 如果是竖排文字，需要重新组织文本
            if (verticalText) {
                console.log('处理竖排文字，共', wordsResult.length, '个文字块');
                // 竖排文字通常需要特殊处理
                // 检查是否有位置信息
                const hasLocation = wordsResult[0] && wordsResult[0].location;
                if (hasLocation) {
                    // 有位置信息，使用精确排序
                    text = processVerticalText(wordsResult, readingDirection);
                } else {
                    // 没有位置信息，使用简单的竖排处理
                    // 竖排文字每个识别块通常是一列
                    const columns = wordsResult.map(item => item.words);
                    if (readingDirection === 'rtl') {
                        // 从右到左，保持原顺序（百度OCR通常从右到左识别竖排文字）
                        text = columns.join('\n');
                    } else {
                        // 从左到右，反转列顺序
                        text = columns.reverse().join('\n');
                    }
                }
            } else {
                // 横排文字
                if (readingDirection === 'rtl') {
                    // 从右到左，需要反转每行
                    text = wordsResult.map(item => item.words.split('').reverse().join('')).join('\n');
                } else {
                    // 从左到右，正常处理
                    text = wordsResult.map(item => item.words).join('\n');
                }
            }
        } else {
            throw new Error('未识别到文字');
        }
        
        // 使用OpenCC进行繁体转简体
        let simplifiedText = text;
        try {
            const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
            simplifiedText = converter(text);
        } catch (err) {
            console.error('OpenCC转换错误:', err);
            // 如果OpenCC失败，返回原文
            simplifiedText = text;
        }
        
        res.json({
            success: true,
            text: text,  // 原始文本（可能包含繁体）
            simplifiedText: simplifiedText,  // 简体文本
            words_result: data.words_result,
            words_result_num: data.words_result_num || 0,
            direction: data.direction || 0,  // 图片方向
            language: data.language || -1,  // 语言类型
            paragraphs_result: data.paragraphs_result || [],  // 段落信息
            verticalText: verticalText,
            readingDirection: readingDirection
        });
        
    } catch (error) {
        console.error('OCR处理错误:', error);
        res.status(500).json({
            success: false,
            error: error.message || '处理失败'
        });
    }
});

// 处理竖排文字的函数
function processVerticalText(wordsResult, readingDirection) {
    // 根据位置信息对文字进行排序
    // 竖排文字通常从右到左，从上到下
    
    // 获取所有文字块的位置信息
    const blocks = wordsResult.map(item => {
        const location = item.location || {};
        return {
            text: item.words,
            left: location.left || 0,
            top: location.top || 0,
            width: location.width || 0,
            height: location.height || 0,
            centerX: (location.left || 0) + (location.width || 0) / 2,
            centerY: (location.top || 0) + (location.height || 0) / 2
        };
    });
    
    // 按列分组（根据x坐标）
    const columns = {};
    const columnThreshold = 50; // 同一列的阈值
    
    blocks.forEach(block => {
        let columnKey = Math.round(block.centerX / columnThreshold) * columnThreshold;
        if (!columns[columnKey]) {
            columns[columnKey] = [];
        }
        columns[columnKey].push(block);
    });
    
    // 对每列内的文字按y坐标排序（从上到下）
    Object.keys(columns).forEach(key => {
        columns[key].sort((a, b) => a.centerY - b.centerY);
    });
    
    // 根据阅读方向排序列
    const sortedColumns = Object.keys(columns).map(Number).sort((a, b) => {
        return readingDirection === 'rtl' ? b - a : a - b;
    });
    
    // 组合文本
    const result = [];
    sortedColumns.forEach(columnKey => {
        const columnText = columns[columnKey].map(block => block.text).join('');
        result.push(columnText);
    });
    
    return result.join('\n');
}

// 健康检查接口
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'OCR服务正在运行' });
});

// 启动服务器
app.listen(port, () => {
    console.log(`\n🚀 OCR服务器已启动！`);
    console.log(`📍 访问地址: http://localhost:${port}`);
    console.log(`📄 请在浏览器中打开 http://localhost:${port}/ocr_tool.html`);
    console.log(`\n提示：按 Ctrl+C 停止服务器`);
});
