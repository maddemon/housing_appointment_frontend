import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'

@inject('stores')
@observer
export default class HomePage extends Component {
    componentWillMount() {
        console.log('login')
        this.props.stores.globalStore.setTitle('首页');
    }
    render() {
        return (
            <div>
                <Link to="/user/login">用户登录</Link><br />
                <Link to="/user/quotas"> 我的指标 </Link><br />
                <Link to="/user/reserves"> 我的预约 </Link><br />
                <Link to="/user/index">用户管理</Link><br />
                <Link to="/batch/index">批次管理</Link><br />
                <Link to="/quota/index">指标管理</Link><br />
                <Link to="/reserve/index">预约管理</Link><br />
                <Link to="/user/editpassword">修改密码</Link><br />
            </div>
        )
    }
}
