import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Button, Table, Input } from 'antd'
import { QueryString } from '../../common/utils'
const { Column, ColumnGroup } = Table;

@inject('stores')
@observer
export default class PermitStatisticPage extends Component {

    state = { searchKey: '', pageIndex: 1, pageSize: 20 }

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('准购证管理发放情况');
    }

    async componentWillReceiveProps(nextProps) {
        await this.loadList(nextProps)
    }

    loadList = async (props) => {
        let query = QueryString.parseJSON(props.location.search)
        await this.setState({ searchKey: query.searchKey || '', pageIndex: query.page || 1 });
        await this.props.stores.permitStore.getStatistic(this.state.searchKey, this.state.pageIndex, this.state.pageSize);
    }
    handleSearch = (value) => {
        this.props.history.push(`/permit/index?key=${value}`)
    }

    render() {
        const { statistics, page, loading } = this.props.stores.permitStore
        return (
            <Row>
                <PageHeader title="准购证管理发放情况统计表" 
                extra={
                    <Input.Search onSearch={this.handleSearch} />
                } />
                <Table dataSource={statistics} bordered={true}>
                    <Column title="镇街" dataIndex="unit" />
                    <Column title="动迁机构" dataIndex="agency" />
                    <ColumnGroup title="应发数">
                        <Column title="户数" dataIndex="shouldHouseNum" />
                        <Column title="房数" dataIndex="shouldQuotaNum" />
                    </ColumnGroup>
                    <ColumnGroup title="实发数">
                        <Column title="户数" dataIndex="realHouseNum" />
                        <Column title="房数" dataIndex="realQuotaNum" />
                    </ColumnGroup>
                    <ColumnGroup title="实发率">
                        <Column title="户数" render={(text, item) => (item.realHouseNum / item.shouldHouseNum * 100).toFixed() + '%'} />
                        <Column title="房数" dataIndex="quotaNumRate" render={(text, item) => (item.realQuotaNum / item.shouldQuotaNum * 100).toFixed() + '%'} />
                    </ColumnGroup>
                </Table>
            </Row>
        )
    }
}
