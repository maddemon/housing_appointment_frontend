import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Row, PageHeader, Input, Table, Col } from "antd";
import { QueryString, reloadPage } from "../../common/utils";
import StatusTag from "../shared/_statusTag";
import ChooseRoom from "./_chooseRoom";
import NonBatchControl from "../my/_nonBatch";
import ChooseDateSelectControl from "../shared/_chooseDateSelect";

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
    await this.props.stores.permitStore.getEnterList(query);
    await this.props.stores.roomStore.getResultList(this.props.stores.permitStore.list);
  };

  handlePageChange = page => {
    reloadPage(this.props, { pageIndex: page });
  };

  handleDateChange = val => {
    reloadPage(this.props, { chooseDateId: val });
  };
  handleSearch = key => {
    reloadPage(this.props, { key });
  };

  handlePressEnter = e => {
    this.handleSearch(e.target.value);
  };

  handleExportClick = () => {
    const batch = this.props.stores.batchStore.model;
    const chooseDate = this.props.stores.chooseDateStore.model || {};
    window.open(
      `/api/batch/exportResult?batchId=${batch.id}&chooseDateId=${chooseDate.id}`
    );
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

  render() {
    const { list, page, parameter } = this.props.stores.permitStore;
    const batch = this.props.stores.batchStore.model;

    if (!batch && !this.props.stores.batchStore.loading) {
      return <NonBatchControl />;
    }
    const chooseDate = this.props.stores.chooseDateStore.model;

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
