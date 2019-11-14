import React, { Component } from "react";
import { Result, Button } from "antd";
import { withRouter } from "react-router-dom";

class NonBatch extends Component {
  render() {
    return (
      <Result
        status="404"
        title="没有可用批次"
        subTitle="系统没有找到可用的批次，是否没有创建？"
        extra={
          <Button
            type="primary"
            onClick={() => {
              this.props.history.push("/batch/index");
            }}
          >
            返回批次管理
          </Button>
        }
      />
    );
  }
}
export default withRouter(NonBatch);
