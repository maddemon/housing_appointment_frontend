import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { message, Select } from "antd";
import FormModal from "../shared/modal";

@inject("stores")
@observer
export default class EditAppointmentModal extends Component {
  handleSubmit = async values => {
    await this.props.stores.appointmentStore.updateStatus(
      values.id,
      values.status
    );
    message.success("预约状态修改成功");
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  };

  render() {
    const { model } = this.props;

    return (
      <FormModal
        title="修改预约状态"
        loading={false}
        visible={this.props.visible}
        trigger={this.props.trigger}
        onSubmit={this.handleSubmit}
        items={[
          {
            name: "id",
            type: "hidden",
            disabled: true,
            defaultValue: model.id
          },
          {
            title: "准购证号",
            name: "code",
            disabled: true,
            defaultValue: model.code
          },
          {
            title: "姓名",
            name: "user",
            disabled: true,
            defaultValue: model.user
          },
          {
            title: "身份证号",
            name: "idCard",
            disabled: true,
            defaultValue: model.idCard
          },
          {
            title: "手机号",
            name: "phone",
            disabled: true,
            defaultValue: model.phone
          },
          {
            title: "预约状态",
            name: "status",
            defaultValue: model.status.toString(),
            render: (
              <Select>
                <Select.Option key="1">等待他人预约</Select.Option>
                <Select.Option key="2">已预约</Select.Option>
                <Select.Option key="3">已入围</Select.Option>
              </Select>
            )
          }
        ]}
      />
    );
  }
}
