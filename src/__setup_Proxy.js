const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/job-market/api",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://api-jobmarket.tenx.local:7000',
        secure: false
    });

    app.use(appProxy);
};
