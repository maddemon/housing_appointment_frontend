import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Button, Table, message } from 'antd'
import { QueryString } from '../../common/utils'
import moment from 'moment'
import EditModal from './edit'

@inject('stores')
@observer
export default class BatchIndexPage extends Component {

    state = { pageIndex: 1, pageSize: 20 }
    componentWillMount() {
        this.props.stores.globalStore.setTitle('批次管理');
        this.props.stores.batchStore.setList(this.state.pageIndex, this.state.pageSize)
    }

    componentWillReceiveProps(nextProps) {
        let query = QueryString.parseJSON(nextProps.location.search)
        if (query.pageIndex && query.pageIndex !== this.state.pageIndex) {
            this.setState({ pageIndex: query.pageIndex })
            this.props.stores.batchStore.setList(query.pageIndex, this.state.pageSize)
        }
    }

    handlePageChange = page => {
        this.props.history.push(`/user/index?page=${page}`)
    }

    handleSubmit = result => {
        if (result.status === '200') {
            message.success(result.message);
            this.props.stores.batchStore.setList(this.state.pageIndex, this.state.pageSize)
        }
    }


    operateColumnRender = (text, item) => {
        let buttons = [
            <EditModal key="btnEdit" model={item} trigger={<Button><Icon type="edit" />修改</Button>} onSubmit={this.handleSubmit} />,
        ];
        return buttons;
    }

    render() {
        const { list, page, loading } = this.props.stores.batchStore
        return (
            <Row>
                <PageHeader title="批次管理" />
                <div className="toolbar">
                    <EditModal title="添加批次" trigger={<Button type="primary"><Icon type="plus" /> 添加批次</Button>} onSubmit={this.handleSubmit} />
                </div>
                <Table
                    loading={loading}
                    rowKey="uuid"
                    columns={[
                        { dataIndex: "name", title: "批次名称", width: 150 },
                        { dataIndex: "houseNumber", title: "房屋数量", width: 100 },
                        { dataIndex: "houseAddress", title: "房屋地址", width: 150 },
                        { dataIndex: "appointmentTimeStart", title: "预约时间", render: (text, item) => `${moment(item.appointmentTimeStart).format('YYYY-MM-DD HH:mm')} - ${moment(item.appointmentTimeEnd).format('YYYY-MM-DD HH:mm')}` },
                        { dataIndex: "chooseAddress", title: "选房地址" },
                        { dataIndex: "chooseTime", title: "选房日期", width: 140, render: (text) => moment(text).format('YYYY-MM-DD') },
                        { title: "操作", render: this.operateColumnRender, width: 100 },
                    ]}
                    dataSource={list || []}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
