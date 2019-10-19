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
        data.BatchHouses = data.houseId.map(houseId => { return { houseId: houseId } });
        data.appointmentBeginTime = data.appointmentTime[0].format('YYYY-MM-DD 09:00:00')
        data.appointmentEndTime = data.appointmentTime[1].format('YYYY-MM-DD 18:00:00')

        data.chooseBeginDate = data.chooseDate[0].format('YYYY-MM-DD')
        data.chooseEndDate = data.chooseDate[1].format('YYYY-MM-DD')

        const result = await this.props.stores.batchStore.save(data);
        if (this.props.onSubmit) {
            this.props.onSubmit(result)
        }
        return result && result.ok;
    }

    handleChooseHouses = (selectedItems) => {
        this.setState({ selectedHouses: selectedItems })
    }

    getFormItems = () => {
        const model = this.props.model || {}
        let houses = this.props.stores.houseStore.list;
        if (!model.id) {
            houses = houses.filter(e => e.remainingRoomsCount > 0);
        }
        return [
            { name: 'id', defaultValue: model.id || '0', type: "hidden" },
            {
                title: '楼盘',
                name: 'houseId',
                defaultValue: (model.houses || []).map(item => item.id.toString()),
                rules: [{ required: true, message: '请选择楼盘' }],
                render: <Select key="house" mode="multiple" placeholder="请选择楼盘" onChange={this.handleChooseHouses}>
                    {houses.map(item => <Select.Option key={item.id} >{item.name}</Select.Option>)}
                </Select>
            },
            { title: '名称', name: 'name', defaultValue: model.name, rules: [{ required: true, message: '请填写批次名称' }], },
            { title: '选房地址', name: 'chooseAddress', defaultValue: model.chooseAddress, rules: [{ required: true, message: '请填写选房地址' }], },
            { title: '预约时段', name: 'appointmentTime', defaultValue: [moment(model.appointmentBeginTime), moment(model.appointmentEndTime)], type: "rangedate", rules: [{ required: true, message: '请选择预约开始时间' }], },
            // { title: '选房时段', name: 'chooseDate', defaultValue: [moment(model.chooseBeginDate), moment(model.chooseEndDate)], type: "rangedate", rules: [{ required: true, message: '请选择选房日期' }], },
            { title: '是否尾盘', name: 'Last', defaultValue: 'false', type: "select", options: [{ value: 'true', text: "是" }, { value: 'false', text: "否" }] }
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

