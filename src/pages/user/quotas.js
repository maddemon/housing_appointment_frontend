import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Empty, Tag, PageHeader } from 'antd'
import AppointmentStepsControl from './_steps'
@inject('stores')
@observer
class UserQuotaPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('我的指标');
        this.props.stores.quotaStore.setMyList();
    }

    render() {

        const list = this.props.stores.quotaStore.myList || [];

        return (
            <>

                <PageHeader
                    title="我的指标"
                    subTitle="点击指标进行预约"
                />
                <AppointmentStepsControl step={0} />
                <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                    {list.length === 0 ? <Empty>暂无指标</Empty> : list.map((item,i) => <QuotaItem key={i} model={item} {...this.props} />)}
                </Row>
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
