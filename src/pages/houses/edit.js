import React, { Component } from 'react'
import { Button } from 'antd'
import Modal from '../shared/modal'
import { inject, observer } from 'mobx-react'

@inject('stores')
@observer
export default class HousesEditModal extends Component {

    handleSubmit = async (data) => {
        const result = await this.props.stores.housesStore.save(data);
        if (this.props.onSubmit) {
            this.props.onSubmit(result)
        }
        return result.status === '200';
    }

    getFormItems = () => {
        const model = this.props.model || {}
        return [
            { name: 'housesUuid', defaultValue: model.uuid, type: "hidden" },
            { title: '名称', name: 'name', defaultValue: model.name, rules: [{ required: true, message: '此项没有填写' }], },
        ];
    }

    render() {
        return (
            <Modal
                title={this.props.title || '修改楼盘'}
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger || <Button>修改</Button>}
                items={this.getFormItems()}
                loading={this.props.stores.housesStore.loading}
            >
            </Modal>
        )
    }
}

