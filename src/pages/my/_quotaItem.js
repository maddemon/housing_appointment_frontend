import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Card, Tag, Descriptions } from 'antd'

@inject('stores')
@observer
export default class QuotaItemControl extends Component {
    handleClick = () => {
        this.props.onClick(this.props.model)
    }

    extraRender = () => {
        const model = this.props.model

        if (!model.mine || !this.props.onClick) {
            return this.statusTextRender();
        }

        let showButton = model.status <= 0;
        if (model.status === -1) {
            const batch = this.props.store.batchStore.model
            showButton = batch.last;
        }
        if (showButton) {
            return <Button type="primary" onClick={this.handleClick}>选用此资格预约</Button>
        }
        return this.statusTextRender();
    }
    statusTextRender = () => {
        const model = this.props.model;
        let color = "#2db7f5";
        switch (model.status) {
            default:
                color = "#999";
                break;
            case 1://等待他人
                color = "#2db7f5";
                break;
            case 2://已预约
                color = "#108ee9";
                break;
            case 3:
            case 4://已入围
            case 5://已选房
                color = "#87d068";
                break;
            case -1://放弃、尾批
                color = "#f50";
                break;
        }
        return <Tag color={color}>{model.statusText}</Tag>
    }
    render() {
        const model = this.props.model

        return (
            <Descriptions title={<span>姓名：{model.user} &nbsp;&nbsp;&nbsp;&nbsp;{this.extraRender(model)}</span>} bordered column={{ md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="资格证号">{model.permitCode}-{model.quotaCode}</Descriptions.Item>
                <Descriptions.Item label="打印时间">{model.printTime}</Descriptions.Item>
                <Descriptions.Item label="备注">{model.remark}</Descriptions.Item>
            </Descriptions>

        )
    }
}
