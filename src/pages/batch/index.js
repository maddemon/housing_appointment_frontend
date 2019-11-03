import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { PageHeader, Icon, Button, Row, message, Modal, Tag, Table, Card, Descriptions, Pagination } from 'antd'
import moment from 'moment'
import EditModal from './edit'

@inject('stores')
@observer
export default class BatchIndexPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('批次管理');
        this.props.stores.houseStore.getList({ pageSize: 999 });
        this.loadData(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.search !== nextProps.location.search) {
            this.loadData(nextProps)
        }
    }

    loadData = (props) => {
        this.props.stores.batchStore.getList()
    }

    handleSubmitForm = result => {
        if (result.ok) {
            message.success("操作完成");
            this.loadData()
        }
    }

    handleDelete = async item => {
        Modal.confirm({
            title: "确认",
            content: "你确定要删除该批次吗？",
            onOk: async () => {
                const result = await this.props.stores.batchStore.delete(item.id);
                if (result.ok) {
                    message.success("操作完成");
                    this.loadData()
                }
            },
        })
    }

    handleNotify = (item) => {
        Modal.confirm({
            title: "你确定要发送通知短信吗？",
            content: "全体预约通知将会发送大量短信，同时阿里云服务器会扣除响应的费用，你确定此操作吗？",
            onOk: async () => {
                const result = await this.props.stores.messageStore.sendAppointmentMessage(item.id)
                if (result.ok) {
                    message.success(result.message)
                }
            },
        })
    }

    handleRedirectToAppointmentPage = (batchId) => {
        this.props.history.push('/appointment/index?batchId=' + batchId)
    }
    handleRedirectToChoosePage = (batchId) => {
        this.props.history.push('/batch/choosePermit?batchId=' + batchId)
    }
    handleRedirectToResultPage = (batchId) => {
        this.props.history.push('/batch/chooseResult?batchId=' + batchId)
    }
    houseColumnRender = (text, item) => {
        return item.houses.map((item, key) => <Tag key={key}>{item.name}</Tag>)
    }

    chooseColumnRender = (text, item) => {
        return <span className="date">{moment(item.chooseBeginDate).format('ll')} - {moment(item.chooseEndDate).format('ll')}</span>
    }

    appointmentColumnRender = (text, item) => {
        return <span className="date">{moment(item.appointmentBeginTime).format('ll')} - {moment(item.appointmentEndTime).format('ll')}</span>
    }

    nameColumnRender = (text, item) => {
        if (item.last) {
            return <span>{text} <Tag>尾批</Tag></span>
        }
        return <span>{text}</span>
    }
    operateColumnRender = (text, item) => {
        const canNotify = moment(item.appointmentEndTime) > moment()
        const canViewResult = moment(item.chooseBeginDate) <= moment();
        const canDelete = moment(item.appointmentBeginTime) > moment()
        var result = []
        if (canNotify)
            result.push(<Button key="btnNotify" onClick={this.handleNotify} type="primary"><Icon type="bell" />预约通知</Button>)
        else
            result.push(<Button key="btnAppointment" onClick={() => this.handleRedirectToAppointmentPage(item.id)}><Icon type="clock-circle" />预约管理</Button>)
        result.push(<Button key="btnChoose" onClick={() => this.handleRedirectToChoosePage(item.id)} type="primary"><Icon type="check" />选房</Button>)
        if (canViewResult)
            result.push(<Button key="btnResult" onClick={() => this.handleRedirectToResultPage(item.id)} type="default"><Icon type="file-search" />选房结果</Button>)
        result.push(<EditModal key="edit" model={item} trigger={<Button icon="edit" title="修改" />} onSubmit={this.handleSubmitForm} />)
        if (canDelete)
            result.push(<Button key="delete" title="删除" icon="delete" onClick={this.handleDelete} />)
        return <Button.Group>{result}</Button.Group>
    }

    render() {
        const { list } = this.props.stores.batchStore
        return (
            <Row>
                <PageHeader title="批次管理" />
                <div className="toolbar">
                    <Button.Group>
                        <EditModal title="添加批次" trigger={<Button type="primary"><Icon type="plus" /> 添加批次</Button>} onSubmit={this.handleSubmitForm} />
                    </Button.Group>
                </div>
                <Row gutter={16}>
                    {list.map((item) => <Card key={item.id}>
                        <Descriptions title={this.nameColumnRender(item.name, item)} bordered column={{ md: 2, sm: 1, xs: 1 }}>
                            <Descriptions.Item label="编号">{item.id}</Descriptions.Item>
                            <Descriptions.Item label="楼盘">{this.houseColumnRender('', item)}</Descriptions.Item>
                            <Descriptions.Item label="预约时段">{this.appointmentColumnRender('', item)}</Descriptions.Item>
                            <Descriptions.Item label="选房地点">{item.chooseAddress}</Descriptions.Item>
                            <Descriptions.Item label="管理">{this.operateColumnRender('', item)}</Descriptions.Item>
                        </Descriptions>
                    </Card>)}
                </Row>
            </Row >
        )
    }
}