import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Button, Table, message, Modal } from 'antd'
import { QueryString } from '../../common/utils'
import EditModal from './edit'
import ImportButton from '../shared/import_button'

@inject('stores')
@observer
export default class BuildingIndexPage extends Component {

    state = { pageIndex: 1, pageSize: 20 }
    async componentWillMount() {
        this.props.stores.globalStore.setTitle('楼盘管理');
    }

    loadList = async (props) => {
        let query = QueryString.parseJSON(props.location.search)
        await this.setState({ pageIndex: query.pageIndex || 1 });
        await this.props.stores.buildingStore.setList('', this.state.pageIndex, this.state.pageSize)
    }

    async componentWillReceiveProps(nextProps) {
        await this.loadList(nextProps)
    }

    handlePageChange = page => {
        this.props.history.push(`/building/index?page=${page}`)
    }

    handleSubmit = async result => {
        if (result.status === '200') {
            message.success(result.message);
            await this.props.stores.buildingStore.setList('', this.state.pageIndex, this.state.pageSize)
        }
    }

    handleDelete = async item => {
        Modal.confirm({
            title: "确认",
            content: "你确定要删除该楼盘吗？",
            onOk: async () => {
                const result = await this.props.stores.buildingStore.delete(item.uuid);
                if (result.status === '200') {
                    message.success(result.message);
                    await this.props.stores.buildingStore.setList(this.state.pageIndex, this.state.pageSize)
                }
            },
        })
    }

    operateColumnRender = (text, item) => {
        let buttons = [
            <EditModal key="btnEdit" model={item} trigger={<Button title="修改"><Icon type="edit" /></Button>} onSubmit={this.handleSubmit} />,
            <Button key="btnDelete" type="danger" onClick={() => this.handleDelete(item)} title="删除"><Icon type="delete" /></Button>,
        ];
        return buttons;
    }

    render() {
        const { list, page, loading, importUrl } = this.props.stores.buildingStore
        return (
            <Row>
                <PageHeader title="楼盘管理" />
                <div className="toolbar">
                    <Button.Group>
                        <EditModal
                            title="添加楼盘"
                            trigger={<Button type="primary"><Icon type="plus" /> 添加楼盘</Button>}
                            onSubmit={this.handleSubmit}
                        />
                        <ImportButton
                            text="导入楼盘"
                            action={importUrl}
                            onChange={this.handleUpload}
                        />
                        <a href="/templates/楼盘导入模板.xslx"><Icon type="download" />下载导入模板</a>
                    </Button.Group>
                </div>
                <Table
                    loading={loading}
                    rowKey="uuid"
                    columns={[
                        { dataIndex: "name", title: "名称",  },
                        { dataIndex: "houseNumber", title: "房屋数量", width: 100 },
                        { dataIndex: "lastNumber", title: "剩余数量", width: 100 },
                        { title: "操作", render: this.operateColumnRender,width:150 },
                    ]}
                    dataSource={list || []}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
