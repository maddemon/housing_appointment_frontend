import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Table, Button } from 'antd'
import { QueryString } from '../../common/utils'
import moment from 'moment'

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
        await this.props.stores.appointmentStore.getList(query);
        await this.props.stores.batchStore.getModel(query.batchId)
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
        const { list, page, loading } = this.props.stores.appointmentStore
        return (
            <Row>
                <PageHeader title="预约管理"
                    subTitle={`预约总数:${(page || {}).recordCount || 0} ${batch ? `所属批次：${batch.name}` : ''} `}
                    backIcon={<Icon type="arrow-left" />}
                    extra={<Button.Group>
                        <Button type="primary" onClick={this.handleExportClick}><Icon type="export" />导出预约记录</Button>
                        {/* <ImportButton
                            tooltip="请先导出预约记录，再填写对应结果"
                            text="导入选房结果"
                            onChange={this.handleImport}
                        /> */}
                    </Button.Group>} />
                <div className="toolbar">

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
                        { dataIndex: "batchName", title: "批次名称" },
                        { dataIndex: "createTime", title: "预约时间", render: (text) => moment(text).format('LLL') },
                        { dataIndex: "code", title: "购房证号" },
                        { dataIndex: "user", title: "预约用户" },
                        { dataIndex: "statusText", title: "预约状态" },
                        { title: "操作", render: this.operateColumnRender, },
                    ]}
                    dataSource={list || []}
                    pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
