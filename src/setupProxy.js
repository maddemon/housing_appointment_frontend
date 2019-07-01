const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/house', {
        target: 'http://loan.shuaibosys.com/',
        changeOrigin: true
    }));
};
