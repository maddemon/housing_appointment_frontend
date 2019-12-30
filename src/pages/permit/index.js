import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  Row,
  Col,
  PageHeader,
  Icon,
  Button,
  Table,
  Input,
  Tag,
  Select
} from "antd";
import { QueryString, reloadPage } from "../../common/utils";
import EditQuotaModal from "./edit_quota";
import StatusTag from "../shared/_statusTag";

@inject("stores")
@observer
export default class PermitIndexPage extends Component {
  componentWillMount() {
    this.props.stores.globalStore.setTitle("准购证管理");
    this.loadList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.loadList(nextProps);
    }
  }

  loadList = props => {
    props = props || this.props;
    let query = QueryString.parseJSON(props.location.search);
    this.props.stores.permitStore.getList(query);
  };

  handlePageChange = page => {
    reloadPage(this.props, { pageIndex: page });
  };

  handleSearch = key => {
    reloadPage(this.props, { key });
  };

  handleRedirectToStatistics = () => {
    this.props.history.push(`/permit/statistic`);
  };
  handleFilterChange = val => {
    reloadPage(this.props, { issue: val });
  };

  handleSaveQuota = () => {
    this.loadList();
  };

  handleDeleteQuota = () => {
    this.loadList();
  };

  renderQuotaColumn = (text, record) => {
    let list = [];
    record.quotas.forEach(quota => {
      let users = quota.users.map((item, key) => (
        <EditQuotaModal
          key={quota.code + "-" + key}
          model={item}
          trigger={
            <StatusTag status={item.status}>
              {item.quotaCode} {item.user} {item.statusText}
            </StatusTag>
          }
          onSubmit={this.handleSaveQuota}
          onDelete={this.handleDeleteQuota}
        />
      ));
      list = list.concat(users);
    });
    return list;
  };

  renderOperateColumn = (text, item) => {
    if (item.issueNumber < item.quotaNumber) {
      return (
        <EditQuotaModal
          model={{ permitCode: item.permitCode }}
          trigger={<Button type="primary">发证</Button>}
          onSubmit={this.handleSaveQuota}
          onDelete={this.handleDeleteQuota}
        />
      );
    }
    return null;
  };

  render() {
    let { list, page, loading, parameter } = this.props.stores.permitStore;
    list = list || [];
    page = page || {};
    parameter = parameter || {};
    console.log(typeof parameter.issue);
    return (
      <Row>
        <PageHeader
          title="准购证管理"
          extra={
            <Row>
              <Col span={12}>
                <Select
                  onChange={this.handleFilterChange}
                  style={{ width: 200 }}
                  defaultValue={parameter.issue}
                >
                  <Select.Option key="all" value="">
                    全部
                  </Select.Option>
                  <Select.Option key="false" value="false">
                    未发证
                  </Select.Option>
                  <Select.Option key="true" value="true">
                    已发证
                  </Select.Option>
                </Select>
              </Col>
              <Col span={12}>
                <Input.Search
                  placeholder="姓名、准购证号"
                  defaultValue={parameter.key}
                  onSearch={this.handleSearch}
                  style={{ width: 200 }}
                />
              </Col>
            </Row>
          }
        />
        <div className="toolbar">
          <Button onClick={this.handleRedirectToStatistics}>
            <Icon type="bar-chart" />
            查看发证情况
          </Button>
        </div>
        <Table
          bordered={true}
          loading={loading}
          rowKey="id"
          columns={[
            { dataIndex: "permitCode", title: "准购证号", width: 100 },
            { dataIndex: "agency", title: "动迁机构", width: 120 },
            { dataIndex: "village", title: "行政村", width: 150 },
            { dataIndex: "householderName", title: "户主姓名", width: 150 },
            { dataIndex: "householderIDCard", title: "户主身份证", width: 200 },
            {
              dataIndex: "quotas",
              title: "指标",
              render: this.renderQuotaColumn
            },
            { title: "操作", render: this.renderOperateColumn, width: 120 }
          ]}
          dataSource={list}
          pagination={{ ...page, size: 5, onChange: this.handlePageChange }}
        ></Table>
      </Row>
    );
  }
}
