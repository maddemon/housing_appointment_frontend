import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Button, Table, Modal, Tag } from 'antd'
import { QueryString } from '../../common/utils'
import ImportButton from '../shared/import_button'

@inject('stores')
@observer
export default class QuotaIndexPage extends Component {

    state = { pageIndex: 1, pageSize: 20 }

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('指标管理');
        await this.props.stores.quotaStore.setList(this.state.pageIndex, this.state.pageSize)
    }

    async componentWillReceiveProps(nextProps) {
        let query = QueryString.parseJSON(nextProps.location.search)
        if (query.pageIndex && query.pageIndex !== this.state.pageIndex) {
            this.setState({ pageIndex: query.pageIndex })
            await this.props.stores.quotaStore.setList(query.pageIndex, this.state.pageSize)
        }
    }

    handleDelete = (uuid) => {
        Modal.confirm({
            title: "确认",
            content: "你确定要删除该指标吗？",
            onOk: async () => {
                const data = await this.props.stores.quotaStore.delete(uuid)
                if (data.status === '200') {
                    await this.props.stores.quotaStore.setList(this.state.pageIndex, this.state.pageSize)
                }
            },
        })
    }

    handlePageChange = page => {
        this.props.history.push(`/quota/index?page=${page}`)
    }

    operateColumnRender = (text, item) => {
        let buttons = [
            <Button key="btnDelete" onClick={() => this.handleDelete(item.uuid)} type="danger"><Icon type="delete" />删除</Button>,
        ];
        return buttons;
    }

    handleUpload = (response) => {
        if (response.status === '200') {
            this.props.stores.quotaStore.setList(this.state.pageIndex, this.state.pageSize)
        }
    }

    render() {
        const list = this.props.stores.quotaStore.list || []
        const page = this.props.stores.quotaStore.page || {}
        return (
            <Row>
                <PageHeader title="指标管理" />
                <div className="toolbar">
                    <ImportButton
                        text="导入指标"
                        action={this.props.stores.quotaStore.importUrl}
                        onChange={this.handleUpload}
                    />
                </div>
                <Table
                    rowKey="uuid"
                    columns={[
                        { dataIndex: "priority", title: "优先级", },
                        { dataIndex: "userName", title: "用户", },
                        { dataIndex: "quotaStatus", title: "状态", render: (text) => text === "1" ? <Tag color="green">已使用</Tag> : <Tag color="gray">未使用</Tag> },
                        { title: "操作", render: this.operateColumnRender, width: 100 },
                    ]}
                    dataSource={list}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
