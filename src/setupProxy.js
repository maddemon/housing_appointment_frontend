if (process.env.NODE_ENV === 'development') {
    const proxy = require('http-proxy-middleware');
    module.exports = function (app) {
        app.use(proxy('/api', {
            target: 'http://localhost:54048/',
            changeOrigin: true
        }));
    };
}