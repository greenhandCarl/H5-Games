module.exports = {
    lintOnSave: true,
    productionSourceMap: true,
    assetsDir: "./",
    publicPath: "./",
    pages: {
        index: 'src/main.ts',
        page1: {
            entry: 'src/pages/wordDrag/main.ts',
            template: 'public/wordDrag.html',
            filename: 'wordDrag.html'
        },
        page2: {
            entry: 'src/pages/page2/main.ts',
            template: 'public/page2.html',
            filename: 'page2.html'
        },
        page3: {
            entry: 'src/pages/crossBridge/main.ts',
            template: 'public/crossBridge.html',
            filename: 'crossBridge.html'
        },
    }
}