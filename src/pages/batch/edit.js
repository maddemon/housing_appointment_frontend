import React, { Component } from 'react'
import { Button, message } from 'antd'
import Modal from '../shared/modal'
import { inject, observer } from 'mobx-react'
import moment from 'moment'

@inject('stores')
@observer
export default class BatchEditModal extends Component {

    handleSubmit = async (data) => {
        const result = await this.props.stores.batchStore.save(data);
        if (result.status === '200') {
            message.success(this.props.title + '完成');
            return true;
        }
        return false;
    }

    getFormItems = () => {
        const model = this.props.model || {}
        return [
            { name: 'uuid', defaultValue: model.uuid, type: "hidden" },
            { title: '名称', name: 'name', defaultValue: model.name, },
            { title: '房屋数量', name: 'houseNumber', defaultValue: model.houseNumber, type: "number" },
            { title: '房屋地址', name: 'houseAddress', defaultValue: model.houseAddress, },
            { title: '选房日期', name: 'chooseTime', defaultValue: moment(model.chooseTime), type: "date" },
            { title: '预约开始时间', name: 'appointmentTimeStart', defaultValue: moment(model.appointmentTimeStart), type: "datetime" },
            { title: '预约截止时间', name: 'appointmentTimeEnd', defaultValue: moment(model.appointmentTimeEnd), type: "datetime" },
        ];
    }

    render() {
        return (
            <Modal
                title={this.props.title || '修改批次'}
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger || <Button>修改</Button>}
                items={this.getFormItems()}
            >
            </Modal>
        )
    }
}

