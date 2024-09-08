import { defineConfig } from 'umi';

export default defineConfig({
    // 配置主题，实际上是配 less 变量（Ant Design 的样式变量）。
    theme: {
        headerBg: '#1890FF',
        //全局主色
        '@primary-color': '#1890FF',  // 更多变量说明：https://ant.design/docs/react/customize-theme-cn
        '@layout-header-background': '#40a9ff', // Header 背景颜色
    },
    // 配置全局标题。
    title: 'Master',
    // 配置mock 模拟数据 默认为true。
    mock: false,
    // 配置是否让生成的文件包含 hash 后缀，通常用于增量发布和避免浏览器加载缓存。
    hash: true,
    history: {
        type: 'browser' // 可选 browser、hash 和 memory
    },
    //配置路由 注：如果没有 routes 配置，Umi 会进入约定式路由模式，然后分析 src/pages 目录拿到路由配置。
    routes: [
        { path: '/', component: '@/pages/index' },
    ],
    // 本地开发API接口请求代理
    proxy: {
        '/': {
            target: 'http://localhost:8888/',
            changeOrigin: true,
        }
    },
});
