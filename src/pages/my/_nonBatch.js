import React, { Component } from 'react'
import { Button,  Result } from 'antd'

export default class NonBatchControl extends Component {
    render() {
        return (
            <>
                <br />
                <Result
                    status="warning"
                    title="没有可以预约的批次"
                    // extra={
                    //     <Button type="primary" key="console" onClick={this.props.onClick}>
                    //         查看我的购房证
                    //     </Button>
                    // }
                >
                    <div className="desc">
                        <li>预约尚未开始或已结束</li>
                        <li>请留意预约通知短信</li>
                    </div>
                </Result>
            </>
        )
    }
}
