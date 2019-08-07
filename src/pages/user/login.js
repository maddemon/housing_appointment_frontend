import React, { Component } from 'react'
import { Icon, Button, Row, Col, Tabs, Input, message } from 'antd'
import { inject, observer } from 'mobx-react';
import { QueryString } from '../../common/utils'
import ShareForm from '../shared/form'
@inject('stores')
@observer
export default class UserLoginPage extends Component {

    state = { mobile: null, getTimes: 0, seconds: 0 }

    componentWillMount() {
        this.props.stores.globalStore.setTitle('用户登录');
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    updateSeconds = () => {
        if (this.state.seconds < 1) {
            clearInterval(this.state.timer);
            this.setState({ seconds: 0, timer: null });
        }
        else {
            const seconds = this.state.seconds - 1;
            this.setState({ seconds })
        }
    }

    handleVerifyCodeClick = () => {
        if (!this.state.mobile) {
            message.error("手机号码填写不正确");
            return false;
        }

        this.props.stores.userStore.sendVerifyCode(this.state.mobile)
        const getTimes = this.state.getTimes + 1;
        this.setState({ seconds: 60, getTimes: getTimes })
        const timer = setInterval(this.updateSeconds, 1000);
        this.setState({ timer })
    }

    handleSubmit = async (formData) => {
        const response = await this.props.stores.userStore.login(formData)
        if (response && response.status === '200') {
            const query = QueryString.parseJSON(this.props.location.seach)
            this.props.history.push(query.returnUrl || '/')
        }
    }

    handleMobileChange = (e) => {
        const mobile = e.target.value;
        if ((/^1(3|4|5|6|7|8|9)\d{9}$/g).test(mobile)) {
            this.setState({ mobile: e.target.value })
        }
    }

    getVerifyCodeButtonText = () => {
        if (this.state.getTimes > 0) {
            if (this.state.seconds > 0) {
                return `${this.state.seconds}秒后重新获取`;
            }
            else {
                return `重新获取验证码`;
            }
        }
        return "获取验证码";
    }

    render() {
        return (
            <Row className="login">
                <Col xs={24} sm={24} md={8} lg={{ span: 6, offset: 9 }}>
                    <Tabs>
                        <Tabs.TabPane tab="用户登录" key="member">
                            <ShareForm
                                loading={this.props.stores.userStore.loading}
                                onSubmit={this.handleSubmit}
                                items={[
                                    {
                                        title: '手机号',
                                        name: 'account',
                                        placeholder: '请输入手机号',
                                        size: 'large',
                                        rules: [{ required: true, message: '此项没有填写', }],
                                        render: <Input onChange={this.handleMobileChange}></Input>
                                    },
                                    {
                                        title: '验证码',
                                        name: 'code',
                                        placeholder: '短信验证码',
                                        size: 'large',
                                        rules: [{ required: true, message: '此项没有填写', }],
                                        after: (
                                            <Button type="primary" onClick={this.handleVerifyCodeClick} disabled={this.state.seconds > 0}>
                                                {this.getVerifyCodeButtonText()}
                                            </Button>
                                        )
                                    }
                                ]}
                                buttons={[
                                    <Button size="large" loading={this.props.stores.userStore.loading} type="primary" htmlType="submit" block>
                                        <Icon type="login" />登录
                                    </Button>
                                ]}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="管理登录" key="manager">
                            <ShareForm
                                loading={this.props.stores.userStore.loading}
                                onSubmit={this.handleSubmit}
                                items={[
                                    {
                                        title: '用户名',
                                        name: 'account',
                                        placeholder: '请输入账号名称',
                                        size: 'large',
                                        rules: [{ required: true, message: '此项没有填写', }]
                                    },
                                    {
                                        title: '密码',
                                        name: 'password',
                                        placeholder: '请输入账号密码',
                                        size: 'large',
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
        );
    }
}