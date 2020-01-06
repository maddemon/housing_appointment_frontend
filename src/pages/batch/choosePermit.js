import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Row, PageHeader, Input, Table, Button, } from "antd";
import { QueryString, reloadPage } from "../../common/utils";
import StatusTag from "../shared/_statusTag";
import ChooseRoom from "./_chooseRoom";
import NonBatchControl from "../my/_nonBatch";

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
    await this.props.stores.permitStore.getList(query);
    await this.props.stores.roomStore.getResultList(batch.id);
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
    window.open(`/api/permit/export`);
  };



  renderQuotaColumn = (text, record) => {
    return record.quotas.map((quota, key) => {
      return (
        <ChooseRoom
          key={key}
          quota={quota}
          users={quota.users}
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
    const { list, page } = this.props.stores.permitStore;
    const batch = this.props.stores.batchStore.model;

    if (!batch && !this.props.stores.batchStore.loading) {
      return <NonBatchControl />;
    }

    return (
      <div>
        <PageHeader
          title="选房"
          extra={<span style={{ flexDirection: "between", display: "flex" }}><Input.Search
            onSearch={this.handleSearch}
            onPressEnter={this.handlePressEnter}
            placeholder="输入准购证号查询"
            enterButton
          />
            <Button onClick={this.handleExportClick} icon="export">导出</Button>
          </span>
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
              { dataIndex: "householderName", title: "户主姓名" },
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
