import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  Drawer,
  Row,
  Button,
  Card,
  Tag,
  Tabs,
  Spin,
  Modal,
  Select,
  Table,
  message,
  Result
} from "antd";
import ChooseResult from "./_chooseResult";
@inject("stores")
@observer
export default class ChooseRoom extends Component {
  state = { visible: false };
  show = () => this.setState({ visible: true });
  hide = () => {
    this.setState({ visible: false });
    if (this.props.stores.roomStore.chooseResult) {
      this.props.stores.roomStore.clearAllSelected(null);
      this.props.onChoosen();
    }
  };

  async componentWillMount() {
    const batch = this.props.stores.batchStore.model;
    if (batch && batch.houses.length === 1) {
      this.props.stores.roomStore.selectHouse(batch.houses[0]);
    }
  }

  handleConfirmChoose = () => {
    const { selectedRoom } = this.props.stores.roomStore;
    if (!selectedRoom || !selectedRoom.dwelling) {
      message.error("你还没有选房，请先选房");
      return;
    }
    Modal.confirm({
      title: "选房确认",
      content: "你确定不更改选择了吗？",
      onOk: async () => {
        const batch = this.props.stores.batchStore.model;
        const { quota } = this.props;
        const response = await this.props.stores.roomStore.confirmChoose(
          batch.id,
          quota.id
        );
        if (response && response.ok) {
          message.success("选房成功！");
        }
      }
    });
  };

  handleConfigGiveup = () => {
    Modal.confirm({
      title: "放弃选房",
      content: "您确定要放弃选房吗？本次放弃只能等到最后一批才可以预约选房！",
      onOk: async () => {
        const batch = this.props.stores.batchStore.model;
        const quota = this.props.quota;
        const response = await this.props.stores.roomStore.giveupChoose(
          batch.id,
          quota.id
        );
        if (response && response.ok) {
          message.success("您已放弃选房");
          //刷新列表
          this.props.onChoosen();
        }
      }
    });
  };

  handleSelectHouse = async house => {
    await this.props.stores.roomStore.selectHouse(house);
  };

  handleSelectRoom = room => {
    this.props.stores.roomStore.selectRoom(room);
  };

  renderStep = () => {
    const batch = this.props.stores.batchStore.model;
    const { selectedHouse } = this.props.stores.roomStore;
    if (!selectedHouse) {
      return <HouseList batch={batch} onSelect={this.handleSelectHouse} />;
    }

    //显示楼盘下的所有房屋、柴间等
    const { rooms, loading } = this.props.stores.roomStore;
    if (loading) {
      return <Spin spinning={loading}></Spin>;
    }
    if (!rooms) return <span>没有楼房信息</span>;
    return (
      <Spin spinning={this.props.stores.roomStore.loading}>
        <Tabs>
          <Tabs.TabPane key="dwelling" tab="住宅">
            <BuildingList roomType="dwelling" />
          </Tabs.TabPane>
          {rooms.parking ? (
            <Tabs.TabPane key="parking" tab="车位">
              <BuildingList roomType="parking" />
            </Tabs.TabPane>
          ) : null}
          {rooms.storeroom ? (
            <Tabs.TabPane key="storeroom" tab="贮藏室">
              <BuildingList roomType="storeroom" />
            </Tabs.TabPane>
          ) : null}
        </Tabs>
      </Spin>
    );
  };

  renderBody = () => {
    const batch = this.props.stores.batchStore;
    const quota = this.props.quota;

    const {
      chooseResult,
      selectedHouse,
      selectedRoom
    } = this.props.stores.roomStore;

    if (chooseResult || quota.users.find(e => e.status > 3)) {
      return <ChooseResult quota={quota} />;
    }
    return (
      <>
        <Card
          title="选择结果"
          extra={
            <Button.Group>
              <Button
                type="primary"
                onClick={this.handleConfirmChoose}
                disabled={!selectedRoom || !selectedRoom.dwelling}
                loading={this.props.stores.roomStore.loading}
              >
                确认选房
              </Button>
              {batch.last ? null : (
                <Button type="danger" onClick={this.handleConfigGiveup}>
                  放弃选房
                </Button>
              )}
            </Button.Group>
          }
        >
          {selectedHouse ? (
            <div>
              已选楼盘：<Tag color="red">{selectedHouse.name}</Tag>
              <Button onClick={() => this.handleSelectHouse(null)} size="small">
                重选
              </Button>
            </div>
          ) : null}

          {Object.keys(selectedRoom || {}).map(key => {
            return (
              <div key={key}>
                已选{this.props.stores.roomStore.getRoomName(key)}：
                <Tag color="red">
                  {selectedRoom[key].profile.building}号楼
                  {selectedRoom[key].profile.number}号房
                </Tag>
                <Button
                  onClick={() => this.handleSelectRoom(null)}
                  size="small"
                >
                  重选
                </Button>
              </div>
            );
          })}
        </Card>
        {this.renderStep()}
      </>
    );
  };

  render() {
    const trigger = this.props.trigger;
    const { quota } = this.props;
    return (
      <>
        {trigger ? <span onClick={this.show}>{trigger}</span> : null}
        <Drawer
          title={`${quota.permitCode}-${quota.quotaCode} ${quota.users
            .map(e => e.user)
            .join()}—— 选房`}
          width={"40%"}
          onClose={this.hide}
          visible={this.state.visible}
        >
          {this.renderBody()}
        </Drawer>
      </>
    );
  }
}

const HouseList = ({ batch, onSelect }) => {
  return batch.houses.map((item, key) => (
    <Row key={key} style={{ marginBottom: 10 }}>
      <Card
        title={item.name}
        extra={
          <Button
            type="primary"
            icon="check-circle"
            onClick={() => onSelect(item)}
          >
            选此楼盘
          </Button>
        }
      >
        <Tag>
          房屋：{item.remaining.dwelling || 0}/{item.count.dwelling || 0}
        </Tag>
        <Tag>
          停车位：{item.remaining.parking || 0}/{item.count.parking || 0}
        </Tag>
        <Tag>
          贮藏室：{item.remaining.storeroom || 0}/{item.count.storeroom || 0}
        </Tag>
        <Tag>
          露台：{item.remaining.terrace || 0}/{item.count.terrace || 0}
        </Tag>
      </Card>
    </Row>
  ));
};

@inject("stores")
@observer
class BuildingList extends Component {
  state = { building: null };
  handleSelectBuilding = number => {
    this.setState({ building: number });
  };

  render() {
    const { buildings, loading } = this.props.stores.roomStore;
    const { roomType } = this.props;
    if (loading) return <Spin spinning={loading}></Spin>;
    // console.log(buildings[roomType]);
    // if (!this.state.building) {
    //   return Object.keys(buildings[roomType] || {}).map(key => (
    //     <Button
    //       key={key}
    //       style={{ margin: 5, width: 80, height: 40 }}
    //       onClick={() => this.handleSelectBuilding(key)}
    //     >
    //       {key}
    //     </Button>
    //   ));
    // }

    const numbers = Object.keys(buildings[roomType] || {});
    const selectedBuilding = this.state.building || numbers[0];
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
        <RoomList roomType={roomType} building={selectedBuilding} />;
      </>
    );
  }
}

@inject("stores")
@observer
class RoomList extends Component {
  handleSelectRoom = room => {
    this.props.stores.roomStore.selectRoom(room);
  };

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
        disabled={item.quotaID !== 0}
        onClick={() => this.handleSelectRoom(item)}
      >
        选择
      </Button>
    );
  };

  getColumns = roomType => {
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
          { dataIndex: "profile.area", title: "预测面积" },
          { dataIndex: "profile.price", title: "定价" },
          { dataIndex: "id", title: "操作", render: this.renderOperateColumn }
        ];
    }
  };
  render() {
    const { roomType, building } = this.props;
    const { rooms } = this.props.stores.roomStore;
    const list = rooms[roomType].filter(
      e =>
        e.quotaID === 0 &&
        ((e.profile.area === building && e.type === 2) ||
          e.profile.building === building)
    );

    return (
      <Table
        rowKey="id"
        dataSource={list}
        columns={this.getColumns(roomType)}
      />
    );
  }
}
