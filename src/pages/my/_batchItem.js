import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Icon, Card, Tag, Descriptions } from 'antd'
import moment from 'moment'

@inject('stores')
@observer
export default class BatchItemControl extends Component {
    handleClick = () => {
        if (this.props.onClick)
            this.props.onClick(this.props.model)
    }

    render() {
        const model = this.props.model
        return (
            <Card>
                <Descriptions title={<span>
                    {model.name}
                    {model.last ? <Tag color="#f50">尾批</Tag> : null}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {this.props.isAppoinmentPage ?
                        <Tag color="#f50"><Icon type="check" /> 已选</Tag>
                        :
                        <Button type="primary" onClick={this.handleClick}>
                            <Icon type="form" />
                            开始预约
                    </Button>
                    }

                </span>} bordered column={{ md: 2, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="预约开始时间">
                        {moment(model.appointmentBeginTime).format('lll')}
                    </Descriptions.Item>
                    <Descriptions.Item label="预约结束时间">
                        {moment(model.appointmentEndTime).format('lll')}
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="选房开始日期">
                        {moment(model.chooseBeginTime).format('ll')}
                    </Descriptions.Item>
                    <Descriptions.Item label="选房结束日期">
                        {moment(model.chooseEndTime).format('ll')}
                    </Descriptions.Item> */}
                    <Descriptions.Item label="选房地点">
                        {model.chooseAddress}
                    </Descriptions.Item>
                </Descriptions>
                <br />
                {model.houses.map((house, key) => (
                    <Descriptions key={key} title="楼盘信息" bordered column={{ md: 2, sm: 1, xs: 1 }}>
                        <Descriptions.Item label="楼盘名称">
                            {house.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="房屋地址">
                            {house.address}
                        </Descriptions.Item>
                        <Descriptions.Item label="房屋总数">
                            {house.roomCount}套
                        </Descriptions.Item>
                        <Descriptions.Item label="剩余房屋数量">
                            <h3>{house.remainingRoomsCount}套</h3>
                        </Descriptions.Item>
                    </Descriptions>
                ))}
            </Card>
        )
    }
}
