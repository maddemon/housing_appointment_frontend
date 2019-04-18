import React, { Component } from 'react'
import { Button } from 'antd'
import Modal from '../shared/modal'
import { inject, observer } from 'mobx-react'

@inject('stores')
@observer
export default class UserEditModal extends Component {

    handleSubmit = async (data) => {
        return await this.props.stores.userStore.save(data);
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

