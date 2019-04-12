import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { PageHeader, Card } from 'antd'

@inject('stores')
@observer
export default class UserAppointmentsPage extends Component {
    componentWillMount() {
        this.props.stores.globalStore.setTitle('我的预约');
    }
    render() {
        const list = this.props.stores.appointmentStore.myList;
        return (
            <div>
                <PageHeader title="我的预约" subTitle="查询您的预约记录" />
                {list.map(item => <UserAppointmentItemControl model={item} />)}
            </div>
        )
    }
}

const UserAppointmentItemControl = (props) => {
    const model = props.model;
    return <Card title={model.batchName}>
        <p>预约时间：{new Date(model.createTime).toLocaleString()}</p>
        <p>所用指标：{model.quotaUuid}</p>
        <p>房屋地址：{model.batchAddress}</p>
        <p>选房时间：{model.chooseTime}</p>
        <p>选房地点：{model.chooseAddress}</p>
    </Card>
}