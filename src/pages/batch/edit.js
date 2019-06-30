import React, { Component } from 'react'
import { Button } from 'antd'
import Modal from '../shared/modal'
import { inject, observer } from 'mobx-react'
import moment from 'moment'

@inject('stores')
@observer
export default class BatchEditModal extends Component {

    handleSubmit = async (data) => {
        data.appointmentTimeStart = data.appointmentTimeStart.format('YYYY-MM-DD HH:mm:ss')
        data.appointmentTimeEnd = data.appointmentTimeEnd.format('YYYY-MM-DD HH:mm:ss')
        data.chooseTime = data.chooseTime.format('YYYY-MM-DD')
        const result = await this.props.stores.batchStore.save(data);
        if (this.props.onSubmit) {
            this.props.onSubmit(result)
        }
        return result.status === '200';
    }

    getFormItems = () => {
        const model = this.props.model || {}
        return [
            { name: 'uuid', defaultValue: model.uuid, type: "hidden" },
            { title: '名称', name: 'name', defaultValue: model.name, rules: [{ required: true , message: '请填写批次名称'}], },
            { title: '房屋数量', name: 'houseNumber', defaultValue: model.houseNumber, type: "number", rules: [{ required: true , message: '请填写房屋数量'}], },
            { title: '房屋地址', name: 'houseAddress', defaultValue: model.houseAddress, rules: [{ required: true, message: '请填写房屋地址' }], },
            { title: '选房日期', name: 'chooseTime', defaultValue: moment(model.chooseTime), type: "date", rules: [{ required: true, message: '请选择选房日期' }], },
            { title: '预约开始时间', name: 'appointmentTimeStart', defaultValue: moment(model.appointmentTimeStart), type: "datetime", rules: [{ required: true , message: '请选择预约开始时间'}], },
            { title: '预约截止时间', name: 'appointmentTimeEnd', defaultValue: moment(model.appointmentTimeEnd), type: "datetime", rules: [{ required: true, message: '请选择预约结束时间' }], },
        ];
    }

    render() {
        return (
            <Modal
                title={this.props.title || '修改批次'}
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger || <Button>修改</Button>}
                items={this.getFormItems()}
                loading={this.props.stores.batchStore.loading}
            >
            </Modal>
        )
    }
}

