const webpack = require('webpack');
const WorkBoxPlugin = require('workbox-webpack-plugin');

module.exports = {
    webpack: function (config) {
        config.resolve.fallback = {
            process: require.resolve('process/browser'),
            // zlib: require.resolve('browserify-zlib'),
            stream: require.resolve('stream-browserify'),
            crypto: require.resolve('crypto-browserify'),
            util: require.resolve('util'),
            buffer: require.resolve('buffer')
            // asset: require.resolve('assert')
        };

        // https://stackoverflow.com/questions/69135310/workaround-for-cache-size-limit-in-create-react-app-pwa-service-worker
        config.plugins.forEach((plugin) => {
            if (plugin instanceof WorkBoxPlugin.InjectManifest) {
                plugin.config.maximumFileSizeToCacheInBytes = 50 * 1024 * 1024;
            }
        });

        config.plugins = [
            ...config.plugins,
            new webpack.ProvidePlugin({
                process: 'process/browser.js',
                Buffer: ['buffer', 'Buffer']
            })
        ];

        return config;
    },
    devServer: function (configFunction) {
        // Return the replacement function for create-react-app to use to generate the Webpack
        // Development Server config. "configFunction" is the function that would normally have
        // been used to generate the Webpack Development server config - you can use it to create
        // a starting configuration to then modify instead of having to create a config from scratch.
        return function (proxy, allowedHost) {
            // Create the default config by calling configFunction with the proxy/allowedHost parameters
            const config = configFunction(proxy, allowedHost);

            // Change the https certificate options to match your certificate, using the .env file to
            // set the file paths & passphrase.
            const fs = require('fs');
            config.https = {
                key: fs.readFileSync(process.env.SSL_KEY_FILE, 'utf8'),
                cert: fs.readFileSync(process.env.SSL_CRT_FILE, 'utf8')
            };

            // Return your customised Webpack Development Server config.
            return config;
        };
    }
}