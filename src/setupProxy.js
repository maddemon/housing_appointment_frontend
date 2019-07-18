const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/house', {
        target: 'http://house.ayouayou.com/',
        changeOrigin: true
    }));
};
