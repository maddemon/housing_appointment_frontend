import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, PageHeader, Alert, Icon, Card, Tag, message, Modal, Spin, Statistic, Result } from 'antd'
import AppointmentStepsControl from './_steps'
import moment from 'moment'
import { QueryString } from '../../common/utils'

@inject('stores')
@observer
export default class MakeAppointmentPage extends Component {

    state = { step: 1, selectedBatch: null, pageIndex: 1, pageSize: 100 }

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('预约选房');
        await this.loadList()
    }

    loadList = async (props) => {
        props = props || this.props
        const query = QueryString.parseJSON(props.location.search)
        await this.props.stores.quotaStore.getModel(query.userQuotaId)
        await this.props.stores.batchStore.getAvaliables()
    }

    handleBack = () => {
        this.props.history.goBack();
    }

    handleItemClick = (batch) => {
        this.setState({ step: 2, selectedBatch: batch })
    }

    render() {
        const quota = this.props.stores.quotaStore.model;
        if (!quota) {
            return <h1>没有选择购房证</h1>
        }
        const { avaliables, loading } = this.props.stores.batchStore;

        return (
            <>
                <PageHeader title="预约选房" tags={<Tag color="red">已选购房证 {quota.permitCode}-{quota.quotaCode}</Tag>} onBack={this.handleBack} />
                <AppointmentStepsControl step={this.state.step} />
                <Spin spinning={loading}>
                    {avaliables.length === 0 ?
                        <Alert type="error" message={"当前没有可以预约的批次，请耐心关注下一批次开放预约时间。"} icon="bell"></Alert>
                        :
                        !this.state.selectedBatch ?
                            <Row gutter={10}>
                                {avaliables.map((item, i) => <Col key={i} lg={12} xl={12} xxl={12}>
                                    <BatchItemControl model={item} handleClick={this.handleItemClick} />
                                </Col>)}
                            </Row>
                            :
                            <SelectedBatchControl batch={this.state.selectedBatch} quota={quota} />
                    }
                </Spin>
            </>
        )
    }
}

const SelectedBatchControl = props => {
    const { batch } = props

    return (
        <Result
            status="success"
            title={`您已经预约了${batch.name}在线选房`}
            subTitle={`系统将在${moment(batch.appointmentEndTime).add(1, "days").format('ll')}发送入围通知短信，请留意您的短信，方便查看是否入选。`}
        >
            <BatchDetailControl model={batch}></BatchDetailControl>
        </Result>

    )
}

const BatchDetailControl = props => {
    const { model, successState } = props
    return <div>
        {successState ?
            <Row>
                <Col span={12}>
                    <Statistic title="房屋数量" value={successState.houseNumber}></Statistic>
                </Col>
                <Col span={12}>
                    <Statistic title="已预约数量" value={successState.successCount}></Statistic>
                </Col>
            </Row>
            : null}
        <p></p>
        <p>房屋地址：{model.houseAddress}</p>
        <p>选房时间：{moment(model.chooseTime).format('LL')}</p>
        <p>选房地点：{model.chooseAddress}</p>
        <p>预约开始时间：{moment(model.appointmentBeginTime).format('LLL')}</p>
        <p>预约截止时间：{moment(model.appointmentEndTime).format('LLL')}</p>
    </div>
}

@inject('stores')
@observer
class BatchItemControl extends Component {
    componentWillMount() {
        moment.locale('zh-cn')
        const timer = setInterval(this.getSuccessState, 1000 * 2);
        this.setState({ timer })
    }
    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    getSuccessState = async () => {
        const batch = this.props.model
        await this.props.stores.appointmentStore.getSuccessState(batch.id)
    }


    handleClick = () => {
        const batch = this.props.model
        const quota = this.props.stores.quotaStore.model;
        if (!quota) {
            message.warning("没有选择购房证");
            return;
        }
        Modal.confirm({
            title: "确认",
            okText: "预约",
            cancelText: "再想想",
            content: <div>
                <p>已选批次：{batch.name}</p>
                <p>已选购房证：{quota.permitCode}-{quota.quotaCode}</p>
                <p>当前日期：{moment().format('LL')}</p>
                <p style={{ color: 'red' }}>系统将在{moment(batch.appointmentEndTime).add(1, "days").format('ll')}发送入围通知短信，请留意您的短信，方便查看是否入选。</p>
            </div>,
            onOk: async () => {
                const result = await this.props.stores.appointmentStore.make(batch.id, quota.quotaId)
                if (result.status === '200') {
                    message.success("预约成功");

                    this.props.handleClick(batch);
                }
                else {
                    //message.error("预约失败：" + result.message)
                }
            }
        })
    }

    extraRender = (model) => {
        if (moment(model.appointmentBeginTime) > moment()) {
            return <Tag color="warning">尚未开始</Tag>
        }
        else if (moment(model.appointmentEndTime) < moment()) {
            return <Tag color="gray">预约已结束</Tag>
        }
        return <Button type="primary" onClick={this.handleClick}><Icon type="plus" />我要预约</Button>
    }

    render() {
        const { model } = this.props
        const successState = this.props.stores.appointmentStore.successState[model.id] || {}
        return (
            <Card
                hoverable={false}
                title={model.name}
                extra={this.extraRender(model)}
            >
                <BatchDetailControl model={model} successState={successState} />
            </Card>
        )
    }
}