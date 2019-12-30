import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, message } from 'antd'
import Modal from '../shared/modal'
@inject('stores')
@observer
export default class EditPasswordModal extends Component {

    handleSubmit = async (values) => {
        if (values.newpassword !== values.repassword) {
            message.error("两次输入密码不相同");
            return false;
        }
        const result = await this.props.stores.userStore.editPassword(values.oldpassword, values.newpassword)
        if (result.status === 200 || result.status === 204) {
            message.success("密码修改成功！")
        }
        else{
            return false; 
        }
    }

    render() {
        return (
            <Modal
                title="修改密码"
                loading={false}
                visible={this.props.visible}
                onSubmit={this.handleSubmit}
                items={[
                    {
                        title: "旧密码", name: "oldpassword",
                        rules: [{ required: true, message: '请输入旧密码', }],
                        render: <Input type="password" size="large" placeholder="请输入旧密码" />
                    },
                    {
                        title: "新密码", name: "newpassword",
                        rules: [{ required: true, message: '请输入新的密码', }],
                        render: <Input type="password" size="large" placeholder="请输入新的密码" />
                    },
                    {
                        title: "确认密码", name: "repassword",
                        rules: [{ required: true, message: '请再输入一遍新密码', }],
                        render: <Input type="password" size="large" placeholder="请再输入一遍新密码" />
                    }
                ]}
            />
        )
    }
}
