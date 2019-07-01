import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { Row, PageHeader, Icon, Button, Table, message, Modal } from 'antd'
import { QueryString } from '../../common/utils'
import moment from 'moment'
import EditModal from './edit'

@inject('stores')
@observer
export default class BatchIndexPage extends Component {

    state = { pageIndex: 1, pageSize: 20 }
    async componentWillMount() {
        this.props.stores.globalStore.setTitle('批次管理');
        await this.props.stores.batchStore.setList(this.state.pageIndex, this.state.pageSize)
    }

    async componentWillReceiveProps(nextProps) {
        let query = QueryString.parseJSON(nextProps.location.search)
        await this.setState({ pageIndex: query.pageIndex || 1 });
        await this.props.stores.batchStore.setList(this.state.pageIndex, this.state.pageSize)
    }

    handlePageChange = page => {
        this.props.history.push(`/user/index?page=${page}`)
    }

    handleSubmit = async result => {
        if (result.status === '200') {
            message.success(result.message);
            await this.props.stores.batchStore.setList(this.state.pageIndex, this.state.pageSize)
        }
    }

    handleDelete = async item => {
        Modal.confirm({
            title: "确认",
            content: "你确定要删除该用户吗？",
            onOk: async () => {
                const result = await this.props.stores.batchStore.delete(item.uuid);
                if (result.status === '200') {
                    message.success(result.message);
                    await this.props.stores.batchStore.setList(this.state.pageIndex, this.state.pageSize)
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
        let buttons = [
            <Button type="default" onClick={() => this.handleNotifyClick(item)} ><Icon type="bell" />通知</Button>,
            <EditModal key="btnEdit" model={item} trigger={<Button title="修改"><Icon type="edit" /></Button>} onSubmit={this.handleSubmit} />,
            <Button key="btnDelete" type="danger" onClick={() => this.handleDelete(item)} title="删除"><Icon type="delete" /></Button>,
        ];
        return buttons;
    }
    viewAppointmentRender = (text, item) => {
        return <Button type="primary" onClick={async () => {
            await this.props.stores.batchStore.setModel(item)
            this.props.history.push('/appointment/index?batchUuid=' + item.uuid)
        }}><Icon type="user" />查看</Button>
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
                        { dataIndex: "houseNumber", title: "房屋数量", width: 100 },
                        { dataIndex: "houseAddress", title: "房屋地址" },
                        { dataIndex: "appointmentTimeStart", title: "预约时间", render: (text, item) => `${moment(item.appointmentTimeStart).format('YYYY-MM-DD HH:mm')} - ${moment(item.appointmentTimeEnd).format('YYYY-MM-DD HH:mm')}` },
                        { dataIndex: "chooseAddress" },
                        { dataIndex: "chooseTime", title: "选房日期", render: (text) => moment(text).format('YYYY-MM-DD') },
                        { title: "预约管理", render: this.viewAppointmentRender },
                        { title: "操作", render: this.operateColumnRender, },
                    ]}
                    dataSource={list || []}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
