import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, PageHeader, Icon, Button, Table, Input, Tag, Select } from 'antd'
import { QueryString } from '../../common/utils'
import EditQuotaModal from './edit_quota'
import StatusTag from '../shared/_statusTag'

@inject('stores')
@observer
export default class PermitIndexPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('准购证管理');
        this.loadList(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.search !== nextProps.location.search) {
            this.loadList(nextProps)
        }
    }

    loadList = (props) => {
        props = props || this.props
        let query = QueryString.parseJSON(props.location.search)
        this.props.stores.permitStore.getList(query);
    }

    handlePageChange = page => {
        const parameter = this.props.stores.permitStore.parameter || {}
        parameter["pageIndex"] = page;
        this.props.history.push('/permit/index?' + QueryString.stringify(parameter))
    }

    handleSearch = (key) => {
        this.props.history.push(`/permit/index?key=${key}`)
    }

    handleRedirectToStatistics = () => {
        this.props.history.push(`/permit/statistic`)
    }
    handleFilterChange = (val) => {
        this.props.history.push(`/permit/index?issue=${val}`)
    }

    handleSaveQuota = () => {
        this.loadList()
    }

    handleDeleteQuota = () => {
        this.loadList();
    }

    quotaColumnRender = (text, record) => {
        return record.quotas.map((item, key) => <EditQuotaModal
            key={key}
            model={item}
            trigger={<StatusTag status={item.status}>{item.quotaCode} {item.user} {item.statusText}</StatusTag>}
            onSubmit={this.handleSaveQuota}
            onDelete={this.handleDeleteQuota}
        />);
    }

    operateColumnRender = (text, item) => {
        if (item.issueNumber < item.quotaNumber) {
            return <EditQuotaModal model={{ permitCode: item.permitCode, }}
                trigger={<Button type="primary">发证</Button>}
                onSubmit={this.handleSaveQuota}
                onDelete={this.handleDeleteQuota}
            />
        }
        return null;
    }

    render() {
        let { list, page, loading, parameter } = this.props.stores.permitStore
        list = list || []
        page = page || {}
        parameter = parameter || {}
        console.log(typeof (parameter.issue))
        return (
            <Row>
                <PageHeader title="准购证管理" extra={<Row>
                    <Col span={12}>
                        <Select onChange={this.handleFilterChange} style={{ width: 200 }} defaultValue={parameter.issue}>
                            <Select.Option key="all" value="">查看所有</Select.Option>
                            <Select.Option key="false" value="false">仅看未发证</Select.Option>
                        </Select>
                    </Col>
                    <Col span={12}>
                        <Input.Search defaultValue={parameter.key} onSearch={this.handleSearch} style={{ width: 200 }} />
                    </Col>
                </Row>
                } />
                <div className="toolbar">
                    <Button onClick={this.handleRedirectToStatistics}><Icon type="bar-chart" />查看发证情况</Button>
                </div>
                <Table
                    bordered={true}
                    loading={loading}
                    rowKey="id"
                    columns={[
                        { dataIndex: "permitCode", title: "准购证号", width: 100 },
                        { dataIndex: "agency", title: "动迁机构", width: 120 },
                        { dataIndex: "town", title: "镇街", width: 150 },
                        { dataIndex: "quotaNumber", title: "限购套数", width: 100 },
                        { dataIndex: 'quotas', title: '实发套数', render: this.quotaColumnRender },
                        { dataIndex: "remark", title: "备注" },
                        { title: '操作', render: this.operateColumnRender, width: 120 }
                    ]}
                    dataSource={list}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
