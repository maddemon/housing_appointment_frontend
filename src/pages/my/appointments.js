import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { PageHeader, Card, Spin } from 'antd'
import moment from 'moment'

@inject('stores')
@observer
export default class UserAppointmentsPage extends Component {
    async componentWillMount() {
        this.props.stores.globalStore.setTitle('我的预约');
        await this.props.stores.appointmentStore.getMyList();
    }
    render() {
        const { myList, loading } = this.props.stores.appointmentStore;
        return (
            <div>
                <PageHeader title="我的预约" subTitle="查询您的预约记录" />
                <Spin spinning={loading}>
                    {(myList || []).map((item, i) => <UserAppointmentItemControl key={i} model={item} />)}
                </Spin>
            </div>
        )
    }
}

const UserAppointmentItemControl = (props) => {
    const model = props.model;
    return <Card title={model.batchName}>
        <p>预约时间：{moment(model.reserveTime).format('LLL')}</p>
        <p>所用指标：{model.quotaUuid}</p>
        <p>房屋地址：{model.houseAddress}</p>
        <p>选房时间：{moment(model.chooseTime).format('L')}</p>
        <p>选房地点：{model.chooseAddress}</p>
    </Card>
}