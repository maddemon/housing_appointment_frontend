import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { PageHeader, Spin, Icon } from "antd";
import { QueryString } from "../../common/utils";
import HouseDetail from "./_houseDetail";

@inject("stores")
@observer
export default class Detail extends Component {
  componentWillMount() {
    this.loadList();
  }

  loadList = async props => {
    props = props || this.props;
    const query = QueryString.parseJSON(props.location.search);
    const houseId = query.id;
    if (houseId) {
      await this.props.stores.houseStore.getModel(houseId);
      await this.props.stores.roomStore.getRooms(houseId);
      this.props.stores.roomStore.getBuildings();
    }
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.loadList(nextProps);
    }
  }

  handleChangeHouse = val => {
    this.props.history.push("/house/detail?id=" + val);
  };

  render() {
    const { model } = this.props.stores.houseStore;
    const { loading, buildings } = this.props.stores.roomStore;
    return (
      <>
        <PageHeader
          title={"房屋信息"}
          subTitle={(model || {}).name}
          backIcon={<Icon type="left" />}
        />
        <Spin spinning={loading}>
          <HouseDetail buildings={buildings} />
        </Spin>
      </>
    );
  }
}
