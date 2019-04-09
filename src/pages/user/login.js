import React, { Component } from 'react'
import Config from '../../common/config.js'
import { Form, Icon, Input, Button, Row, Col } from 'antd'
import { inject, observer } from 'mobx-react';

@inject('stores')
@observer
class UserLoginPage extends Component {
    state = { loading: false }
    componentWillMount() {
        console.log('login')
        this.props.stores.globalStore.setTitle('用户登录');
    }

    handleSubmit = (e) => {
        this.setState({ loading: true });
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.stores.userStore.login(values.username, values.password)
                this.props.history.push('/')
            } else {
                this.setState({ loading: false });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Row className="login">
                <Col xs={24} sm={24} md={8} lg={{ span: 6, offset: 9 }}>
                    <img src="/images/logo.png" alt="logo" />
                    <h1>
                        {Config.SystemName}
                    </h1>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item>
                            {getFieldDecorator('username', { rules: [{ required: true, message: '请输入账户名！', }], })(
                                <Input size="large" prefix={<Icon type="user" />} placeholder="用户名" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', { rules: [{ required: true, message: '请输入密码！', }], })(
                                <Input size="large" prefix={<Icon type="lock" />} type="password" placeholder="密码" />
                            )}
                        </Form.Item>

                        <Form.Item className="additional">
                            <Button size="large" loading={this.state.loading} type="primary" htmlType="submit">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>

                </Col>
            </Row>
        );
    }
}

const LoginPage = Form.create()(UserLoginPage);
export default LoginPage;