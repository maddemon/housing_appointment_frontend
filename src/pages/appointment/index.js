import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Select, PageHeader, Icon, Table, Button, Input, Tag, Modal, message, Result, Tooltip } from 'antd'
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

        if (query.batchId) {
            await this.props.stores.appointmentStore.getList(query);
            await this.props.stores.chooseDateStore.getList(query.batchId)
        }
    }

    reloadPage = (name, value) => {
        const parameter = this.props.stores.appointmentStore.parameter || {}
        parameter[name] = value;
        this.props.history.push('/appointment/index?' + QueryString.stringify(parameter))
    }

    handlePageChange = page => this.reloadPage("pageIndex", page);

    handleUserChange = (value) => this.reloadPage("onlyShardUser", value);
    handleStatusChange = (value) => this.reloadPage("status", value)
    handleChooseDateChange = (value) => this.reloadPage("chooseDateId", value);
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

    handleSendChooseMessage = () => {
        Modal.confirm({
            title: "发送选房确认",
            content: "本次操作将向“已选中的用户”发送选房通知短信，你确认执行此操作吗？",
            okText: "确认发送",
            onOk: async () => {
                const batch = this.props.stores.batchStore.model
                const response = await this.props.stores.messageStore.sendChooseMessage(batch.id, this.state.selectedRowKeys)
                if (response && response.ok) {
                    message.success("发送短信完成");
                }
            }
        })
    }

    handleSendNotEnterMessage = () => {
        Modal.confirm({
            title: "发送备选短信确认",
            content: "本次操作将向“未进入入围名单的用户”发送备选短信通知，你已经确定入围名单了吗？",
            okText: "确认发送",
            onOk: async () => {
                const batch = this.props.stores.batchStore.model
                const response = await this.props.stores.messageStore.sendNotEnterMessage(batch.id)
                if (response && response.ok) {
                    message.success("发送短信完成");
                }
            }
        })
    }

    operateColumnRender = (text, item) => {
        const canGiveup = item.status < 3;
        const buttons = [];
        if (canGiveup) {
            //buttons.push(<Button key="btn-giveup" type="danger" onClick={() => this.handleGiveupClick(item.id)}>取消报名</Button>);
        }
        return <Button.Group>{buttons}</Button.Group>
    }

    shareUserColumnRender = (text, record) => {
        if (record.shareUsers.length === 0) {
            return null;
        }

        return record.shareUsers.map((item, key) => <span key={key}>{item.user}({item.phone}){item.statusText}<br /></span>)

    }

    render() {
        const batch = this.props.stores.batchStore.model || {};
        let loading = this.props.stores.batchStore.loading;
        if (!batch.id && !loading) return (
            <Result
                status="404"
                title="没有批次信息"
                subTitle="系统没有找到可用的批次，是否没有创建？"
                extra={<Button type="primary" onClick={() => {
                    this.props.history.push('/batch/index')
                }}>返回批次管理</Button>}
            />
        );
        const { list, page, parameter } = this.props.stores.appointmentStore
        loading = this.props.stores.appointmentStore.loading
        const chooseDateList = this.props.stores.chooseDateStore.list || []

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
                            <Col span={6}>
                                <Select onChange={this.handleUserChange} defaultValue="0" style={{ width: 160 }}>
                                    <Select.Option key="0">全部用户</Select.Option>
                                    <Select.Option key="1">只看包含共有人的预约</Select.Option>
                                </Select>
                            </Col>
                            <Col span={6}>
                                <Select onChange={this.handleStatusChange} defaultValue="0" style={{ width: 160 }}>
                                    <Select.Option key="0">全部状态</Select.Option>
                                    <Select.Option key="1">等待他人预约</Select.Option>
                                    <Select.Option key="2">已预约</Select.Option>
                                    <Select.Option key="3">已入围</Select.Option>
                                    <Select.Option key="4">已选房</Select.Option>
                                    <Select.Option key="5">放弃</Select.Option>
                                </Select>
                            </Col>
                            <Col span={6}>
                                <Select onChange={this.handleChooseDateChange} defaultValue="" style={{ width: 160 }}>
                                    <Select.Option key="0" value="">全部选房日期</Select.Option>
                                    {chooseDateList.map((item, key) => <Select.Option key={key} value={item.id.toString()}>{moment(item.day).format('ll')}{item.hour === 1 ? "上午" : "下午"}</Select.Option>)}
                                </Select>
                            </Col>
                            <Col span={6}>
                                <Input.Search onSearch={this.handleUserSearch} defaultValue={(parameter || {}).key} placeholder="姓名、手机、身份证" />
                            </Col>
                        </Row>
                    )} />
                <div className="toolbar">
                    <Button.Group>
                        <Button type="primary" onClick={this.handleConfirmClick}><Icon type="diff" />生成正选名单</Button>
                        <Button onClick={this.handleExportClick}><Icon type="export" />导出所有名单</Button>
                        <Button onClick={this.handleSendNotEnterMessage}><Icon type="bell" />备选通知</Button>
                    </Button.Group>
                    &nbsp;
                    <Button.Group>
                        <ChooseDateModal
                            model={{ batchId: batch.id, appointmentIds: this.state.selectedRowKeys }}
                            trigger={<Button type="primary" disabled={this.state.selectedRowKeys.length === 0}>
                                <Icon type="calendar" />批量指定选房日期
                            </Button>}
                            onSubmit={() => this.loadList()}
                        />
                        <Button onClick={this.handleSendChooseMessage} disabled={this.state.selectedRowKeys.length === 0}>
                            <Icon type="bell" />选房通知
                        </Button>
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
                        {
                            dataIndex: "shareUsers", title: "共有人",
                            render: this.shareUserColumnRender
                        },
                        {
                            dataIndex: "statusText", title: "预约状态",
                            render: (text, record) => <StatusTag status={record.status} text={text} />
                        },
                        { dataIndex: "createTime", title: "预约时间", render: (text) => moment(text).format('lll') },
                        { dataIndex: "chooseTime", title: "选房时间" },
                        { title: "操作", render: this.operateColumnRender, },
                    ]}
                    dataSource={list || []}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
