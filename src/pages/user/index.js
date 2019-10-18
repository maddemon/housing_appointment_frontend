import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Button, Input, Table, Modal, message } from 'antd'
import { QueryString } from '../../common/utils'
import EditModal from './edit'

@inject('stores')
@observer
export default class UserIndexPage extends Component {
    componentWillMount() {
        this.props.stores.globalStore.setTitle('用户管理');
        this.loadList(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.loadList(nextProps)
        }
    }

    loadList = (props) => {
        const query = QueryString.parseJSON(props.location.search)
        this.props.stores.userStore.getList(query)
    }

    handleDelete = (id) => {
        Modal.confirm({
            title: "确认",
            content: "你确定要删除该用户吗？",
            onOk: async () => {
                const result = await this.props.stores.userStore.delete(id)
                if (result && result.status === '200') {
                    message.success("删除完成");
                    this.loadData()
                }
            },
        })
    }

    handleResetPassword = (id) => {
        this.props.stores.userStore.resetPassword(id)
        message.success("密码重置完成")
    }

    handlePageChange = page => {
        const parameter = this.props.stores.userStore.parameter || {}
        parameter.pageIndex = page
        this.props.history.push(`/user/index?${QueryString.stringify(parameter)}`)
    }

    handleSearch = (value) => {
        this.props.history.push(`/user/index?key=${value}`)
    }

    operateColumnRender = (text, item) => {
        let buttons = [
            <Button key="btnReset" onClick={() => this.handleResetPassword(item.id)}>
                <Icon type="key" />重置密码</Button>,
            <EditModal key="btnEdit" model={item} trigger={<Button title="修改"><Icon type="edit" /></Button>} onSubmit={this.handleSubmit} />,
        ];
        return buttons;
    }

    handleSubmit = (result) => {
        if (result.ok) {
            message.success("操作成功")
            this.loadList(this.props)
        }
    }

    handleUpload = (result) => {
        if (result.ok) {
            this.loadList(this.props)
        }
    }

    render() {
        const { loading, list, page, parameter } = this.props.stores.userStore;
        return (
            <Row>
                <PageHeader title="用户管理" extra={<Input.Search onSearch={this.handleSearch} defaultValue={parameter.key}  />} />
                <div className="toolbar">
                    <Button.Group>
                        <EditModal title="添加用户" trigger={<Button type="primary"><Icon type="plus" /> 添加用户</Button>} onSubmit={this.handleSubmit} />
                    </Button.Group>
                </div>
                <Table
                    bordered={true}
                    rowKey="id"
                    loading={loading}
                    columns={[
                        { dataIndex: "name", title: "姓名", width: 150 },
                        { dataIndex: "idCard", title: "证件号码", width: 120 },
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
