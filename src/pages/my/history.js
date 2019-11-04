import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { PageHeader, Card, Spin, Row, Descriptions } from 'antd'
import moment from 'moment'
import StatusTag from '../shared/_statusTag'

@inject('stores')
@observer
export default class UserAppointmentsPage extends Component {
    async componentWillMount() {
        this.props.stores.globalStore.setTitle('预约记录');
        await this.props.stores.appointmentStore.getList();
    }
    render() {
        let { list, loading } = this.props.stores.appointmentStore;
        list = list || [];
        return (
            <div>
                <PageHeader title="我的预约" subTitle="查询您的预约记录" />
                <Spin spinning={loading}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                        {(list || []).map((item, i) => <UserAppointmentItemControl key={i} model={item} />)}
                    </Row>
                </Spin>
            </div>
        )
    }
}

const UserAppointmentItemControl = (props) => {
    const model = props.model;
    return (
        <Card>
            <Descriptions title={<span>预约编号</span>} bordered column={{ md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="批次名称">{model.batchName}</Descriptions.Item>
                <Descriptions.Item label="准购证号">{model.code}</Descriptions.Item>
                <Descriptions.Item label="预约时间">{moment(model.createTime).format('LLL')}</Descriptions.Item>
                <Descriptions.Item label="预约状态">
                    <StatusTag status={model.status} text={model.statusText} />
                </Descriptions.Item>
                <Descriptions.Item label="姓名">{model.user}</Descriptions.Item>
                <Descriptions.Item label="共有人">
                    {model.shareUsers.map(item => <StatusTag status={item.status} text={`${item.user} ${item.statusText}`}/> )}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    )
}