import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Input, Tag, Button, Card, Spin, Col } from 'antd'
const { Search } = Input;

@inject('stores')
@observer
export default class ChoosePermitPage extends Component {
    state = { searchKey: '' }

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('选房——选择准购证');
        await this.loadData()
    }

    loadData = async () => {
        const batch = this.props.stores.batchStore.selectedModel;
        console.log(batch.uuid)
        if (batch) {
            await this.props.stores.batchStore.getPermits(batch.uuid)
        }
    }

    handleItemClick = (item) => {
        this.props.stores.batchStore.selectPermit(item)
        this.props.history.push('/batch/chooseRoom')
    }

    handleSearch = (key) => {
        this.setState({ searchKey: key })
    }

    render() {
        const { permits, loading } = this.props.stores.batchStore
        return (
            <div>
                <PageHeader title="选择准购证号"
                    extra={<Search onSearch={this.handleSearch} placeholder="输入准购证号查询"></Search>}
                />
                <Row>
                    <Spin spinning={loading}>
                        {permits.filter(e => e.permitCode.indexOf(this.state.searchKey) > -1).map(item => <PermitItem key={item.permitCode} model={item} onClick={this.handleItemClick} />)}
                    </Spin>
                </Row>
            </div>
        )
    }
}
class PermitItem extends Component {
    handleClick = () => {
        const model = this.props.model
        this.props.onClick(model)
    }
    render() {
        const model = this.props.model
        return (
            <Col span={6}>
                <Card size="small" title={model.permitCode} extra={<Button type="primary" size="small" onClick={this.handleClick}>选房</Button>}>
                    {model.users.map(user => <Tag key={user.batchQuotaUuid}>{user.userName}</Tag>)}
                </Card>
            </Col>
        );
    }
}