import { defineConfig } from '@rsbuild/core';

export default defineConfig({
    source: {
        entry: {
            'postcss-transform-web-worker': './worker.js',
        }
    },
    output: {
        target: 'web-worker',
        minify: false,
        filenameHash: false,
    },
    performance: {
        chunkSplit: {
            strategy: 'all-in-one'
        }
    },
});
