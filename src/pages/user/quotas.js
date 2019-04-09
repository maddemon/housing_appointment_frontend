import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Layout, Row, Button, Empty, Tag } from 'antd'

@inject('stores')
@observer
export default class UserQuotaPage extends Component {

    componentWillMount() {
        console.log('MyQuotas')
        this.props.stores.globalStore.setTitle('我的指标');

        this.props.stores.quotaStore.setMyList();
    }

    handleItemClick = (item) => {

    }

    quotaItemRender = (item) => {
        return <Button onClick={() => this.handleItemClick(item)}>
            <h3>指标{item.uuid}</h3>
            <p>日期：{item.createTime}</p>
            <p>{item.quotaStatus ? <Tag color="green">已使用</Tag> : <Tag color="gray">待预约</Tag>}</p>
        </Button>
    }

    render() {

        const list = this.props.stores.quotaStore.myList || [];

        return (
            <Layout>
                <h1>我的指标</h1>
                <Row>
                    {list.length === 0 ? <Empty>暂无指标</Empty> : list.filter(e => e.quotaStatus === 0).map(v => this.quotaItemRender(v))}
                </Row>
            </Layout>
        )
    }
}
