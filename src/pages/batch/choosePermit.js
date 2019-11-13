import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  Row,
  PageHeader,
  Input,
  Button,
  Spin,
  Result,
  Table,
  DatePicker,
  Col,
  Select,
  Tag
} from "antd";
import { QueryString } from "../../common/utils";
import moment from "moment";
import StatusTag from "../shared/_statusTag";
import ChooseRoom from "./_chooseRoom";
import ChooseResult from "./_chooseResult";

@inject("stores")
@observer
export default class ChoosePermitPage extends Component {
  async componentWillMount() {
    this.props.stores.globalStore.setTitle("选房——选择准购证");
    await this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.loadData(nextProps);
    }
  }

  loadData = async props => {
    props = props || this.props;
    let query = QueryString.parseJSON(props.location.search);
    await this.props.stores.batchStore.getModel(query.batchId);
    const batch = this.props.stores.batchStore.model;
    if (!batch) return;
    await this.props.stores.chooseDateStore.getList(batch.id);
    if (!query.chooseDateId) {
      const defaultChooseDate = await this.props.stores.chooseDateStore.getDefaultModel();
      query.chooseDateId = (defaultChooseDate || {}).id || "";
    }
    await this.props.stores.permitStore.getEnterList(query);
    await this.props.stores.roomStore.getResultList(batch.id);
  };

  reloadPage = (key, value) => {
    let query = QueryString.parseJSON(this.props.location.search);
    query[key] = value;
    if (key !== "pageIndex") {
      query["pageIndex"] = "1";
    }
    this.props.history.push(
      `/batch/choosePermit?${QueryString.stringify(query)}`
    );
  };

  handlePageChange = page => {
    this.reloadPage("pageIndex", page);
  };

  handleDateChange = val => {
    this.reloadPage("chooseDateId", val);
  };
  handleSearch = key => {
    this.reloadPage("key", key);
  };

  handlePressEnter = e => {
    this.handleSearch(e.target.value);
  };

  renderQuotaColumn = (text, record) => {
    return record.quotas.map((quota, key) => {
      const userNames = quota.users.map(e => e.user).join(" / ");
      return (
        <ChooseRoom
          key={key}
          quota={quota}
          user={userNames}
          permit={record}
          onChoosen={this.loadData}
          trigger={
            <span type="primary">
              {quota.users.map((user, key) => (
                <span key={key}>
                  <StatusTag status={user.status}>
                    {quota.quotaCode}
                    {user.user}
                    {user.statusText}
                  </StatusTag>
                </span>
              ))}
            </span>
          }
        />
      );
    });
  };
  handleRedirectToChooseRoomPage = permit => {
    const batch = this.props.stores.batchStore.model;
    this.props.history.push(
      `/batch/chooseRoom?batchId=${batch.id}&permitId=${permit.id}`
    );
  };

  render() {
    const { list, parameter, page } = this.props.stores.permitStore;
    const batch = this.props.stores.batchStore.model;

    if (!batch && !this.props.stores.batchStore.loading) {
      return (
        <Result
          status="404"
          title="没有可用批次"
          subTitle="系统没有找到可用的批次，是否没有创建？"
          extra={
            <Button
              type="primary"
              onClick={() => {
                this.props.history.push("/batch/index");
              }}
            >
              返回批次管理
            </Button>
          }
        />
      );
    }
    const chooseDateList = this.props.stores.chooseDateStore.list || [];
    return (
      <div>
        <PageHeader
          title="选房"
          extra={
            <Row>
              <Col span={12}>
                <Select
                  loading={this.props.stores.chooseDateStore.loading}
                  onChange={this.handleDateChange}
                  style={{ width: 200 }}
                  defaultValue={(parameter.chooseDateId || "0").toString()}
                  placeholder="请选择选房日期"
                >
                  <Select.Option key="all" value="0">
                    全部选房日期
                  </Select.Option>
                  {chooseDateList.map(item => (
                    <Select.Option key={item.id.toString()}>
                      {moment(item.day).format("ll")} -{" "}
                      {item.hour === 1 ? "上午" : "下午"}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={12}>
                <Input.Search
                  onSearch={this.handleSearch}
                  onPressEnter={this.handlePressEnter}
                  placeholder="输入准购证号查询"
                  enterButton
                />
              </Col>
            </Row>
          }
        />
        <Row>
          <Table
            bordered={true}
            loading={this.props.stores.permitStore.loading}
            rowKey="id"
            columns={[
              { dataIndex: "permitCode", title: "准购证号" },
              { dataIndex: "agency", title: "动迁机构" },
              { dataIndex: "town", title: "镇街" },
              {
                dataIndex: "quotas",
                title: "购房证",
                render: this.renderQuotaColumn
              }
            ]}
            dataSource={list}
            defaultExpandAllRows={true}
            expandedRowRender={this.quotaRowRender}
            pagination={{ ...page, size: 5, onChange: this.handlePageChange }}
          ></Table>
        </Row>
      </div>
    );
  }
}
