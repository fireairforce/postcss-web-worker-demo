// Autoprefixer 测试用例集合
// 这些测试用例专门用于验证 autoprefixer 是否正确添加浏览器前缀

export const autoprefixerTestCases = [
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
    background: -webkit-linear-gradient(45deg, #ff6b6b, #4ecdc4);
    background: -moz-linear-gradient(45deg, #ff6b6b, #4ecdc4);
    background: -ms-linear-gradient(45deg, #ff6b6b, #4ecdc4);
}

.radial-gradient {
    background: radial-gradient(circle, #ff6b6b, #4ecdc4);
    background: -webkit-radial-gradient(circle, #ff6b6b, #4ecdc4);
    background: -moz-radial-gradient(circle, #ff6b6b, #4ecdc4);
    background: -ms-radial-gradient(circle, #ff6b6b, #4ecdc4);
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

// 测试用例验证函数
export function validateAutoprefixerOutput(css, expectedPrefixes) {
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
        const prefixName = prefix.replace('-', '').replace('-', '');
        const hasPrefix = css.includes(prefix);
        
        if (!hasPrefix) {
            results.allExpectedPrefixes = false;
            results.missingPrefixes.push(prefix);
        }
    });

    return results;
}

// 生成测试报告
export function generateTestReport(testResults) {
    const report = {
        summary: {
            total: testResults.length,
            passed: testResults.filter(r => r.success).length,
            failed: testResults.filter(r => !r.success).length,
            successRate: 0
        },
        categories: {},
        details: testResults
    };

    // 计算成功率
    report.summary.successRate = (report.summary.passed / report.summary.total * 100).toFixed(2);

    // 按类别分组
    testResults.forEach(result => {
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