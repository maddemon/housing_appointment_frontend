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
  Tag,
  Col,
  Radio,
  Select
} from "antd";
import { QueryString } from "../../common/utils";
import StatusTag from "../shared/_statusTag";
import NonBatchControl from "../my/_nonBatch";
import ChooseDateSelectControl from "../shared/_chooseDateSelect";
import ChooseDateModal from "./_chooseDate";
import moment from "moment";

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

  reloadPage = parameter => {
    let query = QueryString.parseJSON(this.props.location.search);
    Object.keys(parameter).forEach(key => {
      query[key] = parameter[key];
    });
    this.props.history.push(`/batch/schedule?${QueryString.stringify(query)}`);
  };

  handlePageChange = page => {
    this.reloadPage({ pageIndex: page });
  };

  handleDateChange = chooseDateId => {
    this.reloadPage({ chooseDateId, pageIndex: 1, hasChooseDate: "" });
  };
  handleSearch = key => {
    this.reloadPage({ key, pageIndex: 1 });
  };

  handlePressEnter = e => {
    this.handleSearch(e.target.value);
  };
  handleExportClick = () => {
    const batch = this.props.stores.batchStore.model;
    const chooseDate = this.props.stores.chooseDateStore.model || {};
    window.open(
      `/api/chooseDate/export?batchId=${batch.id}&chooseDateId=${chooseDate.id}`
    );
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
          this.state.selectedQuotaIds
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

  renderChooseDate = (text, record) => {
    const list = this.props.stores.chooseDateStore.list || [];
    const quotaId = record.quotas[0].id;
    const chooseDate = list.find(e => e.quotaIds.find(id => id === quotaId));
    if (chooseDate) {
      return (
        <span>
          {moment(chooseDate.day).format("YYYY-MM-DD")}
          {chooseDate.hourText}
        </span>
      );
    }
    return "";
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

    const chooseDate = this.props.stores.chooseDateStore.model;

    return (
      <div>
        <PageHeader
          title="选房"
          subTitle={
            <>
              {batch ? <Tag color="#108ee9">所属批次：{batch.name}</Tag> : null}
            </>
          }
          extra={
            <Row>
              <Col span={12}>
                <Row>
                  <Col span={12}>
                    <ChooseDateSelectControl
                      onChange={this.handleDateChange}
                      value={parameter.chooseDateId}
                    />
                  </Col>
                  <Col span={12}>
                    <Button
                      type="primary"
                      icon="export"
                      onClick={this.handleExportClick}
                      disabled={!chooseDate}
                    >
                      导出列表
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={12}>
                    <Select
                      style={{ width: 150 }}
                      defaultValue={parameter.hasChooseDate || ""}
                      onChange={value => {
                        this.reloadPage({ hasChooseDate: value });
                      }}
                    >
                      <Select.Option key="0" value="">
                        显示全部
                      </Select.Option>
                      <Select.Option key="1" value="false">
                        未排期
                      </Select.Option>
                      <Select.Option key="2" value="true">
                        已排期
                      </Select.Option>
                    </Select>
                  </Col>
                  <Col span={12}>
                    <Input.Search
                      style={{ width: "100%" }}
                      onSearch={this.handleSearch}
                      onPressEnter={this.handlePressEnter}
                      placeholder="输入准购证号查询"
                      enterButton
                    />
                  </Col>
                </Row>
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
              type="danger"
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
              { title: "选房日期", render: this.renderChooseDate }
            ]}
            dataSource={list}
            pagination={{ ...page, size: 5, onChange: this.handlePageChange }}
          ></Table>
        </Row>
      </div>
    );
  }
}
