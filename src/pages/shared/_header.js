import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Layout, Row, Col, Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
import Config from '../../common/config';


@inject('stores')
@observer
export default class Header extends Component {

    state = { current: ['/'] }

    handleMenuClick = menu => {
        this.setState({ current: [menu.key] });
    }

    getMenuItems = (identity) => {
        let result = [];
        if (identity) {
            switch (identity.role) {
                case 1:
                    result = [
                        <Menu.Item key="user_quotas" >
                            <Link to="/my/quotas">
                                <Icon type="ordered-list" />我的指标
                            </Link>
                        </Menu.Item>,
                        <Menu.Item key="user_appointments" >
                            <Link to="/my/reserves">
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
                    <Link to="/user/editpassword"></Link>
                    <Icon type="key" />修改密码
                </Menu.Item>,
                <Menu.Item key="user_logout">
                    <Link to="/user/logout">
                        <Icon type="poweroff" />退出
                    </Link>
                </Menu.Item>
            ])
        }
        return result;
    }

    render() {
        const identity = this.props.stores.userStore.current;
        return (
            <Layout>
                <Row>
                    <Col xs={24} sm={24} md={5} lg={5} xl={5} xxl={4}>
                        <Link to="/" className="logo"><h1>{Config.SystemName}</h1></Link>
                    </Col>
                    <Col xs={0} sm={0} md={19} log={19} xl={19} xxl={20}>
                        <Menu onClick={this.handleMenuClick} mode="horizontal" selectedKeys={this.state.current}>
                            {this.getMenuItems(identity)}
                        </Menu>
                    </Col>
                </Row >
            </Layout>
        )
    }
}