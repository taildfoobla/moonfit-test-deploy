const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ])
    config.ignoreWarnings = [/no such file or directory/];
    return config;
}