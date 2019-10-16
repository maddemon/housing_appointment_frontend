import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Button, Table, Input } from 'antd'
import { QueryString } from '../../common/utils'

@inject('stores')
@observer
export default class PermitIndexPage extends Component {

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('准购证管理');
        this.loadList(this.props)
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.location.search !== nextProps.location.search) {
            await this.loadList(nextProps)
        }
    }

    loadList = async (props) => {
        let query = QueryString.parseJSON(props.location.search)
        await this.props.stores.permitStore.getList(query.key || '', query.page || 1);
    }

    operateColumnRender = (text, item) => {
        let buttons = [
            <Button key="btnDelete" onClick={() => this.handleDelete(item.id)} type="danger" title="删除">
                <Icon type="delete" />
            </Button>,
        ];
        return buttons;
    }

    handlePageChange = page => {
        this.props.history.push(`/permit/index?page=${page}`)
    }

    handleSearch = (value) => {
        this.props.history.push(`/permit/index?key=${value}`)
    }

    handleRedirectToStatistics = () => {
        this.props.history.push(`/permit/statistic`)
    }

    quotaRowRender = (record, index, indent, expanded) => {
        if (!expanded) {
            return null
        }
        return <Table
            bordered={false}
            rowKey="id"
            pagination={false}
            dataSource={record.quotas || []}
            columns={[
                { dataIndex: 'quotaCode', title: '购房证编号' },
                { dataIndex: 'user', title: "购房人" },
                {
                    dataIndex: 'statusText', title: "状态", render: (text, item) => {
                        //购房证状态  -1 尾批  0未预约 1（等待他人预约） 2 已预约 3 已入围 4 预约成功 5 已选房 8 备选
                        switch (text) {
                            case "-1":
                                return "尾批";
                            case "1":
                                return "等待他人预约";
                            case "2":
                                return "已预约";
                            case "3":
                                return "已入围";
                            case "4":
                                return "预约成功";
                            case "5":
                                return "已选房";
                            case "8":
                                return "备选";
                            case "0":
                            default:
                                return "未预约";
                        }
                    }
                }
            ]}
        />
    }

    render() {
        const { list, page, loading } = this.props.stores.permitStore
        console.log('permit/index')
        return (
            <Row>
                <PageHeader title="准购证管理" extra={
                    <Input.Search onSearch={this.handleSearch} />
                } />
                <div className="toolbar">
                    <Button onClick={this.handleRedirectToStatistics}><Icon type="bar-chart" />查看发证情况</Button>
                </div>
                <Table
                    bordered={true}
                    loading={loading}
                    rowKey="code"
                    columns={[
                        { dataIndex: "permitCode", title: "准购证号", },
                        { dataIndex: "agency", title: "动迁机构", },
                        { dataIndex: "town", title: "镇街" },
                        { dataIndex: "number", title: "限购套数" },
                        { dataIndex: "remark", title: "备注" },
                    ]}
                    dataSource={list}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                    expandedRowRender={this.quotaRowRender}
                ></Table>
            </Row>
        )
    }
}
