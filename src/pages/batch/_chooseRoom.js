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
  Result,
  Input
} from "antd";
import ChooseResult from "./_chooseResult";
import { RoomTypeNames } from "../../common/config";

import BuildingList from "../house/_buildingList";

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
            <BuildingList roomType="dwelling" action="choose" />
          </Tabs.TabPane>
          {rooms.parking ? (
            <Tabs.TabPane key="parking" tab="车位">
              <BuildingList roomType="parking" action="choose" />
            </Tabs.TabPane>
          ) : null}
          {rooms.storeroom ? (
            <Tabs.TabPane key="storeroom" tab="贮藏室">
              <BuildingList roomType="storeroom" action="choose" />
            </Tabs.TabPane>
          ) : null}
        </Tabs>
      </Spin>
    );
  };

  renderBody = () => {
    const batch = this.props.stores.batchStore;
    const quota = this.props.quota;

    const roomStore = this.props.stores.roomStore;
    const { chooseResult, selectedHouse, selectedRoom } = roomStore;

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
                loading={roomStore.loading}
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
              已选楼盘：
              <Tag color="red" style={{ fontSize: 20, padding: 5, margin: 5 }}>
                {selectedHouse.name}
              </Tag>
              <Button onClick={() => this.handleSelectHouse(null)} size="small">
                重选
              </Button>
            </div>
          ) : null}

          {Object.keys(selectedRoom || {}).map(key => {
            return (
              <div key={key}>
                已选{RoomTypeNames[key]}：
                <Tag
                  color="red"
                  style={{ fontSize: 20, padding: 5, margin: 5 }}
                >
                  {key === "parking" ? (
                    <span>
                      {selectedRoom[key].profile.area} -
                      {selectedRoom[key].profile.number}
                    </span>
                  ) : (
                    <span>
                      {selectedRoom[key].profile.building}号楼
                      {selectedRoom[key].profile.number}
                    </span>
                  )}
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
