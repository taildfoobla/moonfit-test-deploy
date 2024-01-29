const CracoAntDesignPlugin = require("craco-antd")
const path = require("path")

module.exports = {
    eslint: {
        enable: false
    },
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeTheme: {
                    "primary-color": "#4CCBC9",
                    "text-color": "#A8ADC3",
                    "heading-color": "#FFFFFF",
                    "input-bg": "#250E3A",
                    "font-family": "'Darker Grotesque', sans-serif",
                    "font-size-base": "18px",
                    "line-height-base": "26px",
                    "body-background": "#020722",
                    "btn-font-weight": 800,
                    "btn-height-base": "50px",
                    "btn-padding-horizontal-base": "18px",
                    "btn-border-radius-base": "5px",
                    "btn-primary-color": "#020722",
                    "btn-line-height": "49px",
                    "input-padding-vertical-base": "10px",
                    "input-padding-horizontal-base": "15px",
                    "control-border-radius": "5px",
                    "input-border-color": "#250E3A",
                    "link-color": "#FFFFFF"
                },
                lessLoaderOptions: {
                    additionalData: `
                        @import "src/assets/less/variables.less";
                    `
                }
            },
        },
        // {
        //     process: 'process/browser',
        //     Buffer: ['buffer', 'Buffer']
        // }
    ],
    webpack: {
        alias: {
            "@svgPath": path.resolve(__dirname, "src/assets/svg"),
            "@imgPath": path.resolve(__dirname, "src/assets/images"),
            "@configPath": path.resolve(__dirname, "src/assets/configs")
        }
    },
    resolve: {
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "assert": require.resolve("assert"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "os": require.resolve("os-browserify"),
            "url": require.resolve("url")
        }
    }
}
