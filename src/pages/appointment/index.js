import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Table } from 'antd'
import { QueryString } from '../../common/utils'
import moment from 'moment'

@inject('stores')
@observer
export default class AppointmentIndexPage extends Component {
    state = { batchUuid: '', pageIndex: 1, pageSize: 20 }
    componentWillMount() {
        this.props.stores.globalStore.setTitle('预约管理');
        this.loadList(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.loadList(nextProps);
    }

    loadList = (props) => {
        let query = QueryString.parseJSON(props.location.search)
        this.setState({ batchUuid: query.batchUuid || '', pageIndex: query.pageIndex || 1 }, () => {
            this.props.stores.appointmentStore.setList(this.state.batchUuid, this.state.pageIndex, this.state.pageSize);
        });
    }

    handlePageChange = page => {
        this.props.history.push(`/user/index?page=${page}`)
    }

    operateColumnRender = (text, item) => {

    }

    render() {
        const batch = this.props.stores.batchStore.model
        const { list, page, loading } = this.props.stores.appointmentStore
        return (
            <Row>
                <PageHeader title="预约管理"
                    subTitle={`预约总数:${(page || {}).recordCount || 0}`}
                    backIcon={<Icon type="arrow-left" />}
                    extra={batch.name ? `所属批次：${batch.name}` : null} />
                <div className="toolbar">

                </div>
                <Table
                    loading={loading}
                    rowKey="uuid"
                    columns={[
                        { dataIndex: "batchUuid", title: "批次名称" },
                        { dataIndex: "reserveTime", title: "预约时间", render: (text) => moment(text).format('LLL') },
                        { dataIndex: "quotaUuid", title: "所用指标" },
                        { dataIndex: "userUuid", title: "预约用户" },
                        { title: "操作", render: this.operateColumnRender, },
                    ]}
                    dataSource={list || []}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
