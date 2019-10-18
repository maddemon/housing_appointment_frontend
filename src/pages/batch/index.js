import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { PageHeader, Icon, Button, Row, message, Modal, Tag, Table } from 'antd'
import moment from 'moment'
import EditModal from './edit'

@inject('stores')
@observer
export default class BatchIndexPage extends Component {

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('批次管理');
        this.props.stores.houseStore.getList({ pageSize: 999 });
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

    handleSubmitForm = async result => {
        if (result.ok) {
            message.success("操作完成");
            await this.loadData()
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
                const result = await this.props.stores.batchStore.notify(item.id)
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
        this.props.history.push('/batch/choose?batchId=' + batchId)
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
        return <span className="date">{moment(item.appointmentBeginDate).format('ll')} - {moment(item.appointmentEndDate).format('ll')}</span>
    }

    nameColumnRender = (text, item) => {
        if (item.last) {
            return <span>{text} <Tag>尾批</Tag></span>
        }
        return <span>{text}</span>
    }
    operateColumnRender = (text, item) => {
        const canNotify = moment(item.appointmentEndTime) > moment()
        const canChoose = moment(item.chooseBeginDate) <= moment() && moment(item.chooseEndDate) >= moment();
        const canViewResult = moment(item.chooseBeginDate) <= moment();
        const canEdit = moment(item.chooseEndDate) > moment()
        const canDelete = moment(item.appointmentBeginTime) > moment()
        var result = []
        //if (canNotify) 
            result.push(<Button key="btnNotify" onClick={this.handleNotify} type="primary"><Icon type="bell"/>预约通知</Button>)
        //else 
            result.push(<Button key="btnAppointment" onClick={() => this.handleRedirectToAppointmentPage(item.id)}><Icon type="clock-circle" />预约管理</Button>)
        //if (canChoose) 
            result.push(<Button key="btnChoose" onClick={() => this.handleRedirectToChoosePage(item.id)} type="primary"><Icon type="check" />选房</Button>)
        //if (canViewResult) 
            result.push(<Button key="btnResult" onClick={() => this.handleRedirectToResultPage(item.id)} type="default"><Icon type="file-search" />选房结果</Button>)
        //if (canEdit) 
            result.push(<EditModal key="edit" model={item} trigger={<Button icon="edit" title="修改" />} onSubmit={this.handleSubmitForm} />)
        //if (canDelete) 
            result.push(<Button key="delete" title="删除" icon="delete" onClick={this.handleDelete} />)
        return <Button.Group>{result}</Button.Group>
    }

    render() {
        const { list, loading, page } = this.props.stores.batchStore
        return (
            <Row>
                <PageHeader title="批次管理" />
                <div className="toolbar">
                    <Button.Group>
                        <EditModal title="添加批次" trigger={<Button type="primary"><Icon type="plus" /> 添加批次</Button>} onSubmit={this.handleSubmitForm} />
                    </Button.Group>
                </div>
                <Row gutter={16}>
                    <Table
                        bordered={true}
                        loading={loading}
                        rowKey="id"
                        columns={[
                            { dataIndex: 'id', title: '编号', width: 75 },
                            { dataIndex: "name", title: "批次名称", render: this.nameColumnRender },
                            { title: "楼盘", render: this.houseColumnRender },
                            { dataIndex: "appointmentBeginTime", title: "预约时段", render: this.appointmentColumnRender },
                            { dataIndex: "chooseBeginDate", title: "选房时段", render: this.chooseColumnRender },
                            { dateIndex: "chooseAddress", title: '选房地点' },
                            { dataIndex: "操作", render: this.operateColumnRender }
                        ]}
                        dataSource={list}
                        pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                    ></Table>
                </Row>
            </Row >
        )
    }
}