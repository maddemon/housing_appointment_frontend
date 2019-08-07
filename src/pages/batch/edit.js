import React, { Component } from 'react'
import { Button, Select } from 'antd'
import Modal from '../shared/modal'
import { inject, observer } from 'mobx-react'
import moment from 'moment'

@inject('stores')
@observer
export default class BatchEditModal extends Component {

    state = { selectedHouses: (this.props.model || {}).houses || [] }

    handleSubmit = async (data) => {
        data.appointmentTimeStart = data.appointmentTimeStart.format('YYYY-MM-DD HH:mm:ss')
        data.appointmentTimeEnd = data.appointmentTimeEnd.format('YYYY-MM-DD HH:mm:ss')
        data.chooseTime = data.chooseTime.format('YYYY-MM-DD HH:mm:ss')
        const result = await this.props.stores.batchStore.save(data);
        if (this.props.onSubmit) {
            this.props.onSubmit(result)
        }
        return result.status === '200';
    }

    handleChooseHouses = (selectedItems) => {
        this.setState({ selectedHouses: selectedItems })
    }

    getFormItems = () => {
        const model = this.props.model || {}
        let houses = this.props.stores.housesStore.list;
        if (!model.uuid) {
            houses = houses.filter(e => e.remainingRoomsCount > 0);
        }
        return [
            { name: 'uuid', defaultValue: model.uuid, type: "hidden" },
            { title: '名称', name: 'name', defaultValue: model.name, rules: [{ required: true, message: '请填写批次名称' }], },
            {
                title: '楼盘',
                name: 'housesUuid',
                defaultValue: model.housesUuid || [],
                rules: [{ required: true, message: '请选择楼盘' }],
                render: <Select key="houses" mode="multiple" placeholder="请选择楼盘" onChange={this.handleChooseHouses}>
                    {houses.map(item => <Select.Option key={item.housesUuid} >{item.name}</Select.Option>)}
                </Select>
            },
            { title: '房屋地址', name: 'houseAddress', defaultValue: model.houseAddress, rules: [{ required: true, message: '请填写房屋地址' }], },
            { title: '选房地址', name: 'chooseAddress', defaultValue: model.chooseAddress, rules: [{ required: true, message: '请填写选房地址' }], },
            { title: '选房日期', name: 'chooseTime', defaultValue: moment(model.chooseTime), type: "date", rules: [{ required: true, message: '请选择选房日期' }], },
            { title: '预约开始时间', name: 'appointmentTimeStart', defaultValue: moment(model.appointmentTimeStart), type: "datetime", rules: [{ required: true, message: '请选择预约开始时间' }], },
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

