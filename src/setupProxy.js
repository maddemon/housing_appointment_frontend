if (process.env.NODE_ENV === 'development') {
    const proxy = require('http-proxy-middleware');
    module.exports = function (app) {
        app.use(proxy('/house', {
            target: 'http://thomson2.natapp1.cc/',
            changeOrigin: true
        }));
    };
}