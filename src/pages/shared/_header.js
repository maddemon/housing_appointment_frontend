import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Row, Col, Menu, Icon } from 'antd'
import Config from '../../common/config';
import { Link } from 'react-router-dom'

@inject('stores')
@observer
class TopNavbar extends Component {

    state = { current: ['/'] }

    handleMenuClick = menu => {
        this.setState({ current: [menu.key] });
        if (menu.key === 'user_logout') {
            this.props.stores.userStore.logout();
            this.props.history.push('/user/login');
        }
    }

    getMenuItems = (identity) => {
        let result = [];
        if (!identity) {
            return null;
        }
        switch (identity.roleId) {
            case 1:
                result = [
                    <Menu.Item key="/" >
                        <Link to="/">
                            <Icon type="ordered-list" />我的指标
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="user_appointments" >
                        <Link to="/user/reserves">
                            <Icon type="calendar" />我的预约
                        </Link>
                    </Menu.Item>
                ];
                break;
            case 2:
            case 3:
                result = [
                    <Menu.Item key="manager_user_index" >
                        <Link to="/user/index">
                            <Icon type="usergroup-add" />用户管理
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="manager_batch_index" >
                        <Link to="/batch/index">
                            <Icon type="import" />批次管理
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="manager_quota_index" >
                        <Link to="/quota/index">
                            <Icon type="switcher" />指标管理
                        </Link>
                    </Menu.Item>,
                ];
                break;
            default:
                break;
        }
        result = result.concat([
            <Menu.Item key="user_editpassword">
                <Link to="/user/editpassword">
                    <Icon type="key" />修改密码
                </Link>
            </Menu.Item>,
            <Menu.Item key="user_logout">
                <Icon type="poweroff" />退出
            </Menu.Item>
        ])
        return result;
    }

    render() {
        const identity = this.props.stores.userStore.current;
        return (
            <Row>
                <Col xs={24} sm={24} md={5} lg={5} xl={5} xxl={4} className="logo"  >
                    <h1 style={{ lineHeight: '64px', color: "#fff" }}>{Config.SystemName}</h1>
                </Col>
                <Col xs={0} sm={0} md={19} log={19} xl={19} xxl={20}>
                    <Menu onClick={this.handleMenuClick} mode="horizontal" selectedKeys={this.state.current} theme="dark" style={{ lineHeight: '64px' }}>
                        {this.getMenuItems(identity)}
                    </Menu>
                </Col>
            </Row>
        )
    }
}

export default withRouter(TopNavbar)