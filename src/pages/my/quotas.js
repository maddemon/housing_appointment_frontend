import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Empty, Tag, PageHeader, Spin, Card } from 'antd'
import AppointmentStepsControl from './_steps'
@inject('stores')
@observer
class UserQuotaPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('预约选房');
        this.props.stores.quotaStore.getMyList();
    }

    handleQuotaClick = (item) => {
        this.props.history.push('/appointment/make')
    }

    render() {

        const { myList, loading } = this.props.stores.quotaStore;

        return (
            <>
                <PageHeader
                    title="预约选房"
                    subTitle="点击您的购房资格，进行预约"
                />
                <AppointmentStepsControl step={0} />
                <Spin spinning={loading}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                        {(myList || []).length === 0 ? <Empty description="暂无可用指标"></Empty> :
                            myList.map((item, i) => <PermitItem key={i} model={item} onClick={this.handleQuotaClick} />)}
                    </Row>
                </Spin>
            </>
        )
    }
}
export default UserQuotaPage

@inject('stores')
class PermitItem extends Component {

    render() {
        const model = this.props.model;

        return (
            <Card title={`准购证号：${model.permitCode}`} style={{ marginBottom: '10px' }}>
                {model.quotas.map(item => <QuotaItem key={item.quotaUuid} model={item} onClick={this.props.onClick} />)}
            </Card>
        )
    }
}

@inject('stores')
@observer
class QuotaItem extends Component {

    handleItemClick = () => {
        const item = this.props.model;
        this.props.stores.quotaStore.selectQuota(item);
        this.props.onClick(item);
    }

    render() {
        const item = this.props.model;
        const disabled = !(item.state === '0' && item.my);
        return (
            <Col xxl={12} xl={12} lg={12} key={item.uuid + Math.random()}>
                <Button onClick={this.handleItemClick}
                    style={{ width: '100%', height: '100px', marginTop: '10px' }}
                    disabled={disabled}>
                    <h3>指标号：{item.quotaUuid}</h3>
                    <small>
                        <Tag color={disabled ? "gray" : "green"}>
                            {item.my ? '我' : item.userName}的
                        </Tag>
                        <Tag color={item.state === '1' ? "red" : "green"}>
                            {item.state === '1' ? '已使用' : '未使用'}
                        </Tag>
                    </small>
                </Button>
            </Col>
        )
    }
}
