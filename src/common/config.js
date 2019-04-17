const config = {
    SystemName: '房产预约系统',
    Version: '0.1.0',
    Host: process.env.NODE_ENV === 'production' ? 'http://lljxk.qianjingji.cn/' : 'http://lljxk.qianjingji.cn/',
    ApiPath: '/house/',
    UserRole: {
        Guest: 0,
        User: 1,
        Manager: 2,
        Administrator: 3
    }
}

export {
    config as default
}