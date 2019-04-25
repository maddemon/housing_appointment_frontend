import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, PageHeader, Alert, Icon, Card, Tag, message, Modal, Spin } from 'antd'
import AppointmentStepsControl from './_steps'
import moment from 'moment'

@inject('stores')
@observer
export default class MakeAppointmentPage extends Component {

    state = { step: 1, selectedBatch: null }

    componentWillMount() {
        this.props.stores.globalStore.setTitle('预约选房');
        this.props.stores.batchStore.setList(1, 100);
    }

    handleBack = () => {
        this.props.history.goBack();
    }

    handleItemClick = (batch) => {
        this.setState({ step: 2, selectedBatch: batch })
    }



    render() {
        const quota = this.props.stores.quotaStore.selected;
        if (!quota) {
            return <h1>没有选择指标</h1>
        }
        let { list, loading } = this.props.stores.batchStore;
        list = (list || []).filter(e => moment(e.appointmentTimeEnd) > moment());
        return (
            <>
                <PageHeader title="预约选房" tags={<Tag color="red">已选指标{quota.uuid}</Tag>} onBack={this.handleBack} />
                <AppointmentStepsControl step={this.state.step} />
                <Spin spinning={loading}>
                    {list.length === 0 ?
                        <Alert type="error" message={"当前没有可以预约的批次，请耐心关注下一批次开放预约时间。"} icon="bell"></Alert>
                        :
                        !this.state.selectedBatch ?
                            <Row gutter={10}>
                                {list.map((item, i) => <Col key={i} lg={12} xl={12} xxl={12}>
                                    <BatchItemControl model={item} handleClick={this.handleItemClick} />
                                </Col>)}
                            </Row>
                            :
                            <SelectedBatchControl model={this.state.selectedBatch} />
                    }
                </Spin>
            </>
        )
    }
}

const SelectedBatchControl = props => {
    const { model } = props
    return (
        <Card hoverable={false}
            title={`您已预约${model.name}`}
        >
            <BatchDetailControl model={model} />
        </Card>
    )
}

const BatchDetailControl = props => {
    const { model } = props
    return <div>
        <p>房屋数量：{model.houseNumber}</p>
        <p>房屋地址：{model.houseAddress}</p>
        <p>选房时间：{moment(model.chooseTime).format('LL')}</p>
        <p>选房地点：{model.chooseAddress}</p>
        <p>预约开始时间：{moment(model.appointmentTimeStart).format('LLL')}</p>
        <p>预约截止时间：{moment(model.appointmentTimeEnd).format('LLL')}</p>
    </div>
}

@inject('stores')
class BatchItemControl extends Component {

    handleClick = () => {
        const batch = this.props.model
        const quota = this.props.stores.quotaStore.selected;
        if (!quota) {
            message.warning("没有选择指标");
            return;
        }
        Modal.confirm({
            title: "确认",
            okText: "预约",
            cancelText: "再想想",
            content: <div>
                <p>已选批次：{batch.name}</p>
                <p>已选指标：{quota.uuid}</p>
                <p>当前日期：{moment().format('LL')}</p>
            </div>,
            onOk: async () => {
                const result = await this.props.stores.appointmentStore.make(batch.uuid, quota.uuid)
                if (result === '200') {
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
        if (moment(model.appointmentTimeStart) > moment()) {
            return <Tag color="warning">尚未开始</Tag>
        }
        else if (moment(model.appointmentTimeEnd) < moment()) {
            return <Tag color="gray">预约已结束</Tag>
        }
        return <Button type="primary" onClick={this.handleClick}><Icon type="plus" />我要预约</Button>
    }

    render() {
        const { model } = this.props
        return (
            <Card
                hoverable={false}
                title={model.name}
                extra={this.extraRender(model)}
            >
                <BatchDetailControl model={model} />
            </Card>
        )
    }
}