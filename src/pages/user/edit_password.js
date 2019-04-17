import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { PageHeader, Form, Icon, Input, Button, Row, Col, message } from 'antd'

@inject('stores')
@observer
class EditPasswordPage extends Component {

    state = { loading: false }

    componentWillMount() {
        this.props.stores.globalStore.setTitle('修改密码');
    }

    handleSubmit = (e) => {
        this.setState({ loading: true });
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                if (values.newpassword !== values.repassword) {
                    message.warn("两次输入密码不相同");
                    this.setState({ loading: false })
                    return false;
                }
                await this.props.stores.userStore.editPassword(values.oldpassword, values.newpassword)
                message.success("修改完成")
            } else {
                this.setState({ loading: false });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Row>
                <PageHeader title="修改密码" />
                <Col xxl={{ span: 8, offset: 8 }} xl={{ span: 8, offset: 8 }} lg={{ span: 12, offset: 12 }}>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label="旧密码">
                            {getFieldDecorator('oldpassword', { rules: [{ required: true, message: '请输入旧密码', }], })(
                                <Input type="password" size="large" placeholder="请输入旧密码" />
                            )}
                        </Form.Item>
                        <Form.Item label="新密码">
                            {getFieldDecorator('newpassword', { rules: [{ required: true, message: '请输入新的密码', }], })(
                                <Input type="password" size="large" placeholder="请输入新的密码" />
                            )}
                        </Form.Item>
                        <Form.Item label="确认密码">
                            {getFieldDecorator('repassword', { rules: [{ required: true, message: '请再输入一遍新密码', }], })(
                                <Input type="password" size="large" placeholder="请再输入一遍新密码" />
                            )}
                        </Form.Item>
                        <Form.Item className="additional">
                            <Button size="large" loading={this.state.loading} type="primary" htmlType="submit">
                                <Icon type="check" />提交
                            </Button>
                        </Form.Item>

                    </Form>
                </Col>
            </Row>
        )
    }
}
const editPasswordPage = Form.create()(EditPasswordPage);
export default editPasswordPage;