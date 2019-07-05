import React, { Component } from 'react'
import { Button } from 'antd'
import Modal from '../shared/modal'
import { inject, observer } from 'mobx-react'

@inject('stores')
@observer
export default class BuildingEditModal extends Component {

    handleSubmit = async (data) => {

        const result = await this.props.stores.buildingStore.save(data);
        if (this.props.onSubmit) {
            this.props.onSubmit(result)
        }
        return result.status === '200';
    }

    getFormItems = () => {
        const model = this.props.model || {}
        return [
            { name: 'uuid', defaultValue: model.uuid, type: "hidden" },
            { title: '名称', name: 'name', defaultValue: model.name, rules: [{ required: true, message: '此项没有填写' }], },
            { title: '楼层数', name: 'floorNumber', defaultValue: model.floorNumber, type: "number", rules: [{ required: true, message: '此项没有填写' }], },
            { title: '单元数', name: 'unitNumber', defaultValue: model.unitNumber, type: "number", rules: [{ required: true, message: '此项没有填写' }], },
            { title: '每梯户数', name: 'doorNumber', defaultValue: model.doorNumber, type: "number", rules: [{ required: true, message: '此项没有填写' }], },
        ];
    }

    render() {
        return (
            <Modal
                title={this.props.title || '修改楼盘'}
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger || <Button>修改</Button>}
                items={this.getFormItems()}
                loading={this.props.stores.buildingStore.loading}
            >
            </Modal>
        )
    }
}

