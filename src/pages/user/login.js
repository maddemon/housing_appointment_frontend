import React, { Component } from 'react'
import { Form, Icon, Input, Button, Row, Col } from 'antd'
import { inject, observer } from 'mobx-react';
import { QueryString } from '../../common/utils'
import ShareForm from '../shared/form'
@inject('stores')
@observer
export default class UserLoginPage extends Component {

    state = { getTimes: 0, seconds: 0 }

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
        const getTimes = this.state.getTimes + 1;
        this.setState({ seconds: 60, getTimes: getTimes })
        const timer = setInterval(this.updateSeconds, 1000);
        this.setState({ timer })
    }

    handleSubmit = async (formData) => {
        const response = await this.props.stores.userStore.login(formData.username, formData.password)
        if (response && response.status === '200') {
            const query = QueryString.parseJSON(this.props.location.seach)
            this.props.history.push(query.returnUrl || '/')
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
                    <h1>
                        用户登录
                    </h1>
                    <ShareForm
                        loading={this.props.stores.userStore.loading}
                        onSubmit={this.handleSubmit}
                        items={[
                            {
                                title: '手机号',
                                name: 'username',
                                placeholder: '请输入手机号',
                                size: 'large',
                                rules: [{ required: true, message: '此项没有填写', }]
                            },
                            {
                                title: '验证码',
                                name: 'password',
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

                </Col>
            </Row >
        );
    }
}