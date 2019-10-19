import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, PageHeader, Icon, Table, Button, Input, Tag, Radio } from 'antd'
import { QueryString } from '../../common/utils'
import moment from 'moment'
import StatusTag from '../shared/_statusTag'

@inject('stores')
@observer
export default class AppointmentIndexPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('预约管理');
    }

    componentWillReceiveProps(nextProps) {
        this.loadList(nextProps);
    }

    loadList = async (props) => {
        props = props || this.props
        const query = QueryString.parseJSON(props.location.search)
        await this.props.stores.batchStore.getModel(query.batchId)
        if(!query.batchId){
            query.batchId = this.props.stores.batchStore.model.id;
        }
        await this.props.stores.appointmentStore.getList(query);
    }

    handlePageChange = page => {
        this.props.history.push(`/user/index?pageIndex=${page}`)
    }

    operateColumnRender = (text, item) => {

    }

    handleExportClick = () => {
        window.open('/api/appointment/export?batchId=' + this.state.batchId)
    }

    // handleImport = async (response) => {
    //     if (response.status === '200') {
    //         await this.loadList(this.props)
    //     }
    // }

    render() {
        const batch = this.props.stores.batchStore.model
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
                        <Button.Group>
                            {list.find(e => e.status === 4) ? null : <Button type="danger">生成正选名单</Button>}
                            <Button type="primary" onClick={this.handleExportClick}><Icon type="export" />导出所有名单</Button>
                        </Button.Group>
                    )} />
                <div className="toolbar">
                    <Row>
                        <Col span={4}>
                            <Radio.Group>
                                <Radio.Button checked={true} value="">全部</Radio.Button>
                                <Radio.Button checked={false} value="1">只看包含共有人的预约</Radio.Button>
                            </Radio.Group>
                        </Col>

                        <Col span={4}>
                            <Input.Search onSearch={this.handleSearch} defaultValue={parameter.key} placeholder="姓名、手机、身份证" />
                        </Col>
                    </Row>
                </div>
                <Table
                    loading={loading}
                    rowSelection={{
                        onChange: (selectedRowKeys, selectedRows) => {
                            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                        },
                    }}
                    rowKey="id"
                    columns={[
                        { dataIndex: "code", title: "准购证号" },
                        { dataIndex: "statusText", title: "预约状态", render: (text, item) => <StatusTag status={item.status} text={text} /> },
                        { dataIndex: "code", title: "购房证号" },
                        { dataIndex: "user", title: "预约用户" },
                        { dataIndex: "phone", title: "手机号" },
                        { dataIndex: "idCard", title: "身份证" },
                        { dataIndex: "remark", title: "共有人" },
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
