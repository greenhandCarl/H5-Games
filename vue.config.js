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
        crossBridge: {
            entry: 'src/pages/crossBridge/main.ts',
            template: 'public/crossBridge.html',
            filename: 'crossBridge.html'
        },
        sinkSubmarine: {
            entry: 'src/pages/sinkSubmarine/main.ts',
            template: 'public/sinkSubmarine.html',
            filename: 'sinkSubmarine.html'
        },
        dumpAirship: {
            entry: 'src/pages/dumpAirship/main.ts',
            template: 'public/dumpAirship.html',
            filename: 'dumpAirship.html'
        },
        bubbleJab: {
            entry: 'src/pages/bubbleJab/main.ts',
            template: 'public/bubbleJab.html',
            filename: 'bubbleJab.html'
        },
        grabJellyfish: {
            entry: 'src/pages/grabJellyfish/main.ts',
            template: 'public/grabJellyfish.html',
            filename: 'grabJellyfish.html'
        },
        pageTurn: {
            entry: 'src/pages/pageTurn/main.ts',
            template: 'public/pageTurn.html',
            filename: 'pageTurn.html'
        },
        listenChoose: {
            entry: 'src/pages/listenChoose/main.ts',
            template: 'public/listenChoose.html',
            filename: 'listenChoose.html'
        }
    }
}