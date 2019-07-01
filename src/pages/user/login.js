import React, { Component } from 'react'
import { Form, Icon, Input, Button, Row, Col } from 'antd'
import { inject, observer } from 'mobx-react';
import { QueryString } from '../../common/utils'

@inject('stores')
@observer
class UserLoginPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('用户登录');
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const response = await this.props.stores.userStore.login(values.username, values.password)
                if (response.status === '200') {
                    const query = QueryString.parseJSON(this.props.location.seach)
                    this.props.history.push(query.returnUrl || '/')
                }
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Row className="login">
                <Col xs={24} sm={24} md={8} lg={{ span: 6, offset: 9 }}>
                    <h1>
                        用户登录
                    </h1>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item>
                            {getFieldDecorator('username', { rules: [{ required: true, message: '请输入账户名！', }], })(
                                <Input size="large" prefix={<Icon type="user" />} placeholder="请输入手机号" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', { rules: [{ required: true, message: '请输入密码！', }], })(
                                <Input size="large" prefix={<Icon type="lock" />} type="password" placeholder="密码" />
                            )}
                        </Form.Item>

                        <Form.Item className="additional">
                            <Button size="large" loading={this.props.stores.userStore.loading} type="primary" htmlType="submit">
                                <Icon type="login" />登录
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