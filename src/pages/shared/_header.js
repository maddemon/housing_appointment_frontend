import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Row, Col, Menu, Icon } from 'antd'
import Config from '../../common/config';
const { SubMenu } = Menu;

@inject('stores')
@observer
class TopNavbar extends Component {

    state = { current: [this.props.location.pathname] }

    handleMenuClick = async menu => {
        if (menu.key === '/user/logout') {
            await this.props.stores.userStore.logout();
            await this.props.history.push('/user/login')
            await this.setState({ current: ['/user/login'] })
        } else {
            this.setState({ current: [menu.key] });
            this.props.history.push(menu.key);
        }
    }

    getMenuItems = (identity) => {
        let result = [
            <Menu.Item key="/" ><Icon type="home" />首页</Menu.Item>,
        ];
        if (identity) {
            switch (identity.role) {
                case 'user':
                    result = result.concat([
                        <Menu.Item key="/my/quotas" ><Icon type="ordered-list" />预约选房</Menu.Item>,
                        <Menu.Item key="/my/appointments" ><Icon type="calendar" />我的预约</Menu.Item>
                    ]);
                    break;
                case 'admin':
                    result = result.concat([
                        <Menu.Item key="/houses/index" ><Icon type="build" />楼盘管理</Menu.Item>,
                        <Menu.Item key="/batch/index" ><Icon type="import" />批次管理</Menu.Item>,
                        <Menu.Item key="/permit/index" ><Icon type="switcher" />准购证管理 </Menu.Item>,
                        <Menu.Item key="/user/index" ><Icon type="usergroup-add" />用户管理</Menu.Item>,
                    ]);
                    break;
                default:
                    break;
            }
            result = result.concat(
                <SubMenu key="user"
                    title={
                        <span><Icon type="user"></Icon>{identity.name}</span>
                    }
                >
                    <Menu.Item key="/user/editpassword"><Icon type="key" />修改密码</Menu.Item>
                    <Menu.Item key="/user/logout"> <Icon type="poweroff" />退出 </Menu.Item>
                </SubMenu>
            )
        } else {
            result = result.concat([
                <Menu.Item key="/user/login"><Icon type="user" />登录</Menu.Item>,
            ]);
        }
        return result;
    }

    render() {
        const identity = this.props.stores.userStore.current();
        return (
            <Row>
                <Col xs={15} sm={15} md={5} lg={5} xl={5} xxl={4} className="logo"  >
                    <h1 style={{ lineHeight: '64px', color: "#fff" }}><Link to="/">{Config.SystemName}</Link></h1>
                </Col>
                <Col xs={9} sm={9} md={19} log={19} xl={19} xxl={20}>
                    <Menu onClick={this.handleMenuClick} mode="horizontal" selectedKeys={this.state.current} theme="dark" style={{ lineHeight: '64px' }}>
                        {this.getMenuItems(identity)}
                    </Menu>
                </Col>
            </Row>
        )
    }
}

export default withRouter(TopNavbar)