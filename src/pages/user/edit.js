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
        if (result.status === '200') {
            message.success(this.props.title + '完成')
            return true;
        }
        return false;
    }

    getFormItems = () => {
        const model = this.props.model || {}
        return [
            { name: 'uuid', defaultValue: model.uuid, type: "hidden" },
            {
                title: '证件类型',
                name: 'cardType',
                defaultValue: model.cardType,
                type: 'select',
                props: {
                    options: [
                        { text: '身份证', value: 1 },
                        { text: '军官证', value: 2 },
                        { text: '护照', value: 3 }
                    ]
                }
            },
            { title: '证件号码', name: 'idcard', defaultValue: model.idcard, },
            { title: '姓名', name: 'name', defaultValue: model.name, },
            { title: '手机', name: 'phone', defaultValue: model.phone, },
            { title: '优先级', name: 'priority', defaultValue: model.priority, },
        ];
    }

    render() {
        return (
            <Modal
                title={this.props.title || '修改用户'}
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger || <Button>修改</Button>}
                items={this.getFormItems()}
            >
            </Modal>
        )
    }
}

