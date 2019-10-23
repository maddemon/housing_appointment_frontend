import React, { Component } from 'react'
import { Button, DatePicker, Select, Checkbox } from 'antd'
import Modal from '../shared/modal'
import { inject, observer } from 'mobx-react'
import moment from 'moment'

@inject('stores')
@observer
export default class chooseDateModal extends Component {

    state = { day: null, hour: 1, selectedDay: null }

    handleSubmit = async (data) => {
        const result = await this.props.stores.chooseDateStore.save(data);
        if (result && result.ok && data.sendSms === "1") {
            //发送通知短信
            //this.props.stores.
        }
        if (this.props.onSubmit) {
            this.props.onSubmit(result)
        }
        return result && result.ok;
    }

    handleChange = () => {
        const model = this.props.stores.chooseDateStore.list.find(e => moment(e.day) === this.state.day && e.hour === this.state.hour)
        this.setState({ selectedDay: model })
    }

    handleDateChange = (val) => {
        this.setState({ day: val }, () => {
            this.handleChange();
        });
    }
    handleHourChange = (val) => {
        this.setState({ hour: val }, () => {
            this.handleChange();
        });
    }

    getFormItems = () => {
        const model = this.props.model
        return [
            { name: 'batchId', type: 'hidden', defaultValue: model.batchId },
            { name: 'appoinmtentIds', type: "hidden", defaultValue: model.appointmentIds },
            {
                title: '日期', name: 'day', type: 'date', rules: [{ required: true }],
                render: <DatePicker onChange={this.handleDateChange} />,
            },
            {
                title: '时段',
                name: 'hour',
                type: 'select',
                defaultValue: 'am',
                render: <Select placeholder="请选择预约时段" onChange={this.handleHourChange}>
                    <Select.Option key="am">上午</Select.Option>
                    <Select.Option key="pm">下午</Select.Option>
                </Select>
            },
            {
                title: "本次选择人数", render: <span>{model.appointmentIds.length}</span>
            },
            {
                title: "该时段已有人数", render: <span>{(this.state.selectedDay || {}).currentNumber || 0}</span>
            },
            {
                title: "短信通知", name: 'sendSms',
                render: <Checkbox value="1" defaultChecked={true} >向所有选择的用户发送选房日期通知短信</Checkbox>
            }
        ];
    }

    render() {
        return (
            <Modal
                title={'选择预约日期'}
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger || <Button>修改</Button>}
                items={this.getFormItems()}
                loading={this.props.stores.appointmentStore.loading}
            >
            </Modal>
        )
    }
}

