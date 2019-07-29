import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Button, Table, message, Modal, Tag } from 'antd'
import { QueryString } from '../../common/utils'
import moment from 'moment'
import EditModal from './edit'

@inject('stores')
@observer
export default class BatchIndexPage extends Component {

    state = { pageIndex: 1, pageSize: 20 }
    async componentWillMount() {
        this.props.stores.globalStore.setTitle('批次管理');
        this.props.stores.housesStore.getList(1, 99999);
    }

    async componentWillReceiveProps(nextProps) {
        await this.loadData(nextProps);
    }

    loadData = async (props) => {
        props = props || this.props;
        let query = QueryString.parseJSON(props.location.search)
        await this.setState({ pageIndex: query.pageIndex || 1 });
        await this.props.stores.batchStore.getList(this.state.pageIndex, this.state.pageSize)
    }

    handlePageChange = page => {
        this.props.history.push(`/batch/index?page=${page}`)
    }

    handleSubmit = async result => {
        if (result.status === '200') {
            message.success(result.message);
            await this.props.stores.batchStore.getList(this.state.pageIndex, this.state.pageSize)
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
                    await this.props.stores.batchStore.getList(this.state.pageIndex, this.state.pageSize)
                }
            },
        })
    }

    handleNotifyClick = (item) => {
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

    operateColumnRender = (text, item) => {
        const canNotify = moment(item.appointmentTimeEnd) > moment()
        const canEdit = moment(item.chooseTime) > moment()
        const canDelete = moment(item.appointmentTimeStart) > moment()
        let buttons = [
            <Button
                key="btnNotify"
                title={canNotify ? "发送预约通知" : "预约时间已结束，不可使用"}
                disabled={!canNotify}
                type="default"
                onClick={() => this.handleNotifyClick(item)}
            >
                <Icon type="bell" />通知
            </Button>,
            <EditModal key="btnEdit" model={item} trigger={<Button title={canEdit ? "修改" : "批次已结束，无法修改"} disabled={!canEdit}><Icon type="edit" /></Button>} onSubmit={this.handleSubmit} />,
            <Button title={canDelete ? "删除" : "预约已开始，无法删除"} disabled={!canDelete} key="btnDelete" type="danger" onClick={() => this.handleDelete(item)} title="删除"><Icon type="delete" /></Button>
        ];
        return buttons;
    }
    viewAppointmentRender = (text, item) => {
        return <Button type="primary" onClick={async () => {
            await this.props.stores.batchStore.setModel(item)
            this.props.history.push('/appointment/index?batchUuid=' + item.uuid)
        }}><Icon type="user" />查看</Button>
    }

    viewHousesRender = (text, item) => {
        return <Button type="primary" onClick={async () => {
            await this.props.stores.batchStore.setModel(item)
            this.props.history.push('/houses/select?batchUuid=' + item.uuid)
        }}><Icon type="build" />选房</Button>
    }

    housesColumnRender = (text, item) => {
        const houses = (this.props.stores.housesStore.list || [])
        return houses.filter(e => item.housesUuid.includes(e.uuid.toString())).map(e => <Tag key={e.uuid}>{e.name}</Tag>)
    }

    render() {
        const { list, page, loading } = this.props.stores.batchStore
        return (
            <Row>
                <PageHeader title="批次管理" />
                <div className="toolbar">
                    <Button.Group>
                        <EditModal title="添加批次" trigger={<Button type="primary"><Icon type="plus" /> 添加批次</Button>} onSubmit={this.handleSubmit} />
                    </Button.Group>
                </div>
                <Table
                    loading={loading}
                    rowKey="uuid"
                    columns={[
                        { dataIndex: "name", title: "批次名称", width: 150, },
                        { dataIndex: "housesUuid", title: "楼盘", render: this.housesColumnRender },
                        { dataIndex: "appointmentTimeStart", title: "预约时间", render: (text, item) => `${moment(item.appointmentTimeStart).format('YYYY-MM-DD HH:mm')} - ${moment(item.appointmentTimeEnd).format('YYYY-MM-DD HH:mm')}` },
                        { dataIndex: "chooseTime", title: "选房日期", render: (text) => moment(text).format('YYYY-MM-DD') },
                        { title: "预约名单", render: this.viewAppointmentRender },
                        { title: "楼盘", render: this.viewHousesRender },
                        { title: "操作", render: this.operateColumnRender, },
                    ]}
                    dataSource={list || []}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row >
        )
    }
}
