import React, { Component } from "react";
import { Table, Button, Tag } from "antd";
import { inject, observer } from "mobx-react";

@inject("stores")
@observer
export default class RoomList extends Component {
  handleSelectRoom = room => {
    this.props.stores.roomStore.selectRoom(room);
  };

  renderStatusColumn = (text, item) => (
    <Tag color={item.hasChoosen ? "red" : "green"}>
      {item.hasChoosen ? "已选" : "未选"}
    </Tag>
  );

  renderTerraceColumn = (text, item) => {
    const terrace = this.props.stores.roomStore.getTerrace(item);
    if (terrace) {
      return (
        <span>
          {terrace.profile.area}平方米 {terrace.profile.price}元
        </span>
      );
    }
    return null;
  };

  renderOperateColumn = (text, item) => {
    return (
      <Button
        size="small"
        type="primary"
        disabled={item.hasChoosen}
        onClick={() => this.handleSelectRoom(item)}
      >
        选择
      </Button>
    );
  };
  getViewColumns = roomType => {
    switch (roomType) {
      case "dwelling":
        return [
          { dataIndex: "profile.building", title: "幢号" },
          { dataIndex: "profile.number", title: "房号" },
          { dataIndex: "profile.area", title: "预测面积(㎡)" },
          { dataIndex: "profile.amount", title: "总价(元)" },
          {
            dataIndex: "hasChoosen",
            title: "状态",
            render: this.renderStatusColumn
          }
        ];
      case "parking":
        return [
          {
            dataIndex: "profile.area",
            title: "分区号"
          },
          { dataIndex: "profile.number", title: "车位号" },
          { dataIndex: "profile.price", title: "定价(元)" },
          {
            dataIndex: "hasChoosen",
            title: "状态",
            render: this.renderStatusColumn
          }
        ];
      case "terrace":
        return [
          { dataIndex: "profile.building", title: "幢号" },
          { dataIndex: "profile.number", title: "房号" },
          { dataIndex: "profile.area", title: "面积(㎡)" },
          { dataIndex: "profile.price", title: "定价(元)" },
          {
            dataIndex: "hasChoosen",
            title: "状态",
            render: this.renderStatusColumn
          }
        ];
      case "storeroom":
        return [
          { dataIndex: "profile.building", title: "幢号" },
          { dataIndex: "profile.number", title: "房号" },
          { dataIndex: "profile.price", title: "定价(元)" },
          {
            dataIndex: "hasChoosen",
            title: "状态",
            render: this.renderStatusColumn
          }
        ];
      default:
        return [];
    }
  };
  getChooseColumns = roomType => {
    switch (roomType) {
      default:
      case "dwelling":
        return [
          { dataIndex: "profile.number", title: "房号" },
          {
            dataIndex: "profile.area",
            title: "预测面积(㎡)"
          },
          { dataIndex: "profile.amount", title: "总价(元)" },
          {
            dataIndex: "terrace",
            title: "露台(㎡/元)",
            render: this.renderTerraceColumn
          },
          { dataIndex: "id", title: "操作", render: this.renderOperateColumn }
        ];
      case "parking":
        return [
          {
            dataIndex: "profile.area",
            title: "分区号"
          },
          { dataIndex: "profile.number", title: "车位号" },
          { dataIndex: "profile.price", title: "定价" },
          { dataIndex: "id", title: "操作", render: this.renderOperateColumn }
        ];
      case "storeroom":
        return [
          { dataIndex: "profile.number", title: "房号" },
          { dataIndex: "profile.price", title: "定价" },
          { dataIndex: "id", title: "操作", render: this.renderOperateColumn }
        ];
    }
  };
  render() {
    const { roomType, building, searchKey, action } = this.props;
    const { rooms } = this.props.stores.roomStore;
    let list = rooms[roomType].filter(
      e =>
        ((searchKey && e.profile.number.indexOf(searchKey) > -1) ||
          !searchKey) &&
        ((e.profile.area === building && e.type === 2) ||
          e.profile.building === building)
    );
    if (action === "choose") {
      list = list.filter(e => !e.hasChoosen);
      return (
        <Table
          rowKey="id"
          dataSource={list}
          columns={this.getChooseColumns(roomType)}
        />
      );
    }

    return (
      <Table
        rowKey="id"
        dataSource={list}
        columns={this.getViewColumns(roomType)}
      />
    );
  }
}
