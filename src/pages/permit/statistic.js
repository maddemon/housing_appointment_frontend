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
        const { statistic, loading } = this.props.stores.permitStore

        return (
            <Row>
                <PageHeader title="准购证管理发放情况统计表"
                    extra={
                        <Input.Search onSearch={this.handleSearch} />
                    } />
                <Table dataSource={statistic} bordered={true} pagination={false} loading={loading}>
                    <Column title="镇街" dataIndex="town" key="town" />
                    <Column title="动迁机构" dataIndex="agency" key="agency" />
                    <ColumnGroup title="应发数">
                        <Column title="户数" dataIndex="family" key="family" />
                        <Column title="房数" dataIndex="room" key="room" />
                    </ColumnGroup>
                    <ColumnGroup title="实发数">
                        <Column title="户数" dataIndex="realFamily" key="realFamily" />
                        <Column title="房数" dataIndex="realRoom" key="realRoom" />
                    </ColumnGroup>
                    <ColumnGroup title="实发率">
                        <Column title="户数" dataIndex="rateFamily" key="rateFamily" render={(text) => text + '%'} />
                        <Column title="房数" dataIndex="rateRoom" key="rateRoom" render={(text) => text + '%'} />
                    </ColumnGroup>
                </Table>
            </Row>
        )
    }
}
