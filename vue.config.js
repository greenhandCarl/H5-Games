module.exports = {
    lintOnSave: true,
    productionSourceMap: true,
    assetsDir: "./",
    publicPath: "./",
    pages: {
        index: 'src/main.ts',
        wordDrag: {
            entry: 'src/pages/wordDrag/main.ts',
            template: 'public/wordDrag.html',
            filename: 'wordDrag.html'
        },
        wordMatch: {
            entry: 'src/pages/wordMatch/main.ts',
            template: 'public/wordMatch.html',
            filename: 'wordMatch.html'
        },
    }
}