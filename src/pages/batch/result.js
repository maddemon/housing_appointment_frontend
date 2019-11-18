import React, { Component } from "react";
import { Row, Col, Layout, Tag } from "antd";
import { inject, observer } from "mobx-react";
import { QueryString } from "../../common/utils";
import moment from "moment";

@inject("stores")
@observer
export default class BatchChooseResultPage extends Component {
  state = { timer: null };

  async componentWillMount() {
    const query = QueryString.parseJSON(this.props.location.search);
    await this.props.stores.batchStore.getModel(query.batchId);

    let timer = setInterval(this.loadData, 3000);
    this.setState({ timer });
  }

  loadData = () => {
    const query = QueryString.parseJSON(this.props.location.search);
    this.props.stores.batchStore.getChooseResult(query.batchId);
  };

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  render() {
    const { model, result, loading } = this.props.stores.batchStore;
    if (!model) return null;

    return (
      <div>
        <Layout.Header>
          <h1 style={{ color: "#fff", textAlign: "center" }}>
            {model.name} {moment().format("ll")}选房结果
          </h1>
        </Layout.Header>
        <Row style={{ margin: "2px" }}>
          {result.map((item, key) => (
            <Tag color={item.colorFlag} key={key} style={{ marginTop: "2px" }}>
              {item.houseName}
              <br />
              {item.building} - {item.number}
            </Tag>
          ))}
        </Row>
      </div>
    );
  }
}
