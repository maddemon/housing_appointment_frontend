import React, { Component } from "react";
import { Button, Calendar, Popover, Input } from "antd";
import { observer, inject } from "mobx-react";
import moment from "moment";

@inject("stores")
@observer
export default class ChooseDateControl extends Component {
  state = { visible: false };

  hide = () => {
    this.setState({ visible: false });
  };

  async componentWillMount() {
    const batch = this.props.stores.batchStore.model;
    if (batch) {
      await this.props.stores.chooseDateStore.getList(batch.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.value) {
      this.props.stores.chooseDateStore.clearModel();
    } else {
      this.props.stores.chooseDateStore.getModel(nextProps.value);
    }
  }

  handleSelect = item => {
    this.props.stores.chooseDateStore.getModel(item.id);
    if (this.props.onChange) {
      this.props.onChange(item);
    }
  };

  dateFullCellRender = date => {
    const batch = this.props.stores.batchStore.model;
    if (date < moment(batch.appointmentEndTime)) {
    }
    const { list } = this.props.stores.chooseDateStore;
    date = moment(date.format("YYYY-MM-DDT00:00:00"));
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 120,
          minWidth: 80,
          height: 80,
          textAlign: "center",
          padding: 5,
          border: "solid 1px #ddd"
        }}
        disabled={date < moment(batch.appointmentEndTime)}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: 3,
            opacity: 0.3
          }}
        >
          {date.date()}
        </div>
        <div style={{ clear: "both", marginTop: 15 }}>
          {list
            .filter(
              e => moment(e.Day).format("YYYYMMDD") === date.format("YYYYMMDD")
            )
            .map((item, key) => (
              <div key={key} style={{ marginTop: 2 }}>
                <Button size="small" onClick={() => this.handleSelect(item.id)}>
                  {item.hourText}
                  {item.currentNumber}
                </Button>
              </div>
            ))}
        </div>
      </div>
    );
  };

  handleReset = () => {
    this.props.stores.chooseDateStore.clearModel();
    this.handleSelect("");
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  render() {
    const batch = this.props.stores.batchStore.model;
    if (!batch) return null;

    const { loading, model } = this.props.stores.chooseDateStore;

    return (
      <Popover
        title="选房排期表"
        trigger="click"
        onVisibleChange={this.handleVisibleChange}
        visible={this.state.visible}
        content={
          <Calendar
            loading={loading}
            fullscreen={false}
            disabledDate={date => date < moment(batch.appointmentEndTime)}
            dateFullCellRender={this.dateFullCellRender}
          />
        }
      >
        <span>
          {model ? (
            <Input
              style={{ width: 150 }}
              allowClear={true}
              onChange={this.handleReset}
              value={`${moment(model.day).format("YYYY-MM-DD")}${
                model.hourText
              }`}
            />
          ) : (
            <Button icon="filter">筛选选房日期</Button>
          )}
        </span>
      </Popover>
    );
  }
}
