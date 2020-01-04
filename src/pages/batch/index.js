import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  PageHeader,
  Icon,
  Button,
  Row,
  message,
  Modal,
  Tag,
  Table,
  Card,
  Descriptions,
  Pagination,
  Spin
} from "antd";
import moment from "moment";
import EditModal from "./edit";

@inject("stores")
@observer
export default class BatchIndexPage extends Component {
  componentWillMount() {
    this.props.stores.globalStore.setTitle("批次管理");
    this.props.stores.houseStore.getList({ pageSize: 999 });
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.loadData(nextProps);
    }
  }

  loadData = props => {
    this.props.stores.batchStore.getList();
  };

  handleSubmitForm = result => {
    if (result.ok) {
      message.success("操作完成");
      this.loadData();
    }
  };

  handleDelete = async item => {
    Modal.confirm({
      title: "确认",
      content: "你确定要删除该批次吗？",
      onOk: async () => {
        const result = await this.props.stores.batchStore.delete(item.id);
        if (result.ok) {
          message.success("操作完成");
          this.loadData();
        }
      }
    });
  };

  handleSendAppointmentMessage = batchId => {
    Modal.confirm({
      title: "你确定要发送通知短信吗？",
      content:
        "本次操作将向“所有未预约的用户”发送预约通知，你确定要执行此操作吗？",
      onOk: async () => {
        const result = await this.props.stores.messageStore.sendAppointmentMessage(
          batchId
        );
        if (result.ok) {
          message.success("发送短信完成");
        }
      }
    });
  };

  handleSendFailMessage = batchId => {
    Modal.confirm({
      title: "你确定要发送通未完成预约通知吗？",
      content:
        "本次操作是将向“指标的共有人尚未预约的用户”或“同准购证下其他未预约的用户”发送预约通知短信，你确定执行此操作吗？",
      onOk: async () => {
        const result = await this.props.stores.messageStore.sendFailMessage(
          batchId
        );
        if (result.ok) {
          message.success("发送短信完成");
        }
      }
    });
  };

  houseColumnRender = (text, item) => {
    return item.houses.map((item, key) => <Tag key={key}>{item.name}</Tag>);
  };

  chooseColumnRender = (text, item) => {
    return (
      <span className="date">
        {moment(item.chooseBeginDate).format("ll")} -{" "}
        {moment(item.chooseEndDate).format("ll")}
      </span>
    );
  };

  appointmentColumnRender = (text, item) => {
    return (
      <span className="date">
        {moment(item.appointmentBeginTime).format("ll")} -{" "}
        {moment(item.appointmentEndTime).format("ll")}
      </span>
    );
  };

  nameColumnRender = (text, item) => {
    if (item.last) {
      return (
        <span>
          {text} <Tag>尾批</Tag>
        </span>
      );
    }
    return <span>{text}</span>;
  };
  renderOperateColumn = (text, item) => {
    const canDelete = moment(item.appointmentBeginTime) > moment();
    var result = [];
    result.push(
      <Button
        key="btnChoose"
        type="primary"
        icon="check"
        onClick={() =>
          this.props.history.push("/batch/choosePermit?batchId=" + item.id)
        }
      >
        选房
      </Button>
    );
    result.push(
      <Button
        key="bthBigscreen"
        icon="list"
        onClick={() =>
          this.props.history.push("/batch/result?batchId=" + item.id)
        }
      >
        选房大屏
      </Button>
    );
    result.push(
      <Button
        key="bthResult"
        icon="list"
        onClick={() =>
          this.props.history.push("/batch/rooms?batchId=" + item.id)
        }
      >
        选房结果
      </Button>
    );
    result.push(
      <EditModal
        key="edit"
        model={item}
        trigger={<Button icon="edit">修改</Button>}
        onSubmit={this.handleSubmitForm}
      />
    );
    if (canDelete)
      result.push(
        <Button key="delete" icon="delete" onClick={this.handleDelete}>
          删除
        </Button>
      );
    return result;
  };

  render() {
    const { list, loading } = this.props.stores.batchStore;
    return (
      <Row>
        <PageHeader title="批次管理" />
        <div className="toolbar">
          <Button.Group>
            <EditModal
              title="添加批次"
              trigger={
                <Button type="primary">
                  <Icon type="plus" /> 添加批次
                </Button>
              }
              onSubmit={this.handleSubmitForm}
            />
          </Button.Group>
        </div>
        <Row gutter={16}>
          <Spin spinning={loading}>
            {(list || []).map(item => (
              <Card key={item.id}>
                <Descriptions
                  title={this.nameColumnRender(item.name, item)}
                  bordered
                  column={{ md: 2, sm: 1, xs: 1 }}
                >
                  <Descriptions.Item label="楼盘">
                    {this.houseColumnRender("", item)}
                  </Descriptions.Item>
                  <Descriptions.Item label="选房地点">
                    {item.chooseAddress}
                  </Descriptions.Item>
                  <Descriptions.Item label="管理">
                    {this.renderOperateColumn("", item)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            ))}
          </Spin>
        </Row>
      </Row>
    );
  }
}
