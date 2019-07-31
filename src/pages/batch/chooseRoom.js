import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Button, Spin, Col, Card, Select, Result } from 'antd'

@inject('stores')
@observer
export default class ChooseRoomPage extends Component {

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('预约管理');
        await this.loadData()
    }

    loadData = async () => {
        const batch = this.props.stores.batchStore.selectedModel;
        if (batch.uuid) {
            await this.props.stores.batchStore.getHouses(batch.uuid);
        }
    }

    handleHouseChange = (value) => {
        this.props.stores.batchStore.selectHouse(value);
    }

    handleBuildingChange = (value) => {
        this.props.stores.batchStore.selectBuilding(value)
    }

    render() {
        const batch = this.props.stores.batchStore.selectedModel;
        let { loading, houses, selectedHouse, selectedBuilding } = this.props.stores.batchStore;
        if (!batch.uuid) {
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
        if (loading) {
            return <Spin loading={loading}></Spin>
        }
        return (
            <div>
                <PageHeader title="选房"
                    extra={
                        <>
                            <Select onChange={this.handleHouseChange} defaultValue={selectedHouse.name} placeholder="请选择楼盘" style={{ width: '200px' }}>
                                {houses.map(e => <Select.Option key={e.name}>{e.name}</Select.Option>)}
                            </Select>
                            <Select onChange={this.handleBuildingChange} defaultValue={selectedBuilding.name} style={{ width: '200px' }}>
                                {selectedHouse.buildings.map(e => <Select.Option key={e.name}>{e.name}</Select.Option>)}
                            </Select>
                        </>
                    }
                />
                <Card title={`${selectedHouse.name} - ${selectedBuilding.name}`}>
                    <Row className="units" gutter={16}>
                        {selectedBuilding.units.map(unit => <Col key={unit.name} span={24 / selectedBuilding.units.length}>
                            <h3>{unit.name}</h3>
                            <Row className="floors">
                                {unit.floors.map(floor => <Row key={floor.name} className="rooms">
                                    {floor.rooms.map(room => <Col key={room.roomUuid} span={parseInt(24 / floor.rooms.length)} >
                                        <Button style={{ width: '100%', height: '100px', marginTop: '10px' }}>{room.room}</Button>
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
