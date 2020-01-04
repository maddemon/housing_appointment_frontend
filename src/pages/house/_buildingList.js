import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Spin, Select, Input } from "antd";
import RoomList from "./_roomList";

@inject("stores")
@observer
export default class BuildingList extends Component {
  state = { building: null };

  componentWillReceiveProps(nextProps) {
    this.setState({ building: null });
  }

  handleSelectBuilding = number => {
    this.setState({ building: number });
  };

  handleSearch = e => {
    this.setState({ key: e.target.value });
  };

  render() {
    const { buildings, loading } = this.props.stores.roomStore;
    const { roomType } = this.props;
    if (loading) return <Spin spinning={loading}></Spin>;

    const numbers = Object.keys(buildings[roomType] || {});
    const selectedBuilding = this.state.building || numbers[0] || '';
    return (
      <>
        {roomType === "parking" ? "选择所属区" : "选择幢号"}：
        <Select
          style={{ width: 200, marginBottom: 5 }}
          onSelect={this.handleSelectBuilding}
          defaultValue={selectedBuilding.toString()}
        >
          {Object.keys(buildings[roomType] || {}).map(key => (
            <Select.Option key={key}>{key}</Select.Option>
          ))}
        </Select>
        <Input.Search
          onChange={this.handleSearch}
          placeholder="输入房号/编号查询"
          style={{ width: 150, marginLeft: 20 }}
        />
        <RoomList
          roomType={roomType}
          building={selectedBuilding}
          searchKey={this.state.key}
          action={this.props.action}
        />
        ;
      </>
    );
  }
}
