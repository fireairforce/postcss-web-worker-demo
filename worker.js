// PostCSS Web Worker - 加载 Autoprefixer 并执行转换
importScripts('./postcss-web-worker.js');
importScripts('./postcss-plugins/autoprefix-web-worker.js'); // 加载你的 autoprefixer worker 脚本

console.log('PostCSS Worker 已加载');

// 存储主线程传递的 PostCSS 配置
let postcssConfig = null;
let postcssAvailable = true;
let autoprefixerAvailable = true;

console.log('self', self);

// 监听主线程消息
self.addEventListener('message', async function(e) {
    const { type, data, options = {} } = e.data;
  
    switch (type) {
        case 'init':
            // 接收主线程传递的 PostCSS 配置
            try {
                postcssConfig = data.config;
                console.log('PostCSS 配置已接收:', postcssConfig);
                
                self.postMessage({
                    type: 'init_success',
                    message: 'PostCSS 配置初始化成功',
                    postcssAvailable: postcssAvailable,
                    autoprefixerAvailable: autoprefixerAvailable
                });
            } catch (error) {
                self.postMessage({
                    type: 'init_error',
                    error: `初始化失败: ${error.message}`
                });
            }
            break;
            
        case 'transform':
            // 执行 CSS 转换
            try {
                if (!postcssAvailable) {
                    throw new Error('PostCSS 未可用');
                }
                
                console.log('开始执行 PostCSS 转换');
                const result = await executeTransform(data, options);
                
                self.postMessage({
                    type: 'transform_success',
                    data: result,
                    originalInput: data
                });
            } catch (error) {
                console.error('转换失败:', error);
                self.postMessage({
                    type: 'transform_error',
                    error: error.message,
                    stack: error.stack
                });
            }
            break;
            
        case 'test':
            // 测试 PostCSS 功能
            try {
                const testResult = await runTests();
                self.postMessage({
                    type: 'test_success',
                    data: testResult
                });
            } catch (error) {
                self.postMessage({
                    type: 'test_error',
                    error: `测试失败: ${error.message}`
                });
            }
            break;
            
        case 'getStatus':
            // 返回当前状态
            self.postMessage({
                type: 'status',
                data: {
                    initialized: !!postcssConfig,
                    config: postcssConfig,
                    postcssAvailable: postcssAvailable,
                    autoprefixerAvailable: autoprefixerAvailable
                }
            });
            break;
            
        default:
            self.postMessage({
                type: 'error',
                error: `未知的消息类型: ${type}`
            });
    }
});

// 执行 PostCSS 转换
async function executeTransform(input, options = {}) {
    try {
        if (!postcssAvailable) {
            throw new Error('PostCSS 未可用');
        }
        
        const { css, from, to, map = false } = options;
        const cssToProcess = css || input;
        
        console.log('处理 CSS:', cssToProcess.substring(0, 100) + '...');
        
        // 创建 PostCSS 处理器
        let processor = self.postcss();
        
        // 如果有配置的插件，添加到处理器
        if (postcssConfig && postcssConfig.plugins) {
            const plugins = [];
            
            // 添加 Autoprefixer 处理器（使用你的 autoprefix-web-worker）
            if (postcssConfig.plugins.autoprefixer && autoprefixerAvailable) {
                plugins.push(self.autoprefixer());
            }
            
            if (plugins.length > 0) {
                processor = self.postcss(plugins);
            }
        }
        
        // 处理 CSS
        const result = await processor.process(cssToProcess, {
            from: from || 'input.css',
            to: to || 'output.css',
            map: map
        });
        
        console.log('PostCSS 处理完成');
        
        return {
            css: result.css,
            map: result.map,
            messages: result.messages || [],
            warnings: result.warnings() || [],
            processed: true,
            timestamp: new Date().toISOString(),
            config: postcssConfig,
            autoprefixerUsed: autoprefixerAvailable
        };
        
    } catch (error) {
        console.error('PostCSS 转换错误:', error);
        throw new Error(`转换失败: ${error.message}`);
    }
}


// 运行测试用例
async function runTests() {
    const tests = [];
    
    // 导入测试用例
    const testCases = [
        // 1. Flexbox 属性测试
        {
            name: 'Flexbox 属性前缀测试',
            description: '测试 flexbox 相关属性是否正确添加前缀',
            css: `
.flex-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    flex-wrap: wrap;
    flex: 1 1 auto;
    order: 2;
    align-self: center;
    flex-shrink: 0;
    flex-grow: 1;
    flex-basis: auto;
}`,
            expectedPrefixes: ['-webkit-', '-ms-'],
            category: 'flexbox'
        },

        // 2. Transform 和 Transition 测试
        {
            name: 'Transform/Transition 前缀测试',
            description: '测试 transform 和 transition 属性是否正确添加前缀',
            css: `
.transform-box {
    transform: translateX(100px) rotate(45deg) scale(1.2);
    transform-origin: center center;
    transform-style: preserve-3d;
    transition: transform 0.3s ease, opacity 0.2s;
    transition-delay: 0.1s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: all;
    transition-duration: 0.3s;
}`,
            expectedPrefixes: ['-webkit-', '-moz-', '-ms-'],
            category: 'transform'
        },

        // 3. Grid 布局测试
        {
            name: 'Grid 布局前缀测试',
            description: '测试 CSS Grid 属性是否正确添加前缀',
            css: `
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto 1fr auto;
    grid-gap: 20px;
    grid-auto-rows: minmax(100px, auto);
    grid-auto-flow: dense;
    justify-items: center;
    align-items: start;
    justify-content: space-between;
    align-content: stretch;
}

.grid-item {
    grid-column: 1 / 3;
    grid-row: 2 / 4;
    justify-self: stretch;
    align-self: center;
}`,
            expectedPrefixes: ['-ms-'],
            category: 'grid'
        },

        // 4. Filter 和 Backdrop Filter 测试
        {
            name: 'Filter 属性前缀测试',
            description: '测试 filter 和 backdrop-filter 属性是否正确添加前缀',
            css: `
.filtered-element {
    filter: blur(5px) brightness(1.2) contrast(1.1) saturate(1.5);
    backdrop-filter: blur(10px) saturate(2) brightness(0.8);
}

.more-filters {
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3)) hue-rotate(90deg);
    backdrop-filter: grayscale(50%) sepia(20%);
}`,
            expectedPrefixes: ['-webkit-'],
            category: 'filter'
        },

        // 5. 用户交互属性测试
        {
            name: '用户交互属性前缀测试',
            description: '测试用户交互相关属性是否正确添加前缀',
            css: `
.interactive-element {
    user-select: none;
    user-drag: none;
    user-modify: read-only;
    appearance: none;
    touch-action: manipulation;
}

.scrollable {
    overflow-x: auto;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    scroll-snap-align: start;
}`,
            expectedPrefixes: ['-webkit-', '-moz-', '-ms-'],
            category: 'user-interaction'
        },

        // 6. 动画和关键帧测试
        {
            name: '动画属性前缀测试',
            description: '测试动画相关属性是否正确添加前缀',
            css: `
@keyframes slideIn {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

.animated-element {
    animation: slideIn 0.5s ease-in-out;
    animation-delay: 0.2s;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-play-state: running;
}`,
            expectedPrefixes: ['-webkit-', '-moz-', '-ms-'],
            category: 'animation'
        },

        // 7. 现代 CSS 属性测试
        {
            name: '现代 CSS 属性前缀测试',
            description: '测试现代 CSS 属性是否正确添加前缀',
            css: `
.modern-element {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    mask: linear-gradient(black, transparent);
    mask-composite: intersect;
    shape-outside: circle(50%);
    shape-margin: 10px;
    will-change: transform, opacity;
    contain: layout style paint;
    isolation: isolate;
}

.text-features {
    text-decoration: underline wavy red;
    text-decoration-skip-ink: auto;
    text-underline-position: under;
    font-feature-settings: "liga" 1, "kern" 1;
    font-variant-ligatures: common-ligatures;
    hyphens: auto;
}`,
            expectedPrefixes: ['-webkit-'],
            category: 'modern-css'
        },

        // 8. 复杂的媒体查询和嵌套结构测试
        {
            name: '复杂结构前缀测试',
            description: '测试复杂 CSS 结构中的前缀处理',
            css: `
@media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
    .responsive-box {
        display: flex;
        transform: scale(1.1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(5px);
        will-change: transform;
    }
    
    .responsive-box:hover {
        filter: brightness(1.1);
        transform: scale(1.2) rotate(2deg);
        animation: pulse 2s infinite;
    }
}

@supports (display: grid) and (backdrop-filter: blur(1px)) {
    .modern-layout {
        display: grid;
        grid-template-areas: "header header" "sidebar main";
        backdrop-filter: blur(10px);
        isolation: isolate;
    }
}

@supports not (backdrop-filter: blur(1px)) {
    .fallback {
        background: rgba(255, 255, 255, 0.8);
        filter: blur(10px);
    }
}`,
            expectedPrefixes: ['-webkit-', '-moz-', '-ms-'],
            category: 'complex-structure'
        },

        // 9. 渐变和背景测试
        {
            name: '渐变和背景前缀测试',
            description: '测试渐变和背景相关属性是否正确添加前缀',
            css: `
.gradient-element {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}

.radial-gradient {
    background: radial-gradient(circle, #ff6b6b, #4ecdc4);
}`,
            expectedPrefixes: ['-webkit-', '-moz-', '-ms-'],
            category: 'gradient'
        },

        // 10. 边框和阴影测试
        {
            name: '边框和阴影前缀测试',
            description: '测试边框和阴影相关属性是否正确添加前缀',
            css: `
.shadow-element {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    border-image: linear-gradient(45deg, #ff6b6b, #4ecdc4) 1;
}

.multiple-shadows {
    box-shadow: 
        0 1px 3px rgba(0, 0, 0, 0.12),
        0 1px 2px rgba(0, 0, 0, 0.24);
    text-shadow: 
        1px 1px 2px rgba(0, 0, 0, 0.5),
        2px 2px 4px rgba(0, 0, 0, 0.3);
}`,
            expectedPrefixes: ['-webkit-', '-moz-'],
            category: 'border-shadow'
        },

        // 11. 字体和文本测试
        {
            name: '字体和文本前缀测试',
            description: '测试字体和文本相关属性是否正确添加前缀',
            css: `
.text-element {
    font-feature-settings: "liga" 1, "kern" 1;
    font-variant-ligatures: common-ligatures;
    font-variant-numeric: oldstyle-nums;
    font-variant-caps: small-caps;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.hyphenation {
    hyphens: auto;
    word-break: break-word;
    overflow-wrap: break-word;
    text-align: justify;
}`,
            expectedPrefixes: ['-webkit-', '-moz-'],
            category: 'font-text'
        },

        // 12. 定位和布局测试
        {
            name: '定位和布局前缀测试',
            description: '测试定位和布局相关属性是否正确添加前缀',
            css: `
.positioned-element {
    position: sticky;
    top: 0;
    z-index: 1000;
    contain: layout style paint;
    isolation: isolate;
    will-change: transform;
}

.layout-element {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
}`,
            expectedPrefixes: ['-webkit-', '-moz-', '-ms-'],
            category: 'positioning'
        }
    ];
    
    // 首先测试 autoprefixer 是否正常工作
    if (autoprefixerAvailable) {
        console.log('🧪 开始 Autoprefixer 专项测试');
        
        // 运行所有测试用例
        for (const testCase of testCases) {
            try {
                console.log(`测试: ${testCase.name}`);
                const result = await executeTransform(testCase.css);
                
                // 验证输出是否包含期望的前缀
                const validation = validateAutoprefixerOutput(result.css, testCase.expectedPrefixes);
                
                tests.push({
                    name: testCase.name,
                    description: testCase.description,
                    success: validation.allExpectedPrefixes,
                    input: testCase.css,
                    output: result.css,
                    expectedPrefixes: testCase.expectedPrefixes,
                    validation: validation,
                    message: validation.allExpectedPrefixes ? 
                        `${testCase.name} 前缀添加成功` : 
                        `缺少前缀: ${validation.missingPrefixes.join(', ')}`,
                    category: testCase.category
                });
                
            } catch (error) {
                tests.push({
                    name: testCase.name,
                    description: testCase.description,
                    success: false,
                    input: testCase.css,
                    error: error.message,
                    category: testCase.category
                });
            }
        }
        
        console.log('✅ Autoprefixer 专项测试完成');
        
    } else {
        tests.push({
            name: '❌ Autoprefixer 不可用',
            success: false,
            error: 'autoprefix-web-worker.js 未正确加载',
            category: 'autoprefixer'
        });
    }
    
    // 基础 PostCSS 功能测试
    try {
        const basicCSS = '.test { color: red; display: flex; }';
        const basicResult = await executeTransform(basicCSS);
        
        tests.push({
            name: '基础 CSS 转换',
            success: true,
            input: basicCSS,
            output: basicResult.css,
            message: '基础转换成功',
            category: 'basic'
        });
        
    } catch (error) {
        tests.push({
            name: '基础 CSS 转换',
            success: false,
            error: error.message,
            category: 'basic'
        });
    }
    
    // 按类别分组测试结果
    const autoprefixerTests = tests.filter(t => t.category !== 'basic');
    const basicTests = tests.filter(t => t.category === 'basic');
    
    // 生成测试报告
    const report = {
        summary: {
            total: tests.length,
            passed: tests.filter(t => t.success).length,
            failed: tests.filter(t => !t.success).length,
            successRate: 0
        },
        categories: {},
        details: tests,
        timestamp: new Date().toISOString(),
        autoprefixerStatus: autoprefixerAvailable ? 'available' : 'not available'
    };

    // 计算成功率
    report.summary.successRate = (report.summary.passed / report.summary.total * 100).toFixed(2);

    // 按类别分组
    tests.forEach(result => {
        if (!report.categories[result.category]) {
            report.categories[result.category] = {
                total: 0,
                passed: 0,
                failed: 0
            };
        }
        
        report.categories[result.category].total++;
        if (result.success) {
            report.categories[result.category].passed++;
        } else {
            report.categories[result.category].failed++;
        }
    });

    return report;
}

// 验证 autoprefixer 输出
function validateAutoprefixerOutput(css, expectedPrefixes) {
    const results = {
        hasWebkitPrefix: css.includes('-webkit-'),
        hasMozPrefix: css.includes('-moz-'),
        hasMsPrefix: css.includes('-ms-'),
        hasOPrefix: css.includes('-o-'),
        allExpectedPrefixes: true,
        missingPrefixes: []
    };

    // 检查期望的前缀是否存在
    expectedPrefixes.forEach(prefix => {
        const hasPrefix = css.includes(prefix);
        
        if (!hasPrefix) {
            results.allExpectedPrefixes = false;
            results.missingPrefixes.push(prefix);
        }
    });

    return results;
}

// 导出函数供外部调用
self.executeTransform = executeTransform;
self.runTests = runTests; 