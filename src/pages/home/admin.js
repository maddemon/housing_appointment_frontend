import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Button, Input, Spin, Result, Card } from 'antd';
import { QueryString } from '../../common/utils'
const { Search } = Input;

@inject('stores')
@observer
export default class AdminIndexPage extends Component {
    state = { searchKey: '', pageIndex: 1, pageSize: 20 }

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('管理首页');
        await this.props.stores.batchStore.getList(this.state.pageIndex, this.state.pageSize)
    }

    render() {
        const { loading, list, page } = this.props.stores.batchStore
        return (
            <Row>
                <PageHeader title="欢迎页" subTitle="预约公示" />
                <Spin loading={loading}>
                    {list.length > 0 ?
                        list.map(item => <BacthItemControl key={item.uuid} model={item} />)
                        :
                        <Result
                            title="当前没有可用的批次"
                            extra={
                                <Button type="primary" key="console">
                                    查看更多批次
                                </Button>
                            }
                        />
                    }

                </Spin>
            </Row>
        )
    }
}

class BacthItemControl extends Component {
    render() {
        return (
            <Card></Card>
        )
    }
}
