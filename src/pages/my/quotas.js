import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Empty, Tag, PageHeader, Spin, Card } from 'antd'
import AppointmentStepsControl from './_steps'
@inject('stores')
@observer
class UserQuotaPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('预约选房');
        this.props.stores.permitStore.getMyList();
    }

    handleQuotaClick = (item) => {
        this.props.history.push('/appointment/make')
    }

    render() {

        const { myList, loading } = this.props.stores.permitStore;

        return (
            <>
                <PageHeader
                    title="预约选房"
                    subTitle="点击您的购房资格，进行预约"
                />
                <AppointmentStepsControl step={0} />
                <Spin spinning={loading}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                        {(myList || []).length === 0 ? <Empty description="暂无可用购房证"></Empty> :
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
            <Card title={`准购证号：${model.code}`} style={{ marginBottom: '10px' }}>
                {model.quotas.map(item => <QuotaItem key={item.quotaId} model={item} onClick={this.props.onClick} />)}
            </Card>
        )
    }
}

@inject('stores')
@observer
class QuotaItem extends Component {

    handleItemClick = () => {
        const item = this.props.model;
        this.props.stores.quotaStore.selectModel(item);
        this.props.onClick(item);
    }

    render() {
        const item = this.props.model;
        const quota = new Quota(item);
        return (
            <Col xxl={12} xl={12} lg={12} key={quota.id + Math.random()}>
                <Button onClick={this.handleItemClick}
                    style={{ width: '100%', height: '100px', marginTop: '10px' }}
                    disabled={quota.disabled}>
                    <h3>资格证号:{quota.permitCode}-{quota.quotaCode}</h3>
                    <small>
                        <Tag color={quota.disabled ? "gray" : "green"}>
                            {quota.my ? '我' : quota.userName}的
                        </Tag>
                        <Tag color={quota.stateColor}>
                            {quota.stateText}
                        </Tag>
                    </small>
                </Button>
            </Col>
        )
    }
}


function Quota(model) {
    Object.assign(this, model);
    this.stateText = '';
    this.stateColor = 'gray'
    this.disabled = true;
    switch (model.state) {
        case '-1':
            this.stateText = '尾批';
            this.stateColor = 'red';
            break;
        default:
        case '0':
            this.stateText = '未预约';
            this.disabled = !this.my;
            break;
        case '1':
            this.stateText = '等待他人预约';
            this.stateColor = 'blue';
            break;
        case '2':
            this.stateText = '已预约';
            this.stateColor = 'blue';
            break;
        case '3':
            this.stateText = '已入围（正选）';
            this.stateColor = 'green';
            break;
        case '4':
            this.stateText = '预约成功';
            this.stateColor = 'blue';
            break;
        case '5':
            this.stateText = '已选房';
            this.stateColor = 'green';
            break;
    }
}