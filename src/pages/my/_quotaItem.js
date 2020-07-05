import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Button, Card, Icon } from "antd";
import StatusTag from "../shared/_statusTag";

@inject("stores")
@observer
export default class QuotaItemControl extends Component {
  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.model);
    }
  };

  handleClick = (userQuota) => {
    if (this.props.onClick) {
      this.props.onClick(userQuota);
    }
  };

  render() {
    const model = this.props.model;
    const batch = this.props.stores.batchStore.model;

    const myQuota = model.users.find(e => e.mine);


    const showButton = myQuota && (myQuota.status === 0 || (myQuota.status === 5 && batch.last));
    const userName = model.users.map(e => e.user).join();

    return (
      <Card>
        <div style={{ margin: 5 }}>
          {userName}
          （{model.permitCode}-{model.quotaCode}）
           {model.users.map(userQuota => <StatusTag status={userQuota.status} text={userQuota.statusText} />)}
        </div>
        {showButton ? (
          <Button type="primary" onClick={() => this.handleClick(myQuota)}>
            <Icon type="check" />
            选择此购房资格
          </Button>
        ) : null}
      </Card>

      // <Button style={{ width: '100%', height: 80 }} disabled={disabled} onClick={this.handleClick} dashed>
      //     {model.user}（{model.permitCode}-{model.quotaCode}）  <br />
      //     <StatusTag status={model.status} text={model.statusText} />
      // </Button>
    );
  }
}
