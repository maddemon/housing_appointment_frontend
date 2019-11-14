import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  Row,
  PageHeader,
  Input,
  Button,
  Modal,
  message,
  Table,
  Col
} from "antd";
import { QueryString } from "../../common/utils";
import StatusTag from "../shared/_statusTag";
import NonBatchControl from "../my/_nonBatch";
import ChooseDateSelectControl from "../shared/_chooseDateSelect";
import ChooseDateModal from "./_chooseDate";

@inject("stores")
@observer
export default class SchedulePage extends Component {
  state = { selectedPermitIds: [], selectedQuotaIds: [] };

  async componentWillMount() {
    this.props.stores.globalStore.setTitle("选房日期排期管理");
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
    query.status = 3;
    await this.props.stores.permitStore.getEnterList(query);
  };

  reloadPage = (key, value) => {
    let query = QueryString.parseJSON(this.props.location.search);
    query[key] = value;
    if (key !== "pageIndex") {
      query["pageIndex"] = "1";
    }
    this.props.history.push(`/batch/schedule?${QueryString.stringify(query)}`);
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
  handleExportClick = () => {
    const batch = this.props.stores.batchStore.model;
    window.open("/api/appointment/export?batchId=" + batch.id);
  };

  handleSendChooseMessage = () => {
    Modal.confirm({
      title: "发送选房确认",
      content:
        "本次操作将向“已选中的准购证”发送选房通知短信，你确认执行此操作吗？",
      okText: "确认发送",
      onOk: async () => {
        const batch = this.props.stores.batchStore.model;
        const response = await this.props.stores.messageStore.sendChooseMessage(
          batch.id,
          this.state.selectedPermitIds
        );
        if (response && response.ok) {
          message.success("发送短信完成");
        }
      }
    });
  };

  setSelectedRows = selectedRows => {
    let selectedQuotas = [];
    selectedRows.forEach(item => {
      selectedQuotas = selectedQuotas.concat(item.quotas);
    });
    this.setState({
      selectedPermitIds: selectedRows.map(e => e.id),
      selectedQuotaIds: selectedQuotas.map(e => e.id)
    });
  };

  handleSelect = (record, selected, selectedRows, changeRows) =>
    this.setSelectedRows(selectedRows);

  handleSelectAll = (selected, selectedRows, changeRows) =>
    this.setSelectedRows(selectedRows);
  handleSelectInvert = selectedRows => this.setSelectedRows(selectedRows);

  renderQuotaColumn = (text, record) => {
    return record.quotas.map((quota, key) => {
      return (
        <span key={key}>
          {quota.users.map((user, key1) => (
            <StatusTag key={key1} status={user.status}>
              {quota.quotaCode}
              {user.user}
              {user.statusText}
            </StatusTag>
          ))}
        </span>
      );
    });
  };

  render() {
    const { list, page, parameter } = this.props.stores.permitStore;
    const batch = this.props.stores.batchStore.model;

    if (!batch) {
      if (!this.props.stores.batchStore.loading) return <NonBatchControl />;
      else return null;
    }

    const { selectedPermitIds, selectedQuotaIds } = this.state;

    const hasSelected = selectedPermitIds.length > 0;
    return (
      <div>
        <PageHeader
          title="选房"
          extra={
            <Row>
              <Col span={12}>
                <ChooseDateSelectControl
                  onChange={this.handleDateChange}
                  value={parameter.chooseDateId}
                />
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
          <div className="toolbar">
            <ChooseDateModal
              model={{ batchId: batch.id, ...this.state }}
              trigger={
                <Button type="primary" icon="calendar" disabled={!hasSelected}>
                  指定选房日期
                </Button>
              }
              onSubmit={this.loadList}
            />
            <Button
              icon="reset"
              disabled={!hasSelected}
              onClick={() =>
                this.setState({ selectedPermitIds: [], selectedQuotaIds: [] })
              }
            >
              重选
            </Button>

            <Button
              icon="bell"
              onClick={this.handleSendChooseMessage}
              disabled={!hasSelected}
            >
              选房通知
            </Button>

            {hasSelected ? (
              <span>
                已选中
                <span className="warningText">{selectedPermitIds.length}</span>
                个准购证 共包含
                <span className="warningText">{selectedQuotaIds.length}</span>
                个购房证
              </span>
            ) : null}
          </div>
          <Table
            bordered={true}
            loading={this.props.stores.permitStore.loading}
            rowSelection={{
              selectedRowKeys: selectedPermitIds,
              onSelect: this.handleSelect,
              onSelectAll: this.handleSelectAll,
              onSelectInvert: this.handleSelectInvert
            }}
            rowKey="id"
            columns={[
              { dataIndex: "permitCode", title: "准购证号" },
              { dataIndex: "agency", title: "动迁机构" },
              { dataIndex: "town", title: "镇街" },
              {
                dataIndex: "quotas",
                title: "购房证",
                render: this.renderQuotaColumn
              },
              { title: "选房日期", render: (text, item) => <span></span> }
            ]}
            dataSource={list}
            pagination={{ ...page, size: 5, onChange: this.handlePageChange }}
          ></Table>
        </Row>
      </div>
    );
  }
}
