import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Button, Card, Col, Result } from 'antd'
@inject('stores')
@observer
export default class ChooseResultPage extends Component {

    state = { timer: null }

    async componentWillMount() {
        await this.loadData();
    }

    componentWillUnmount() {
        if (this.state.timer) {
            clearInterval(this.state.timer)
        }
    }

    loadData = async () => {
        const batch = this.props.stores.batchStore.selectedModel
        if (!batch) {
            await this.props.stores.batchStore.selectModel()
        }
        if (batch) {
            await this.props.stores.batchStore.getHouses(batch.id);
            const timer = setInterval(async () => {
                await this.props.stores.batchStore.getHouses(batch.id);
            }, 5000);
            this.setState({ timer })
        }
    }

    render() {
        const batch = this.props.stores.batchStore.selectedModel
        if (!batch.id) {
            return <Result status="404" title="未找到批次" subTitle="请从批次管理点击进入" ></Result>
        }
        const house = this.props.stores.batchStore.house
        return (
            <Row>
                <PageHeader title={`${batch.name}选房结果`} />
                <Row className="house" gutter={16}>
                    {house.map(house => (
                        <Col key={house.name} span={24 / house.length}>
                            <Card title={house.name}>
                                <Row className="buildings">
                                    {house.buildings.map(building => (
                                        <Col key={building.name} span={24 / house.buildings.length}>
                                            {building.name}
                                            <Row className="units">
                                                {building.units.map(unit => (
                                                    <Col key={unit.name} span={24 / building.units.length}>
                                                        {unit.name}
                                                        <Row className="floors">
                                                            {unit.floors.map(floor => (
                                                                <Col key={floor.name}>
                                                                    <Button.Group className="rooms">
                                                                        {floor.rooms.map(room => (
                                                                            <Button key={room.roomId} disabled={room.userId}>{room.room}</Button>
                                                                        ))}
                                                                    </Button.Group>
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Row>
        )
    }
}
