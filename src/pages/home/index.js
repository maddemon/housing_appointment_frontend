import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Icon, Button, Table, Modal, Tag } from 'antd'
@inject('stores')
@observer
export default class HomePage extends Component {
    componentWillMount() {
        this.props.stores.globalStore.setTitle('首页');
    }
    render() {
        const { loading, list, page } = this.props.stores.appointmentStore
        return <Row>
            <PageHeader title="首页" subTitle="预约公示" />
            <div className="toolbar">

            </div>
            <Table
                loading={loading}
                rowKey="uuid"
                columns={[
                    { dataIndex: "userName", title: "用户"},
                    { dataIndex: "appointmentResult", title: "预约结果"},
                    { dataIndex: "chooseResult", title: "选房结果"},
                ]}
                dataSource={list}
                pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
            ></Table>
        </Row>
    }
}
