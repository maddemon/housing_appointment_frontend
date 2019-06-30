const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/house', {
        target: 'http://house.287jw.cn/',
        changeOrigin: true
    }));
};
