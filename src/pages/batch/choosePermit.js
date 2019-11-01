import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Input, Button, Spin, Result, Table, DatePicker, Col, Select } from 'antd'
import { QueryString } from '../../common/utils'
import StatusTag from '../shared/_statusTag'
import moment from 'moment'

@inject('stores')
@observer
export default class ChoosePermitPage extends Component {

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('选房——选择准购证');
        await this.loadData()
    }

    loadData = async (props) => {
        props = props || this.props;
        let query = QueryString.parseJSON(props.location.search)

        await this.props.stores.batchStore.getModel(query.batchId);
        const batch = this.props.stores.batchStore.model;
        if (batch) {
            query.pageSize = 99999;
            await this.props.stores.chooseDateStore.getList(batch.id)
            if (!query.chooseDateId) {
                const defaultChooseDate = await this.props.stores.chooseDateStore.getDefaultModel();
                console.log(defaultChooseDate)
                query.chooseDateId = (defaultChooseDate || {}).id || '';
            }
            await this.props.stores.permitStore.getEnterList(query)
        }
    }

    handleItemClick = (item) => {
        this.props.stores.batchStore.selectPermit(item)
        this.props.history.push('/batch/chooseRoom')
    }
    handleDateChange = (val) => {
        const batch = this.props.stores.batchStore.model;
        this.props.history.push(`?chooseDateId=${val}&batchId=${batch.id}`)
    }
    handleSearch = (key) => {
        this.setState({ searchKey: key })
    }
    handlePressEnter = (e) => {
        this.handleSearch(e.target.value)
    }

    quotaColumnRender = (text, record) => {
        return record.quotas.map((item, key) => {
            return <StatusTag key={key} status={item.status} text={`${item.quotaCode} - ${item.user} - ${item.statusText}`}></StatusTag>

        });
    }
    handleRedirectToChooseRoomPage = (permit) => {
        const batch = this.props.stores.batchStore.model;
        this.props.history.push(`/batch/chooseRoom?batchId=${batch.id}&permitId=${permit.id}`)
    }
    operateColumnRender = (text, record) => {
        return <Button type="primary" onClick={() => this.handleRedirectToChooseRoomPage(record)}>开始选房</Button>
    }

    render() {
        const { enterList, loading, parameter } = this.props.stores.permitStore;
        if (loading) return <></>
        console.log(parameter)

        const batch = this.props.stores.batchStore.model;
        if (!batch) {
            return (
                <Result
                    status="404"
                    title="没有可用批次"
                    subTitle="系统没有找到可用的批次，是否没有创建？"
                    extra={<Button type="primary" onClick={() => {
                        this.props.history.push('/batch/index')
                    }}>返回批次管理</Button>}
                />
            );
        }
        const chooseDateList = this.props.stores.chooseDateStore.list || [];
        return (
            <div>
                <PageHeader title="选房" extra={<Row>
                    <Col span={12}>
                        <Select onChange={this.handleDateChange} style={{ width: 200 }} defaultValue={(parameter.chooseDateId || '').toString()}>
                            {chooseDateList.map(item => <Select.Option key={item.id.toString()}>
                                {moment(item.day).format('ll')} - {item.hour === 1 ? "上午" : "下午"}
                            </Select.Option>)}
                        </Select>
                    </Col>
                    <Col span={12}>
                        <Input.Search
                            onSearch={this.handleSearch}
                            onPressEnter={this.handlePressEnter}
                            placeholder="输入准购证号查询"
                            enterButton
                        />
                    </Col>
                </Row>} />
                <Row>
                    <Table
                        bordered={true}
                        loading={loading}
                        rowKey="id"
                        columns={[
                            { dataIndex: "permitCode", title: "准购证号", },
                            { dataIndex: "agency", title: "动迁机构", },
                            { dataIndex: "town", title: "镇街" },
                            { dataIndex: "remark", title: "备注" },
                            { dataIndex: "quotas", title: "购房证", render: this.quotaColumnRender },
                            { dataIndex: "id", title: "操作", render: this.operateColumnRender }
                        ]}
                        dataSource={enterList}
                        defaultExpandAllRows={true}
                        expandedRowRender={this.quotaRowRender}
                        pagination={false}
                    ></Table>
                </Row>
            </div >
        )
    }
}