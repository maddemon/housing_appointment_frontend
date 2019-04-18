import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Button, Table } from 'antd'
import { QueryString } from '../../common/utils'
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

    operateColumnRender = (text, item) => {
        let buttons = [
            <EditModal key="btnEdit" model={item} trigger={<Button><Icon type="edit" />修改</Button>} />,
        ];
        return buttons;
    }

    render() {
        const list = this.props.stores.batchStore.list || []
        const page = this.props.stores.batchStore.page || {}
        return (
            <Row>
                <PageHeader title="批次管理" />
                <div className="toolbar">
                    <EditModal title="添加批次" trigger={<Button type="primary"><Icon type="plus" /> 添加批次</Button>} />
                </div>
                <Table
                    rowKey="uuid"
                    columns={[
                        { dataIndex: "name", title: "批次名称", width: 150 },
                        { dataIndex: "houseNumber", title: "房屋数量", width: 100 },
                        { dataIndex: "houseAddress", title: "房屋地址", width: 150 },
                        { dataIndex: "appointmentTimeStart", title: "预约时间", render: (text, item) => `${new Date(item.appointmentTimeStart).toLocaleString()} - ${new Date(item.appointmentTimeEnd).toLocaleString()}` },
                        { dataIndex: "chooseAddress", title: "选房地址" },
                        { dataIndex: "chooseTime", title: "选房日期", width: 140, render: (text) => new Date(text).toLocaleDateString() },
                        { title: "操作", render: this.operateColumnRender, width: 100 },
                    ]}
                    dataSource={list}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
