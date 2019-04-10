import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Layout, Row, Col, Button, Empty, Tag, PageHeader } from 'antd'

@inject('stores')
@observer
class UserQuotaPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('我的指标');
        this.props.stores.quotaStore.setMyList();
    }

    handleItemClick = (item) => {
        this.props.history.push('/reserve/step1?quotaUuid=' + item.uuid)
    }

    quotaItemRender = (item) => {
        return <Col xxl={12} xl={12} lg={12} key={item.uuid + Math.random()}>
            <Button onClick={() => this.handleItemClick(item)} style={{ width: '98%', height: '100px', margin: '10px' }} disabled={item.quotaStatus === 1}>
                <h3>指标{item.uuid}</h3>
                <small>{item.quotaStatus ? <Tag color="green">已使用</Tag> : <Tag color="gray">待预约</Tag>}</small>
            </Button>
        </Col>
    }

    render() {

        const list = this.props.stores.quotaStore.myList || [];

        return (
            <>

                <PageHeader
                    title="我的指标"
                    subTitle="点击指标进行预约"
                />
                <Row>
                    {list.length === 0 ? <Empty>暂无指标</Empty> : list.map(v => this.quotaItemRender(v))}
                </Row>
            </>
        )
    }
}
export default UserQuotaPage