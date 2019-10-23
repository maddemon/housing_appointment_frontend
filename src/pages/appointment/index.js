import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Select, PageHeader, Icon, Table, Button, Input, Tag, Modal, message } from 'antd'
import { QueryString } from '../../common/utils'
import moment from 'moment'
import StatusTag from '../shared/_statusTag'
import ChooseDateModal from './chooseDate'

@inject('stores')
@observer
export default class AppointmentIndexPage extends Component {

    state = { selectedRowKeys: [] }

    componentWillMount() {
        this.props.stores.globalStore.setTitle('预约管理');
        this.loadList(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.loadList(nextProps)
        }
    }

    loadList = async (props) => {
        props = props || this.props
        const query = QueryString.parseJSON(props.location.search)
        await this.props.stores.batchStore.getModel(query.batchId)
        if (!query.batchId) {
            query.batchId = this.props.stores.batchStore.model.id;
        }
        await this.props.stores.appointmentStore.getList(query);
        await this.props.stores.chooseDateStore.getList(query.batchId)
    }

    reloadPage = (name, value) => {
        const parameter = this.props.stores.appointmentStore.parameter || {}
        parameter[name] = value;
        this.props.history.push('/appointment/index?' + QueryString.stringify(parameter))
    }

    handlePageChange = page => this.reloadPage("pageIndex", page);

    handleUserChange = (value) => this.reloadPage("onlyShardUser", value);
    handleStatusChange = (value) => this.reloadPage("status", value)

    handleUserSearch = (key) => this.reloadPage("key", key)

    handleExportClick = () => {
        const batch = this.props.stores.batchStore.model
        window.open('/api/appointment/export?batchId=' + batch.id)
    }

    handleConfirmClick = async () => {
        const batch = this.props.stores.batchStore.model
        const response = await this.props.stores.appointmentStore.confirm(batch.id);
        if (response.ok) {
            message.success("正选名单确认完成");
            this.loadList(this.props);
        }
    }

    handleRowSelect = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({ selectedRowKeys })
        },
    }

    handleGiveupClick = (id) => {
        Modal.confirm({
            title: "确定执行放弃选房操作？",
            content: "如果放弃选房，则只能等到尾批才有选房资格，确定要放弃吗？",
            okText: "确认放弃",
            onOk: async () => {
                const result = await this.props.stores.appointmentStore.giveup(id)
                if (result && result.ok) {
                    message.success("操作完成");
                    await this.loadList()
                }
            }
        })
    }

    operateColumnRender = (text, item) => {
        const canGiveup = item.status < 3;
        const buttons = [];
        if (canGiveup) {
            buttons.push(<Button type="danger" onClick={() => this.handleGiveupClick(item.id)}>放弃</Button>);
        }
        return <Button.Group>{buttons}</Button.Group>
    }

    render() {
        const batch = this.props.stores.batchStore.model
        if (!batch) return null;
        const { list, page, loading, parameter } = this.props.stores.appointmentStore
        return (
            <Row>
                <PageHeader title="预约管理"
                    subTitle={<span>
                        <Tag color="#f50">预约总数：{(page || {}).total || 0}人</Tag>
                        {batch ? <Tag color="#108ee9">所属批次：{batch.name}</Tag> : null}
                    </span>}
                    backIcon={<Icon type="arrow-left" />}
                    extra={(
                        <Row>
                            <Col span={8}>
                                <Select onChange={this.handleUserChange} defaultValue="0" style={{ width: 200 }}>
                                    <Select.Option key="0">全部用户</Select.Option>
                                    <Select.Option key="1">只看包含共有人的预约</Select.Option>
                                </Select>
                            </Col>
                            <Col span={8}>
                                <Select onChange={this.handleStatusChange} defaultValue="0" style={{ width: 200 }}>
                                    <Select.Option key="0">全部状态</Select.Option>
                                    <Select.Option key="1">等待他人预约</Select.Option>
                                    <Select.Option key="2">已预约</Select.Option>
                                    <Select.Option key="3">已入围</Select.Option>
                                    <Select.Option key="4">已选房</Select.Option>
                                    <Select.Option key="5">放弃</Select.Option>
                                </Select>
                            </Col>
                            <Col span={8}>
                                <Input.Search onSearch={this.handleUserSearch} defaultValue={parameter.key} placeholder="姓名、手机、身份证" />
                            </Col>
                        </Row>
                    )} />
                <div className="toolbar">
                    <Button.Group>
                        <ChooseDateModal
                            model={{ batchId: batch.id, appointmentIds: this.state.selectedRowKeys }}
                            trigger={<Button type="primary" disabled={this.state.selectedRowKeys.length === 0}>
                                <Icon type="calendar" />批量指定选房日期
                            </Button>}
                        />
                    </Button.Group>
                    &nbsp;&nbsp;
                    <Button.Group>
                        <Button type="danger" onClick={this.handleConfirmClick}><Icon type="diff" />生成正选名单</Button>
                        <Button type="primary" onClick={this.handleExportClick}><Icon type="export" />导出所有名单</Button>
                    </Button.Group>
                </div>
                <Table
                    loading={loading}
                    rowSelection={this.handleRowSelect}
                    rowKey="id"
                    columns={[
                        { dataIndex: "code", title: "准购证号" },
                        { dataIndex: "user", title: "预约用户" },
                        { dataIndex: "phone", title: "手机号" },
                        { dataIndex: "idCard", title: "身份证" },
                        { dataIndex: "remark", title: "共有人" },
                        { dataIndex: "statusText", title: "预约状态", render: (text, item) => <StatusTag status={item.status} text={text} /> },
                        { dataIndex: "createTime", title: "预约时间", render: (text) => moment(text).format('LLL') },
                        { title: "操作", render: this.operateColumnRender, },
                    ]}
                    dataSource={list || []}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
