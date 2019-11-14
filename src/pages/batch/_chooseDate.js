import React, { Component } from "react";
import { Button, DatePicker, Select, Checkbox } from "antd";
import Modal from "../shared/modal";
import { inject, observer } from "mobx-react";
import moment from "moment";

@inject("stores")
@observer
export default class chooseDateModal extends Component {
  state = { day: null, hour: 1, selectedDay: null };

  handleSubmit = async data => {
    const result = await this.props.stores.chooseDateStore.save(data);
    if (this.props.onSubmit) {
      this.props.onSubmit(result);
    }
    return result && result.ok;
  };

  handleChange = () => {
    console.log(this.state.day, this.state.hour);
    const model = this.props.stores.chooseDateStore.list.find(
      e =>
        moment(e.day).format("ll") === this.state.day.format("ll") &&
        e.hour === this.state.hour
    );
    console.log(model);
    this.setState({ selectedDay: model });
  };

  handleDateChange = val => {
    this.setState({ day: val }, () => {
      this.handleChange();
    });
  };
  handleHourChange = val => {
    this.setState({ hour: val }, () => {
      this.handleChange();
    });
  };

  getFormItems = () => {
    const model = this.props.model;
    return [
      { name: "batchId", type: "hidden", defaultValue: model.batchId },
      {
        name: "permitIds",
        type: "hidden",
        defaultValue: model.selectedPermitIds
      },
      {
        name: "quotaIds",
        type: "hidden",
        defaultValue: model.selectedQuotaIds
      },
      {
        title: "日期",
        name: "day",
        type: "date",
        rules: [{ required: true }],
        render: <DatePicker onChange={this.handleDateChange} />
      },
      {
        title: "时段",
        name: "hour",
        type: "select",
        defaultValue: "am",
        render: (
          <Select placeholder="请选择预约时段" onChange={this.handleHourChange}>
            <Select.Option key="am">上午</Select.Option>
            <Select.Option key="pm">下午</Select.Option>
          </Select>
        )
      },
      {
        title: "准购证数量",
        render: (
          <span className="warningText">{model.selectedPermitIds.length}</span>
        )
      },
      {
        title: "购房证数量",
        render: (
          <span className="warningText">{model.selectedQuotaIds.length}</span>
        )
      },
      {
        title: "已有购房证数量",
        render: (
          <span className="warningText">
            {(this.state.selectedDay || {}).currentNumber || 0}
          </span>
        )
      }
    ];
  };

  render() {
    return (
      <Modal
        title={"选择预约日期"}
        onSubmit={this.handleSubmit}
        trigger={this.props.trigger || <Button>修改</Button>}
        items={this.getFormItems()}
        loading={this.props.stores.appointmentStore.loading}
      ></Modal>
    );
  }
}
