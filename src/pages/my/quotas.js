import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Empty, Tag, PageHeader, Spin } from 'antd'
import AppointmentStepsControl from './_steps'
@inject('stores')
@observer
class UserQuotaPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('我的指标');
        this.props.stores.quotaStore.setMyList();
    }

    render() {

        const { myList, loading } = this.props.stores.quotaStore;

        return (
            <>
                <PageHeader
                    title="我的指标"
                    subTitle="点击指标进行预约"
                />
                <AppointmentStepsControl step={0} />
                <Spin spinning={loading}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                        {(myList || []).length === 0 ? <Empty description="暂无可用指标"></Empty> : myList.map((item, i) => <QuotaItem key={i} model={item} {...this.props} />)}
                    </Row>
                </Spin>
            </>
        )
    }
}
export default UserQuotaPage

class QuotaItem extends Component {

    handleItemClick = (item) => {
        this.props.stores.quotaStore.setSelected(item);
        this.props.history.push('/appointment/make')
    }

    render() {
        const item = this.props.model;
        return (
            <Col xxl={12} xl={12} lg={12} key={item.uuid + Math.random()}>
                <Button onClick={() => this.handleItemClick(item)} style={{ width: '100%', height: '100px', marginTop: '10px' }} disabled={item.quotaStatus === 1}>
                    <h3>指标{item.uuid}</h3>
                    <small>{item.quotaStatus ? <Tag color="green">已使用</Tag> : <Tag color="gray">待预约</Tag>}</small>
                </Button>
            </Col>
        )
    }
}
