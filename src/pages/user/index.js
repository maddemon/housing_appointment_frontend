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

    componentWillMount() {
        this.props.stores.globalStore.setTitle('用户管理');
        this.props.stores.userStore.setList(this.state.pageIndex, this.state.pageSize)
    }

    componentWillReceiveProps(nextProps) {
        let query = QueryString.parseJSON(nextProps.location.search)
        if (query.pageIndex && query.pageIndex !== this.state.pageIndex) {
            this.setState({ pageIndex: query.pageIndex })
            this.props.stores.userStore.setList(query.pageIndex, this.state.pageSize)
        }
    }

    handleDelete = (uuid) => {
        Modal.confirm({
            title: "确认",
            content: "你确定要删除该用户吗？",
            onOk: () => {
                this.props.stores.userStore.delete(uuid)
            },
        })
        this.props.stores.userStore.delete(uuid);
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
            <Button key="btnreset" onClick={() => this.handleResetPassword(item.uuid)}>重置密码</Button>,
            <EditModal key="btnedit" model={item} trigger={<Button><Icon type="edit" />修改</Button>} />,
        ];
        return buttons;
    }

    handleUpload = (response) => {
        if (response.status === '200') {
            this.props.stores.userStore.setList(this.state.pageIndex, this.state.pageSize)
        }
    }

    render() {
        const list = this.props.stores.userStore.list || []
        const page = this.props.stores.userStore.page || {}
        return (
            <Row>
                <PageHeader title="用户管理" />
                <div className="toolbar">
                    <EditModal trigger={<Button type="primary"><Icon type="plus" /> 添加用户</Button>} />
                    <ImportButton
                        text="导入用户"
                        action={this.props.stores.userStore.importUrl}
                        onChange={this.handleUpload}
                    />
                </div>
                <Table
                    rowKey="uuid"
                    columns={[
                        { dataIndex: "name", title: "姓名", width: 150 },
                        { dataIndex: "cardType", title: "证件类型", width: 120 },
                        { dataIndex: "cardnumber", title: "证件号码", width: 200 },
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
