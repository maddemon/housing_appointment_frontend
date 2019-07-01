import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Button, Table, Modal, message } from 'antd'
import { QueryString } from '../../common/utils'
import EditModal from './edit'
import ImportButton from '../shared/import_button'

@inject('stores')
@observer
export default class UserIndexPage extends Component {

    state = { pageIndex: 1, pageSize: 20 }

    async componentWillMount() {
        await this.props.stores.globalStore.setTitle('用户管理');
        this.loadData()
    }

    async  componentWillReceiveProps(nextProps) {
        let query = QueryString.parseJSON(nextProps.location.search)
        if (query.pageIndex && query.pageIndex !== this.state.pageIndex) {
            this.loadData(query.pageIndex)
        }
    }

    loadData = async (pageIndex) => {
        pageIndex = pageIndex || this.state.pageIndex
        if (pageIndex !== this.state.pageIndex) {
            await this.setState({ pageIndex: pageIndex })
        }
        await this.props.stores.userStore.setList(pageIndex, this.state.pageSize)
    }

    handleDelete = (uuid) => {
        Modal.confirm({
            title: "确认",
            content: "你确定要删除该用户吗？",
            onOk: async () => {
                const result = await this.props.stores.userStore.delete(uuid)
                if (result && result.status === '200') {
                    message.success("删除完成");
                    this.loadData()
                }
            },
        })
    }

    handleResetPassword = async (uuid) => {
        await this.props.stores.userStore.resetPassword(uuid)
        message.success("密码重置完成")
    }

    handlePageChange = page => {
        this.props.history.push(`/user/index?page=${page}`)
    }

    operateColumnRender = (text, item) => {
        let buttons = [
            <Button key="btnReset" onClick={() => this.handleResetPassword(item.uuid)}>
                <Icon type="key" />重置密码</Button>,
            <EditModal key="btnEdit" model={item} trigger={<Button title="修改"><Icon type="edit" /></Button>} onSubmit={this.handleSubmit} />,
        ];
        return buttons;
    }

    handleSubmit = (result) => {
        if (result.status === '200') {
            message.success(result.message)
            this.props.stores.userStore.setList(this.state.pageIndex, this.state.pageSize)
        }
    }

    handleUpload = (result) => {
        if (result.status === '200') {
            this.props.stores.userStore.setList(this.state.pageIndex, this.state.pageSize)
        }
    }

    render() {
        const { loading, list, page, importUrl } = this.props.stores.userStore
        return (
            <Row>
                <PageHeader title="用户管理" />
                <div className="toolbar">
                    <Button.Group>
                        <EditModal title="添加用户" trigger={<Button type="primary"><Icon type="plus" /> 添加用户</Button>} onSubmit={this.handleSubmit} />
                        <ImportButton
                            text="导入用户"
                            action={importUrl}
                            onChange={this.handleUpload}
                        />
                        <a href="/templates/用户导入模板.xslx"><Icon type="download" />下载导入模板</a>
                    </Button.Group>
                </div>
                <Table
                    rowKey="uuid"
                    loading={loading}
                    columns={[
                        { dataIndex: "name", title: "姓名", width: 150 },
                        { dataIndex: "cardType", title: "证件类型", width: 120 },
                        { dataIndex: "cardNumber", title: "证件号码", width: 200 },
                        { dataIndex: "phone", title: "手机号", width: 200 },
                        { title: "操作", render: this.operateColumnRender, width: 200 },
                    ]}
                    dataSource={list}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
