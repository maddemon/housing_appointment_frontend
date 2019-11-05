import React, { Component } from 'react'
import { Icon, Button, Row, Col, Tabs } from 'antd'
import { inject, observer } from 'mobx-react';
import { QueryString } from '../../common/utils'
import ShareForm from '../shared/form'
import LoginLogo from './_login_logo'

@inject('stores')
@observer
export default class AdminLoginPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('用户登录');
    }

    handleSubmit = async (formData) => {
        const response = await this.props.stores.userStore.login(formData)
        if (response && response.ok) {
            const query = QueryString.parseJSON(this.props.location.seach)
            this.props.history.push(query.returnUrl || '/')
        }
    }

    render() {
        return (
            <div className="container login-page">
                <LoginLogo />
                <Row className="login">
                    <Col xs={{ span: 20, offset: 2 }} sm={{ span: 16, offset: 4 }} md={{ span: 12, offset: 6 }} lg={{ span: 6, offset: 9 }} xl={{ span: 4, offset: 10 }}>
                        <Tabs animated={false}>
                            <Tabs.TabPane tab="密码登录" key="manager">
                                <ShareForm
                                    loading={this.props.stores.userStore.loading}
                                    onSubmit={this.handleSubmit}
                                    items={[
                                        {
                                            name: 'name',
                                            placeholder: '用户名',
                                            size: 'large',
                                            rules: [{ required: true, message: '此项没有填写', }]
                                        },
                                        {
                                            name: 'password',
                                            placeholder: '密码',
                                            size: 'large',
                                            type: 'password',
                                            rules: [{ required: true, message: '此项没有填写', }],
                                        }
                                    ]}
                                    buttons={[
                                        <Button size="large" loading={this.props.stores.userStore.loading} type="primary" htmlType="submit" block>
                                            <Icon type="login" />登录
                                        </Button>
                                    ]}
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    </Col>
                </Row >
            </div>
        );
    }
}