import React, { Component } from 'react'
import { Button, message } from 'antd'
import Modal from '../shared/modal'
import { inject, observer } from 'mobx-react'

@inject('stores')
@observer
export default class UserEditModal extends Component {

    handleSubmit = async (data) => {
        const result = await this.props.stores.userStore.save(data);
        if (!result) return false;

        if (this.props.onSubmit) {
            this.props.onSubmit(result)
        }
        return result.status === 204;
    }

    getFormItems = () => {
        const model = this.props.model || {}
        return [
            { name: 'id', defaultValue: model.id, type: "hidden" },
            { title: '证件号码', name: 'idCard', defaultValue: model.idCard, rules: [{ required: true, message: '请填写证件号码' }], },
            { title: '姓名', name: 'name', defaultValue: model.name, rules: [{ required: true, message: '请填写姓名' }], },
            { title: '手机', name: 'phone', defaultValue: model.phone, rules: [{ required: true, message: '请填写手机号码' }], },
        ];
    }

    render() {
        return (
            <Modal
                title={this.props.title || '修改用户'}
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger || <Button>修改</Button>}
                items={this.getFormItems()}
                loading={this.props.stores.userStore.loading}
            >
            </Modal>
        )
    }
}

