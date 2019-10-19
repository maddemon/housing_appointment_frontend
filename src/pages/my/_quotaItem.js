import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button,  Descriptions } from 'antd'
import StatusTag from '../shared/_statusTag'
@inject('stores')
@observer
export default class QuotaItemControl extends Component {
    handleClick = () => {
        this.props.onClick(this.props.model)
    }

    extraRender = () => {
        const model = this.props.model

        if (model.mine && this.props.onClick) {
            let showButton = model.status <= 0;
            if (model.status === -1) {
                const batch = this.props.store.batchStore.model
                showButton = batch.last;
            }
            if (showButton) {
                return <Button type="primary" onClick={this.handleClick}>选用此资格预约</Button>
            }
        }

        return <StatusTag status={model.status} text={model.statusText} />
    }
    
    render() {
        const model = this.props.model

        return (
            <Descriptions title={<span>姓名：{model.user} &nbsp;&nbsp;&nbsp;&nbsp;{this.extraRender(model)}</span>} bordered column={{ md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="准购证号">{model.permitCode}-{model.quotaCode}</Descriptions.Item>
                <Descriptions.Item label="打印时间">{model.printTime}</Descriptions.Item>
                <Descriptions.Item label="备注">{model.remark}</Descriptions.Item>
            </Descriptions>

        )
    }
}
