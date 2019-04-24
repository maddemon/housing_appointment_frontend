const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/house', {
        target: 'http://thomson.natapp1.cc/',
        changeOrigin: true
    }));
};