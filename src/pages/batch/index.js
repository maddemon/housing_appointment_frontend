import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { PageHeader, Icon, Button, Row, Col, message, Modal, Tag, Card, Spin } from 'antd'
import moment from 'moment'
import EditModal from './edit'

@inject('stores')
@observer
export default class BatchIndexPage extends Component {

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('批次管理');
        this.props.stores.housesStore.getList(1, 99999);
        this.loadData(this.props)
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.location.search !== nextProps.location.search) {
            await this.loadData(nextProps)
        }
    }

    loadData = async (props) => {
        await this.props.stores.batchStore.getList()
    }

    handleSubmit = async result => {
        if (result.status === '200') {
            message.success(result.message);
            await this.loadData()
        }
    }
    handleDelete = async item => {
        Modal.confirm({
            title: "确认",
            content: "你确定要删除该批次吗？",
            onOk: async () => {
                const result = await this.props.stores.batchStore.delete(item.uuid);
                if (result.status === '200') {
                    message.success(result.message);
                    await this.loadData()
                }
            },
        })
    }
    handleNotify = (item) => {
        Modal.confirm({
            title: "摇号通知",
            content: "你确定要发送通知短信吗？",
            onOk: async () => {
                const result = await this.props.stores.batchStore.notify(item.uuid)
                if (result.status === '200') {
                    message.success(result.message)
                }
            },
        })
    }

    render() {
        const { list, loading } = this.props.stores.batchStore
        console.log('batch/index')
        return (
            <Row>
                <PageHeader title="批次管理" />
                <div className="toolbar">
                    <Button.Group>
                        <EditModal title="添加批次" trigger={<Button type="primary"><Icon type="plus" /> 添加批次</Button>} onSubmit={this.handleSubmit} />
                    </Button.Group>
                </div>
                <Row gutter={16}>
                    {list.map(item => <Col key={item.uuid} xxl={8} xl={8} lg={8} md={12} xs={24}>
                        <BatchItemControl
                            model={item}
                            history={this.props.history}
                            onSubmit={this.handleSubmit}
                            onDelete={this.handleDelete}
                            onNotify={this.handleNotify}
                        />
                    </Col>)}
                </Row>
            </Row >
        )
    }
}

@observer
@inject('stores')
class BatchItemControl extends Component {

    housesRender = () => {
        const model = this.props.model
        const houses = (this.props.stores.housesStore.list || [])
        return houses.filter(e => model.housesUuid.includes(e.housesUuid)).map((e,i) => <Tag key={i}>{e.name}</Tag>)
    }

    handleRedirectToResultPage = async () => {
        await this.props.stores.batchStore.selectModel(this.props.model)
        this.props.history.push('/batch/chooseResult')
    }

    handleDelete = () => {
        this.props.onDelete(this.props.model)
    }
    handleNotify = () => {
        this.props.onNotify(this.props.model)
    }

    extraRender = () => {
        const model = this.props.model
        const canNotify = moment(model.appointmentTimeEnd) > moment()
        const canEdit = moment(model.chooseTime) > moment()
        const canDelete = moment(model.appointmentTimeStart) > moment()
        var result = []
        if (canNotify) {
            result.push(<Button key="notify" onClick={this.handleNotify} type="primary" icon="bell" title="发送预约通知" />)
        }
        else {
            result.push(<Button key="result" onClick={this.handleRedirectToResultPage} type="default" icon="file-search" title="查看选房结果" />)
        }
        //if (canEdit) {
            result.push(<EditModal key="edit" model={model} trigger={<Button icon="edit" title="修改" />} onSubmit={this.props.onSubmit} />)
        //}
        if (canDelete) {
            result.push(<Button key="delete" title="删除" icon="delete" onClick={this.handleDelete} />)
        }
        return <Button.Group>{result}</Button.Group>
    }

    render() {
        const model = this.props.model
        return (
            <Card title={model.name}
                style={{ marginTop: "16px" }}
                extra={this.extraRender()}
            >
                <p>楼盘：{this.housesRender()}</p>
                <p>预约开始：{moment(model.appointmentTimeStart).format('YYYY-MM-DD HH:mm')} </p>
                <p>预约结束：{moment(model.appointmentTimeEnd).format('YYYY-MM-DD HH:mm')} </p>
                <p>选房日期：{moment(model.chooseTime).format('YYYY-MM-DD')}</p>
                <p>选房地点：{model.chooseAddress}</p>
            </Card>
        )
    }
}
