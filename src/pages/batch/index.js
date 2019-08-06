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
    }

    async componentWillReceiveProps(nextProps) {
        await this.loadData(nextProps);
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
        return (
            <Row>
                <PageHeader title="批次管理" />
                <div className="toolbar">
                    <Button.Group>
                        <EditModal title="添加批次" trigger={<Button type="primary"><Icon type="plus" /> 添加批次</Button>} onSubmit={this.handleSubmit} />
                    </Button.Group>
                </div>
                <Row gutter={16}>
                    {list.map(item => <Col key={item.uuid} xxl={12} xl={12} lg={12} md={12} xs={24}>
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
        return houses.filter(e => model.housesUuid.includes(e.uuid)).map(e => <Tag key={e.uuid}>{e.name}</Tag>)
    }

    handleRedirectToResultPage = async () => {
        await this.props.stores.batchStore.selectModel(this.props.model)
        this.props.history.push('/batch/chooseResult')
    }

    handleSubmit = () => {
        this.props.onSubmit(this.props.model)
    }
    handleDelete = () => {
        this.props.onDelete(this.props.model)
    }
    handleNotify = () => {
        this.props.onNotify(this.props.model)
    }

    getActions = () => {
        const model = this.props.model
        const canNotify = moment(model.appointmentTimeEnd) > moment()
        const canEdit = moment(model.chooseTime) > moment()
        const canDelete = moment(model.appointmentTimeStart) > moment()
        const result = [];


        if (canEdit) {
            result.push(<EditModal
                key="btnEdit"
                model={model}
                trigger={<Icon type="edit" title={canEdit ? "修改" : "批次已结束，无法修改"} />}
                onSubmit={this.handleSubmit} />)
        }
        if (canDelete) {
            result.push(<Icon title={canDelete ? "删除" : "预约已开始，无法删除"}
                key="btnDelete"
                type="delete"
                onClick={this.handleDelete}
            />)
        }
        return result;
    }

    extraRender = () => {
        const model = this.props.model
        const canNotify = moment(model.appointmentTimeEnd) > moment()
        if (canNotify) {
            return (
                <Button onClick={this.handleNotify} type="primary">
                    <Icon type="bell" />
                    发送预约通知
                    </Button>
            )
        } else {
            return (
                <Button onClick={this.handleRedirectToResultPage} >
                    <Icon type="profile" />查看选房结果
                </Button>
            );
        }
    }

    render() {
        const model = this.props.model
        return (
            <Card title={model.name}
                actions={this.getActions()}
                style={{ marginTop: "16px" }}
                extra={this.extraRender()}
            >
                <p>楼盘：{this.housesRender()}</p>
                <p>预约时间：{moment(model.appointmentTimeStart).format('YYYY-MM-DD HH:mm')} - {moment(model.appointmentTimeEnd).format('YYYY-MM-DD HH:mm')}</p>
                <p>选房日期：{moment(model.chooseTime).format('YYYY-MM-DD')}</p>
            </Card>
        )
    }
}
