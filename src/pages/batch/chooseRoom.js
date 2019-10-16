import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Button, Col, Card, Select, Result, Modal, message } from 'antd'

@inject('stores')
@observer
export default class ChooseRoomPage extends Component {
    async componentWillMount() {
        this.props.stores.globalStore.setTitle('预约管理');
        await this.loadData()
    }

    loadData = async () => {
        const { selectedModel, selectedUser } = this.props.stores.batchStore;
        //如果么有选中购房人，则默认选择第一个可用的购房人，如果没有，则此准购证无效
        if (!selectedUser) {
            this.props.history.push('/batch/choosePermit')
        }
        if (selectedModel && selectedModel.id) {
            await this.props.stores.batchStore.getHouses(selectedModel.id);
        }
    }

    handleHouseChange = (value) => {
        this.props.stores.batchStore.selectHouse(value);
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
    render() {
        const batch = this.props.stores.batchStore.selectedModel;
        let { loading, house, selectedPermit, selectedUser, selectedHouse, selectedBuilding } = this.props.stores.batchStore;
        if (!batch.id) {
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
        if (!selectedHouse) {
            return <Result
                status="提醒"
                title="该批次还没有选择楼盘，请返回管理界面选择"
                extra={
                    <Button type="primary" key="console" onClick={() => {
                        this.props.history.push('/batch/index')
                    }}>返回</Button>
                }
            />
        }
        if (loading) {
            return null
        }

        return (
            <div>
                <PageHeader title="选房" />
                <Card title={`第①步：请选择下面的购房人 ↓`}>
                    {selectedPermit.users.map(item => <Button key={item.batchQuotaId} type={selectedUser && selectedUser.batchQuotaId === item.batchQuotaId ? "primary" : ""} onClick={() => {
                        this.props.stores.batchStore.selectUser(item)
                    }}>{item.userName}</Button>)}
                </Card>
                <Card title={<>
                    <span>第②步：筛选房屋 -> </span>
                    <Select key="ddl-house" onChange={this.handleHouseChange} defaultValue={selectedHouse.name} placeholder="请选择楼盘" style={{ width: '200px' }}>
                        {house.map(e => <Select.Option key={e.name}>{e.name}</Select.Option>)}
                    </Select>
                    <Select key="ddl-building" onChange={this.handleBuildingChange} defaultValue={selectedBuilding.name} style={{ width: '200px' }}>
                        {selectedHouse.buildings.map(e => <Select.Option key={e.name}>{e.name}</Select.Option>)}
                    </Select>
                </>} style={{ marginTop: '10px' }}>
                    <Row className="units" gutter={16}>
                        {selectedBuilding.units.map(unit => <Col key={unit.name} span={24 / selectedBuilding.units.length}>
                            <h3>{unit.name}</h3>
                            <Row className="floors">
                                {unit.floors.map(floor => <Row key={floor.name} className="rooms">
                                    {floor.rooms.map(room => <Col key={room.roomId} span={parseInt(24 / floor.rooms.length)} >
                                        <RoomItemControl model={room} onClick={this.handleChooseRoom} />
                                    </Col>)}
                                </Row>)}
                            </Row>
                        </Col>)}
                    </Row>
                </Card>
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
                <h1>{room.room}</h1>
                <p>户型：{room.model}</p>
                <p>面积：{room.area}平方米</p>
                <p>单价：{room.price}元/平方米</p>
                <p>总价：{room.price * room.area}</p>
            </Button>
        )
    }
}
