import React, { Component } from 'react'
import {Row, Steps, Divider } from 'antd'
export default class AppointmentSteps extends Component {
    render() {
        const current = this.props.step || 0;
        return (
            <Row>
                <Steps current={current} style={{ margin: '10px auto', width: '90%' }}>
                    <Steps.Step title="选择指标" description="选择你要使用的指标" />
                    <Steps.Step title="选择批次" description="选择你要预约的批次" />
                    <Steps.Step title="预约完成" description="提交预约申请" />
                </Steps>
                <Divider />
            </Row>
        )
    }
}
