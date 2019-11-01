import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Button, Col, Card, Select, Result, Modal, message } from 'antd'
import { QueryString } from '../../common/utils'

@inject('stores')
@observer
export default class ChooseRoomPage extends Component {
    async componentWillMount() {
        this.props.stores.globalStore.setTitle('预约管理');
        await this.loadData()
    }

    loadData = async (props) => {
        props = props || this.props;
        let query = QueryString.parseJSON(props.location.search)
        await this.props.stores.batchStore.getModel(query.batchId);
        await this.props.stores.permitStore.getModel(query.permitId);
        await this.props.stores.houseStore.getList({ batchId: query.batchId })
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
        const loading = this.props.stores.batchStore.loading && this.props.stores.permitStore.loading && this.props.stores.houseStore.loading;
        const batch = this.props.stores.batchStore.model;
        const permit = this.props.stores.permitStore.model;
        const houses = this.props.stores.houseStore.list || [];
        const house = houses.length > 0 ? houses[0] : null;
        if (!house) {
            return null;
        }

        if (loading) {
            return null
        }
        if (!batch) {
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
        if (!permit) {
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

        return (
            <div>
                <PageHeader title="选房"
                    extra={<Row style={{ width: 400 }}>
                        <Col span={12}>
                            <Select onChange={this.handleHouseChange} style={{ width: '100%' }} placeholder="切换楼盘" defaultValue={(house.id || '').toString()}>
                                {houses.map((item, key) => <Select.Option key={item.id}>{item.name}</Select.Option>)}
                            </Select>
                        </Col>
                        <Col span={12}>
                            <Select onChange={this.handleBuildingChange} style={{ width: '100%' }} placeholder="选择楼栋" >
                                {}
                            </Select>
                        </Col>
                    </Row>}
                />

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
