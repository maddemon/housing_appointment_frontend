import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  PageHeader,
  Row,
  Spin,
  Tag,
  DatePicker,
  Radio,
  Button,
  Col
} from "antd";
import { QueryString, reloadPage } from "../../common/utils";
import HouseDetail from "../house/_houseDetail";

@inject("stores")
@observer
export default class BatchChooseResult extends Component {
  state = {};

  componentWillMount() {
    this.loadList();
  }

  loadList = async props => {
    props = props || this.props;
    const query = QueryString.parseJSON(props.location.search);
    const batchId = query.batchId;
    if (batchId) {
      await this.props.stores.batchStore.getModel(batchId);
      await this.props.stores.houseStore.getList({ batchId });
    }

    let houseId = query.houseId;
    if (!houseId) {
      houseId = this.props.stores.houseStore.list[0].id;
    }
    if (houseId) {
      this.props.stores.houseStore.getModel(houseId);
      await this.props.stores.roomStore.getRooms(houseId);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.loadList(nextProps);
    }
  }

  handleChangeHouse = e => {
    reloadPage(this.props, { houseId: e.target.value });
  };
  handleChangeDate = date => {
    this.setState({ date: date ? date.format("ll") : null });
  };
  handleExport = hasChoose => {
    const batch = this.props.stores.batchStore.model || {};
    window.open(
      `/api/batch/ExportChooseResult?refresh=true&batchId=${batch.id}&date=${this.state.date || ""}&hasChoose=${hasChoose === null ? "" : hasChoose}`
    );
  };

  handleExportStatistic = () => {
    const batch = this.props.stores.batchStore.model || {};
    window.open(
      `/api/batch/ExportStatistic?batchId=${batch.id}&date=${this.state.date || ""}`
    );
  };

  getHouseId = () => {
    const list = this.props.stores.houseStore.list;
    return list && list.length > 0 ? list[0].id : 0;
  };

  render() {
    const batch = this.props.stores.batchStore.model || {};
    const houseList = this.props.stores.houseStore.list || {};
    const house = this.props.stores.houseStore.model;
    if (!house) return null;
    const { loading, buildings } = this.props.stores.roomStore;
    const identity = this.props.stores.userStore.current();

    return (
      <div style={{ background: "#fff", padding: 10 }}>
        <PageHeader
          title={"楼盘选房情况"}
          subTitle={
            <span>
              <Tag color="red">{house.name}</Tag>
              <Tag color="blue">{batch.name}</Tag>
            </span>
          }
          extra={
            identity && identity.role === "admin" ? (
              <Row>
                <DatePicker onChange={this.handleChangeDate} />
                <Button type="primary" onClick={() => this.handleExport(true)}>
                  导出已选
                </Button>
                &nbsp;
                <Button type="primary" onClick={() => this.handleExport(false)}>
                  导出未选
                </Button>
                &nbsp;
                <Button type="primary" onClick={() => this.handleExport()}>
                  导出全部
                </Button>
                &nbsp;
                <Button
                  type="primary"
                  onClick={() => this.handleExportStatistic()}
                >
                  导出统计
                </Button>
              </Row>
            ) : null
          }
        />
        <div className="toolbar">
          <Radio.Group
            onChange={this.handleChangeHouse}
            defaultValue={house.id}
          >
            {houseList.map((item, key) => (
              <Radio.Button key={key} value={item.id}>
                {item.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <Spin spinning={loading}>
          <HouseDetail buildings={buildings} />
        </Spin>
      </div>
    );
  }
}
