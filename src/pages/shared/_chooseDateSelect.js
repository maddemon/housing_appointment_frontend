import React, { Component } from "react";
import { Button, Calendar } from "antd";
import { observer, inject } from "mobx-react";
import moment from "moment";
import Drawer from "../shared/_drawer";

@inject("stores")
@observer
export default class ChooseDateControl extends Component {
  componentWillMount() {
    const batch = this.props.stores.batchStore.model;
    if (batch) {
      this.props.stores.chooseDateStore.getList(batch.id);
    }
  }

  dateCellRender = date => {
    const { list } = this.props.stores.chooseDateStore;
    date = moment(date.format("YYYY-MM-DDT00:00:00"));
    return (
      <ul>
        {list
          .filter(
            e => moment(e.Day).format("YYYYMMDD") === date.format("YYYYMMDD")
          )
          .map((item, key) => (
            <div key={key}>
              {item.hour} {item.currentNumber}
            </div>
          ))}
      </ul>
    );
  };

  render() {
    const { loading, list } = this.props.stores.chooseDateStore;
    const value = this.props.value;
    const selected = list.find(e => e.id === value);
    return (
      <Drawer
        width={"60%"}
        title="选房排期表"
        trigger={<Button>全部日期</Button>}
      >
        <Calendar
          loading={loading}
          value={selected ? moment(selected.day) : moment()}
          dateCellRender={this.dateCellRender}
          onSelect={this.handleSelectDay}
        />
      </Drawer>
    );
  }
}
