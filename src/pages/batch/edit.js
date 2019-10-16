import React, { Component } from 'react'
import { Button, Select } from 'antd'
import Modal from '../shared/modal'
import { inject, observer } from 'mobx-react'
import moment from 'moment'

@inject('stores')
@observer
export default class BatchEditModal extends Component {

    state = { selectedHouses: (this.props.model || {}).house || [] }

    handleSubmit = async (data) => {
        data.appointmentBeginTime = data.appointmentBeginTime.format('YYYY-MM-DD HH:mm:ss')
        data.appointmentEndTime = data.appointmentEndTime.format('YYYY-MM-DD HH:mm:ss')
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
        let house = this.props.stores.houseStore.list;
        if (!model.id) {
            house = house.filter(e => e.remainingRoomsCount > 0);
        }
        return [
            { name: 'id', defaultValue: model.id, type: "hidden" },
            { title: '名称', name: 'name', defaultValue: model.name, rules: [{ required: true, message: '请填写批次名称' }], },
            {
                title: '楼盘',
                name: 'houseId',
                defaultValue: model.houseId || [],
                rules: [{ required: true, message: '请选择楼盘' }],
                render: <Select key="house" mode="multiple" placeholder="请选择楼盘" onChange={this.handleChooseHouses}>
                    {house.map(item => <Select.Option key={item.houseId} >{item.name}</Select.Option>)}
                </Select>
            },
            { title: '房屋地址', name: 'houseAddress', defaultValue: model.houseAddress, rules: [{ required: true, message: '请填写房屋地址' }], },
            { title: '选房地址', name: 'chooseAddress', defaultValue: model.chooseAddress, rules: [{ required: true, message: '请填写选房地址' }], },
            { title: '选房开始日期', name: 'chooseBeginDate', defaultValue: moment(model.chooseTime), type: "date", rules: [{ required: true, message: '请选择选房日期' }], },
            { title: '选房截止日期', name: 'chooseEndDate', defaultValue: moment(model.chooseTime), type: "date", rules: [{ required: true, message: '请选择选房日期' }], },
            { title: '预约开始时间', name: 'appointmentBeginTime', defaultValue: moment(model.appointmentBeginTime), type: "datetime", rules: [{ required: true, message: '请选择预约开始时间' }], },
            { title: '预约截止时间', name: 'appointmentEndTime', defaultValue: moment(model.appointmentEndTime), type: "datetime", rules: [{ required: true, message: '请选择预约结束时间' }], },
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

