import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Button, Card, Tag, Row, Result, Modal } from "antd";
import { RoomTypes } from "../../common/config";

@inject("stores")
@observer
export default class ChooseResult extends Component {
  handleResetResult = () => {

    Modal.confirm({
      title: "重置确认",
      content: "你确定要重置该用户的选房结果吗？",
      onOk: async () => {

        const { chooseResult } = this.props.stores.roomStore;
        if (chooseResult) {
          await this.props.stores.roomStore.resetResult(chooseResult.quotaId);
        }
        else {
          const quota = this.props.quota;
          if (quota) {
            await this.props.stores.roomStore.resetResult(quota.id);
          }
        }
        const batch = this.props.stores.batchStore.model;
        await this.props.stores.permitStore.getEnterList({ batchId: batch.id });
        if (this.props.onReset) {
          this.props.onReset();
        }
      }
    })

  }

  render() {
    const { chooseResult } = this.props.stores.roomStore;
    if (chooseResult) {
      if (chooseResult.houseId > 0) {
        return (
          <SuccessResult
            houseId={chooseResult.houseId}
            quotaId={chooseResult.quotaId}
            onReset={this.handleResetResult}
          />
        );
      } else {
        return <GiveupResult />;
      }
    }

    const quota = this.props.quota;
    if (!quota) return null;
    if (quota.users.find(e => e.status === 5)) {
      return <GiveupResult />;
    }

    const { roomStore } = this.props.stores;
    const rooms = roomStore.getResult(quota.id);
    if (!rooms || rooms.length === 0) {
      return null;
    }
    const houseId = rooms[0].houseID;
    let result = {};
    rooms.forEach(room => {
      const typeName = RoomTypes[room.type];
      result[typeName] = room;
    });
    return (
      <SuccessResult houseId={houseId} quotaId={quota.id} result={result} onReset={this.handleResetResult} />
    );
  }
}

class SuccessResult extends Component {
  handleExportClick = () => {
    const { houseId, quotaId } = this.props;
    window.open(
      `/api/house/DownloadAgreement?houseId=${houseId}&quotaId=${quotaId}`
    );
  };

  render() {
    const { result, onReset } = this.props;
    return (
      <Result
        status="success"
        title="恭喜您选房成功!"
        extra={[
          <Button type="primary" key="console" onClick={this.handleExportClick}>
            打印购房协议书
          </Button>,
          <Button type="danger" key="reset" onClick={onReset}>
            重新选房
          </Button>
        ]}
      >
        {result ? (
          <Card title={result.dwelling.houseName}>
            <Dwelling model={result.dwelling} />
            <Parking model={result.parking} />
            <Storeroom model={result.storeroom} />
            <Terrace model={result.terrace} />
          </Card>
        ) : null}
      </Result>
    );
  }
}

const GiveupResult = () => (
  <Result
    status="warning"
    title="您已经放弃此次选房!"
    subTitle="请等待最后一批次的选房消息"
  ></Result>
);

const Dwelling = ({ model }) => (
  <Row>
    住宅： <Tag>{model.profile.building}幢</Tag>
    <Tag>{model.profile.number}号</Tag>
    <Tag>{model.profile.area}平方米</Tag>
    <Tag>{model.profile.amount}元</Tag>
  </Row>
);

const Parking = ({ model }) =>
  model ? (
    <Row>
      停车位： <Tag>{model.profile.area}</Tag>
      <Tag>{model.profile.number}号</Tag>
      <Tag>{model.profile.price}元</Tag>
    </Row>
  ) : null;

const Storeroom = ({ model }) =>
  model ? (
    <Row>
      贮藏室： <Tag>{model.profile.building}幢</Tag>
      <Tag>{model.profile.number}号</Tag>
      <Tag>{model.profile.area}平方米</Tag>
      <Tag>{model.profile.price}元</Tag>
    </Row>
  ) : null;

const Terrace = ({ model }) =>
  model ? (
    <Row>
      露台： <Tag>{model.profile.building}幢</Tag>
      <Tag>{model.profile.number}号</Tag>
      <Tag>{model.profile.area}平方米</Tag>
      <Tag>{model.profile.price}元</Tag>
    </Row>
  ) : null;
