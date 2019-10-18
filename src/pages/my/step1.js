import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, PageHeader, Alert, Icon, Card, Tag, Spin, Descriptions } from 'antd'
import moment from 'moment'

@inject('stores')
@observer
export default class AppointmentStep1Page extends Component {

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('预约选房');
        await this.props.stores.batchStore.getAvaliables();
    }

    handleAppointmentClick = (batch) => {
        this.props.history.push('/appointment/step2?batchId=' + batch.id)
    }

    render() {
        const { avaliables, loading } = this.props.stores.batchStore;
        return (
            <>
                <PageHeader title="预约选房" />
                <Spin spinning={loading}>
                    {avaliables.length === 0 ?
                        <Alert type="error" message={"当前没有可以预约的批次，请耐心关注下一批次开放预约时间。"} icon="bell"></Alert>
                        :
                        avaliables.map((item, key) => <BatchItemControl model={item} key={key} onClick={this.handleAppointmentClick} />)
                    }
                </Spin>
            </>
        )
    }
}

class BatchItemControl extends Component {
    handleClick = () => {
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
                    <Button type="primary" onClick={this.handleClick}>
                        <Icon type="form" />
                        开始预约
                    </Button>
                </span>} bordered column={{ md: 2, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="预约开始时间">
                        {moment(model.appointmentBeginTime).format('ll')}
                    </Descriptions.Item>
                    <Descriptions.Item label="预约结束时间">
                        {moment(model.appointmentEndTime).format('ll')}
                    </Descriptions.Item>
                    <Descriptions.Item label="选房开始日期">
                        {moment(model.chooseBeginTime).format('ll')}
                    </Descriptions.Item>
                    <Descriptions.Item label="选房结束日期">
                        {moment(model.chooseEndTime).format('ll')}
                    </Descriptions.Item>
                    <Descriptions.Item label="选房地点">
                        {model.chooseAddress}
                    </Descriptions.Item>
                    <Descriptions.Item label="预约">
                    </Descriptions.Item>
                </Descriptions>
                <br />
                {model.houses.map((house, key) => (
                    <Descriptions title="楼盘信息" bordered  column={{ md: 2, sm: 1, xs: 1 }}>
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
