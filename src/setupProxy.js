const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/job-market/api",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: process.env.REACT_APP_JOBMARKET_API_BASE_URL,
        secure: false
    });

    app.use(appProxy);
};
