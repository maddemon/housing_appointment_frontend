import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Row, PageHeader, Icon, Button, Table, message, Modal } from "antd";
import { QueryString } from "../../common/utils";
import EditModal from "./edit";

@inject("stores")
@observer
export default class HousesIndexPage extends Component {
  componentWillMount() {
    this.props.stores.globalStore.setTitle("楼盘管理");
    this.loadList(this.props);
  }

  loadList = props => {
    props = props || this.props;
    let query = QueryString.parseJSON(props.location.search);
    this.props.stores.houseStore.getList(query.page || 1);
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.loadList(nextProps);
    }
  }

  handlePageChange = page => {
    this.props.history.push(`/house/index?pageIndex=${page}`);
  };

  handleDelete = async item => {
    Modal.confirm({
      title: "确认",
      content: "你确定要删除该楼盘吗？",
      onOk: async () => {
        const result = await this.props.stores.houseStore.delete(item.id);
        if (result.status === 204) {
          message.success("删除成功");
          this.loadList();
        }
      }
    });
  };

  handleSubmitEditForm = () => {
    this.loadList(this.props);
  };

  renderOperateColumn = (text, item) => {
    let buttons = [
      <EditModal
        key="btnEdit"
        model={item}
        trigger={
          <Button title="修改">
            <Icon type="edit" />
          </Button>
        }
        onSubmit={this.handleSubmitEditForm}
      />,
      <Button
        key="btnDelete"
        type="danger"
        onClick={() => this.handleDelete(item)}
        title="删除"
      >
        <Icon type="delete" />
      </Button>
    ];
    return buttons;
  };

  render() {
    let { list, page, loading } = this.props.stores.houseStore;
    list = list || [];
    page = page || {};
    return (
      <Row>
        <PageHeader title="楼盘管理" />
        <div className="toolbar">
          <Button.Group>
            <EditModal
              title="添加楼盘"
              trigger={
                <Button type="primary">
                  <Icon type="plus" /> 添加楼盘
                </Button>
              }
              onSubmit={this.handleSubmitEditForm}
            />
          </Button.Group>
        </div>
        <Table
          bordered={true}
          loading={loading}
          rowKey="id"
          columns={[
            { dataIndex: "id", title: "编号", width: 75 },
            { dataIndex: "name", title: "名称" },
            { dataIndex: "address", title: "楼盘地址" },
            {
              dataIndex: "count.dwelling",
              title: "房屋数量",
              width: 150,
              render: (text, item) =>
                `${item.remaining.dwelling || 0} / ${item.count.dwelling || 0}`
            },
            {
              dataIndex: "count.parking",
              title: "车位数量",
              width: 150,
              render: (text, item) =>
                `${item.remaining.parking || 0} / ${item.count.parking || 0}`
            },
            {
              dataIndex: "count.storeroom",
              title: "贮藏室数量",
              width: 150,
              render: (text, item) =>
                `${item.remaining.storeroom || 0} / ${item.count.storeroom ||
                  0}`
            },
            {
              dataIndex: "count.terrace",
              title: "露台数量",
              width: 150,
              render: (text, item) =>
                `${item.remaining.terrace || 0} / ${item.count.terrace || 0}`
            },
            { title: "操作", render: this.renderOperateColumn, width: 150 }
          ]}
          dataSource={list || []}
          pagination={{ ...page, size: 5, onChange: this.handlePageChange }}
        ></Table>
      </Row>
    );
  }
}
