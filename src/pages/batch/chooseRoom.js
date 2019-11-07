import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Button, Col, Card, Select, Result, Modal, message, Steps, Divider, Table, Tag } from 'antd'
import { QueryString } from '../../common/utils'
import StatusTag from '../shared/_statusTag'
@inject('stores')
@observer
export default class ChooseRoomPage extends Component {

    state = {
        step: 0,
        selectedQuota: null,
        selectedHouse: null,
        selectedBuilding: null,
    }

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('选房');
        await this.loadData()
        this.initStep();
    }

    loadData = async (props) => {
        props = props || this.props;
        let query = QueryString.parseJSON(props.location.search)
        await this.props.stores.batchStore.getModel(query.batchId);
        await this.props.stores.permitStore.getModel(query.permitId);
    }

    initStep = () => {
        let step = 0;
        let selectedQuota = null;
        let selectedHouse = null;
        const permit = this.props.stores.permitStore.model;
        if (permit && permit.quotas.length === 1) {
            step = 1;
            selectedQuota = permit.quotas[0];
        }
        const batch = this.props.stores.batchStore.model;
        if (batch && batch.houses.length === 1) {
            step = 2;
            selectedHouse = batch.houses[0];
        }
        if (step) {
            this.setState({ step, selectedHouse, selectedQuota })
        }
    }

    handleSelectQuota = (quota) => {
        this.setState({ step: 1, selectedQuota: quota })
    }
    handleBackSelectQuota = () => {
        this.setState({ step: 0, selectedQuota: null })
    }
    handleSelectHouse = (house) => {
        this.setState({ step: 2, selectedHouse: house });
        this.props.stores.houseStore.getRooms(house.id);
    }
    handleBackSelectHouse = () => {
        this.setState({ step: 1, selectedHouse: null })
    }

    handleBuildingChange = (value) => {
        this.props.stores.batchStore.selectBuilding(value)
    }

    handleChooseRoom = async (room) => {
        let user = this.props.stores.batchStore.selectedUser;
        if (!user) {
            message.error("请选择购房人");
            return false;
        }
        const response = await this.props.stores.batchStore.selectRoom(room);
        if (response.status === '200') {
            Modal.success({
                title: '选房成功',
                content: "恭喜您选中了" + room.room + "号房",
                onOk: () => {
                    //重新加载楼盘
                    this.props.stores.batchStore.selectUser(null);
                    this.loadData();
                }
            });
        } else {
            Modal.error({
                title: "选房失败",
                content: "很遗憾选房失败了：" + response.message
            });
        }
    }

    renderStepContent = () => {
        const permit = this.props.stores.permitStore.model;
        const batch = this.props.stores.batchStore.model;
        if (!permit || !batch) return null;

        switch (this.state.step) {
            default:
            case 0:
                return (
                    <Table
                        rowKey="id"
                        dataSource={permit.quotas}
                        columns={[
                            { dataIndex: 'permitCode', title: '购房证号', render: (text, item) => <span>{item.permitCode}-{item.quotaCode}</span> },
                            { dataIndex: 'user', title: '姓名' },
                            { dataIndex: 'phone', title: '电话' },
                            { dataIndex: 'idCard', title: '证件号' },
                            { dataIndex: 'status', title: '预约状态', render: (text, item) => <StatusTag status={item.status}>{item.statusText}</StatusTag> },
                            { dataIndex: 'id', title: '操作', render: (text, item) => <Button type="primary" disabled={item.status === 4} onClick={() => this.handleSelectQuota(item)}>选房</Button> }
                        ]}
                    />
                )
            case 1:
                return (
                    <Card title="房屋筛选">
                        <Row gutter={6}>
                            {batch.houses.map((item, key) => <Col key={key} span={24 / batch.houses.length}>
                                <Button
                                    onClick={() => this.handleSelectHouse(item)}
                                    style={{ height: 120, width: '100%', margin: "0 5px" }}
                                    disabled={item.remaining.dwelling === 0}>
                                    <h3>{item.name}</h3>
                                    <p>
                                        房屋：{item.remaining.dwelling}/{item.count.dwelling}<br />
                                        停车位：{item.remaining.parking}/{item.count.parking}<br />
                                        贮藏室：{item.remaining.storeroom}/{item.count.storeroom}<br />
                                        露台：{item.remaining.terrace}/{item.count.terrace}<br />
                                    </p>
                                </Button>
                            </Col>)}
                        </Row>
                    </Card>
                )
            case 2:
                break;
        }
    }

    render() {
        //获取批次
        const batch = this.props.stores.batchStore.model;
        if (!batch && !this.props.stores.batchStore.loading) {
            return <Result
                status="提醒"
                title="没有选择批次，请从批次管理-选房进入"
                extra={
                    <Button type="primary" key="console" onClick={() => {
                        this.props.history.push('/batch/index')
                    }}>返回</Button>
                }
            />
        }
        //获取准购证
        const permit = this.props.stores.permitStore.model;
        if (!permit && !this.props.stores.permitStore.loading) {
            return <Result
                status="提醒"
                title="没有选择准购证"
                extra={
                    <Button type="primary" key="console" onClick={() => {
                        this.props.history.push('/batch/choosePermit?batchId=' + batch.id)
                    }}>返回</Button>
                }
            />
        }
        //获取楼盘
        const houses = batch.houses;
        const house = houses.length > 0 ? houses[0] : {};
        if (!house.id) {
            return <Result
                status="提醒"
                title="没有楼盘资料，请修改楼盘信息"
                extra={
                    <Button type="primary" key="console" onClick={() => {
                        this.props.history.push('/house/index')
                    }}>返回</Button>
                }
            />;
        }


        return (
            <div>
                <PageHeader title="选房" />
                <Row>
                    <Steps current={this.state.step} style={{ margin: '10px auto', width: '90%' }}>
                        <Steps.Step title={this.state.selectedQuota ? <span>已选择 <Tag color="red">{this.state.selectedQuota.user}</Tag></span> : "选择购房资格"} description={this.state.step > 0 ? <Button onClick={this.handleBackSelectQuota} size="small">重选</Button> : null} />
                        <Steps.Step title={this.state.selectedHouse ? <span>已选择 <Tag color="red">{this.state.selectedHouse.name}</Tag></span> : "选择楼盘"} description={this.state.step > 1 ? <Button onClick={this.handleBackSelectHouse} size="small">重选</Button> : null} />
                        <Steps.Step title={this.state.selectedRoom ? <span>已选择 <Tag color="red">{this.state.selectedRoom.name}</Tag></span> : "选择房屋"} />
                    </Steps>
                    <Divider />
                </Row>
                {this.renderStepContent()}
            </div>
        )
    }
}

@inject("stores")
@observer
class RoomItemControl extends Component {

    handleChoose = () => {
        const room = this.props.model
        Modal.confirm({
            title: "确认",
            content: `你确定要选择${room.room}房号吗？`,
            okText: "确定",
            cancelText: "再想想",
            maskClosable: true,
            onOk: async () => {
                this.props.onClick(room)
            }

        })
    }

    render() {
        const room = this.props.model
        return (
            <Button className="room" onClick={this.handleChoose}>
                <h1>{room.number}</h1>
                <p>面积：{room.area}平方米</p>
                <p>总价：{room.price * room.area}</p>
            </Button>
        )
    }
}
