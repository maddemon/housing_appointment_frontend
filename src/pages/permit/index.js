import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Button, Table, Input, Tag } from 'antd'
import { QueryString } from '../../common/utils'

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
        let query = QueryString.parseJSON(props.location.search)
        this.props.stores.permitStore.getList(query);
    }

    operateColumnRender = (text, item) => {
        return <Button.Group>
            <Button key="btnEdit">
                <Icon type="edit" />
            </Button>
            <Button key="btnDelete" onClick={() => this.handleDelete(item.id)} type="danger" title="删除">
                <Icon type="delete" />
            </Button>
        </Button.Group>
    }

    handlePageChange = page => {
        this.props.history.push(`/permit/index?pageIndex=${page}`)
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
                { dataIndex: 'quotaCode', title: '购房证编号', width: 160 },
                { dataIndex: 'user', title: "购房人", width: 200 },
                { dataIndex: 'statusText', title: "状态" }
            ]}
        />
    }

    quotaColumnRender = (text, record) => {
        return record.quotas.map((item, key) => {
            let color = "#2db7f5";
            switch (item.status) {
                default:
                    color = "#999";
                    break;
                case 1://等待他人
                    color = "#2db7f5";
                    break;
                case 2://已预约
                    color = "#108ee9";
                    break;
                case 3:
                case 4://已入围
                case 5://已选房
                    color = "#87d068";
                    break;
                case -1://放弃、尾批
                    color = "#f50";
                    break;
            }
            return <Tag color={color} key={key}>{item.quotaCode} {item.user} ({item.statusText})</Tag>
        });
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
                    rowKey="id"
                    columns={[
                        { dataIndex: "permitCode", title: "准购证号", },
                        { dataIndex: "agency", title: "动迁机构", },
                        { dataIndex: "town", title: "镇街" },
                        { dataIndex: "quotaNumber", title: "限购套数" },
                        { dataIndex: 'quotas', title: '实发套数', render: this.quotaColumnRender },
                        { dataIndex: "remark", title: "备注" },
                        { title: '操作', render: this.operateColumnRender }
                    ]}
                    dataSource={list}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
