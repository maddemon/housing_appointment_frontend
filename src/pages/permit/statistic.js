import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Table } from 'antd'
const { Column, ColumnGroup } = Table;

@inject('stores')
@observer
export default class PermitStatisticPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('准购证管理发放情况');
        this.props.stores.permitStore.getStatistic();
    }

    render() {
        let { statistic, loading } = this.props.stores.permitStore
        statistic = statistic || []
        return (
            <Row>
                <PageHeader title="准购证管理发放情况统计表" />
                <Table dataSource={statistic} bordered={true} pagination={false} loading={loading}>
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
                        <Column title="户数" dataIndex="rateFamily" key="rateFamily" render={(text) => parseFloat(text).toFixed(2) + '%'} />
                        <Column title="房数" dataIndex="rateRoom" key="rateRoom" render={(text) => parseFloat(text).toFixed(2) + '%'} />
                    </ColumnGroup>
                </Table>
            </Row>
        )
    }
}
