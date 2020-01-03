import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Icon, Card, Tag, Descriptions, Typography } from 'antd'
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
        const isAppoinmentPage = this.props.isAppoinmentPage
        return (
            <>
                <Card title={<span>
                    {model.name}
                    {model.last ? <Tag color="#f50">尾批</Tag> : null}
                </span>}
                    extra={isAppoinmentPage ?
                        <Tag color="#f50"><Icon type="check" /> 已选</Tag>
                        :
                        <Button type="primary" onClick={this.handleClick}>
                            <Icon type="form" />
                            开始预约
                    </Button>
                    }
                >
                    <p>{moment(model.appointmentBeginTime).format('lll')} —— {moment(model.appointmentEndTime).format('lll')}</p>
                    <p>
                        选房地点：{model.chooseAddress}
                    </p>
                </Card>
                <br />

                {isAppoinmentPage ? null :
                    <Card title="楼盘信息">
                        {model.houses.map((house, key) => (
                            <span key={key}>
                                <h3>{house.name}</h3>
                                <p>地址：{house.address}</p>
                            </span>
                            // <Descriptions key={key} bordered column={{ md: 2, sm: 1, xs: 1 }}>
                            //     <Descriptions.Item label="楼盘名称">
                            //         {house.name}
                            //     </Descriptions.Item>
                            //     <Descriptions.Item label="房屋地址">
                            //         {house.address}
                            //     </Descriptions.Item>
                            //     <Descriptions.Item label="房屋总数">
                            //         {house.count.dwelling}套
                            //     </Descriptions.Item>
                            //     <Descriptions.Item label="剩余房屋数量">
                            //         <h3>{house.remaining.dwelling}套</h3>
                            //     </Descriptions.Item>
                            // </Descriptions>
                        ))}
                    </Card>
                }
            </>
        )
    }
}
