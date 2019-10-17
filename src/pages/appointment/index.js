import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Table, Button, Tooltip } from 'antd'
import { QueryString } from '../../common/utils'
import moment from 'moment'

@inject('stores')
@observer
export default class AppointmentIndexPage extends Component {
    state = { batchId: '', pageIndex: 1, pageSize: 20 }
    async componentWillMount() {
        this.props.stores.globalStore.setTitle('预约管理');
    }

    async componentWillReceiveProps(nextProps) {
        await this.loadList(nextProps);
    }

    loadList = async (props) => {
        props = props || this.props
        let query = QueryString.parseJSON(props.location.search)
        await this.setState({ batchId: query.batchId || '', pageIndex: query.page || 1 });
        await this.props.stores.appointmentStore.getList(this.state.batchId, this.state.pageIndex, this.state.pageSize);
    }

    handlePageChange = page => {
        this.props.history.push(`/user/index?pageIndex=${page}`)
    }

    operateColumnRender = (text, item) => {

    }

    handleExportClick = () => {
        window.open('/house/reserve/reserveExcel?batchId=' + this.state.batchId)
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
                    subTitle={`预约总数:${(page || {}).recordCount || 0} ${batch.name ? `所属批次：${batch.name}` : ''} `}
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
                    rowKey="id"
                    columns={[
                        { dataIndex: "batchId", title: "批次名称" },
                        { dataIndex: "reserveTime", title: "预约时间", render: (text) => moment(text).format('LLL') },
                        { dataIndex: "quotaId", title: "所用购房证" },
                        { dataIndex: "userId", title: "预约用户" },
                        { dataIndex: "chooseResult", title: "选房结果" },
                        { title: "操作", render: this.operateColumnRender, },
                    ]}
                    dataSource={list || []}
                    pagination={{ ...page, current: page.pageIndex, size: 5, onChange: this.handlePageChange, }}
                ></Table>
            </Row>
        )
    }
}
