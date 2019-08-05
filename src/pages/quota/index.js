import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Button, Table, Modal, Tag, Radio } from 'antd'
import { QueryString } from '../../common/utils'

@inject('stores')
@observer
export default class QuotaIndexPage extends Component {

    state = { status: '', searchKey: '', pageIndex: 1, pageSize: 20, selectedRowKeys: [] }

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('准购证管理');
    }

    async componentWillReceiveProps(nextProps) {
        await this.loadList(nextProps)
    }

    loadList = async (props) => {
        let query = QueryString.parseJSON(props.location.search)
        await this.setState({ status: query.status || '', searchKey: query.searchKey || '', pageIndex: query.page || 1 });
        await this.props.stores.quotaStore.getList(this.state.status, this.state.searchKey, this.state.pageIndex, this.state.pageSize);
    }

    handleDelete = () => {
        Modal.confirm({
            title: "确认",
            content: "你确定要删除所选的所有指标吗？",
            onOk: async () => {
                const data = await this.props.stores.quotaStore.delete(this.state.selectedRowKeys.join())
                if (data.status === '200') {
                    await this.props.stores.quotaStore.getList(this.state.pageIndex, this.state.pageSize)
                }
            },
        })
    }

    handlePageChange = page => {
        this.props.history.push(`/quota/index?page=${page}`)
    }

    operateColumnRender = (text, item) => {
        let buttons = [
            <Button key="btnDelete" onClick={() => this.handleDelete(item.uuid)} type="danger" title="删除">
                <Icon type="delete" />
            </Button>,
        ];
        return buttons;
    }

    handleUpload = async (response) => {
        if (response.status === '200') {
            await this.props.stores.quotaStore.getList(this.state.pageIndex, this.state.pageSize)
        }
    }

    handleSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    }

    handleStatusChange = (e) => {
        this.props.history.push(`/quota/index?status=${e.target.value}`)
    }

    render() {
        const { list, page, loading, importUrl } = this.props.stores.quotaStore
        const { status, selectedRowKeys } = this.state
        return (
            <Row>
                <PageHeader title="指标管理" extra={
                    <Radio.Group onChange={this.handleStatusChange}>
                        <Radio.Button value="" checked={status === '' || status === undefined}>全部</Radio.Button>
                        <Radio.Button value="0" checked={status === '0'}>未预约</Radio.Button>
                        <Radio.Button value="1" checked={status === '1'}>已预约</Radio.Button>
                        <Radio.Button value="2" checked={status === '2'}>已选房</Radio.Button>
                    </Radio.Group>
                } />
                <Table
                    loading={loading}
                    rowSelection={{ selectedRowKeys, onChange: this.handleSelectChange }}
                    rowKey="uuid"
                    columns={[
                        { dataIndex: "priority", title: "优先级", },
                        { dataIndex: "userName", title: "用户", },
                        { dataIndex: "quotaStatus", title: "状态", render: (text) => text === "1" ? <Tag color="green">已使用</Tag> : <Tag color="gray">未使用</Tag> },
                        //{ title: "操作", render: this.operateColumnRender, width: 100 },
                    ]}
                    dataSource={list}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
