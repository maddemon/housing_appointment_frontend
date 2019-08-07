import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Input, Tag, Button, Card, Spin, Col, Result } from 'antd'
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
        await this.props.stores.batchStore.selectModel();
        const batch = this.props.stores.batchStore.selectedModel;
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
    handlePressEnter = (e) => {
        this.handleSearch(e.target.value)
    }

    render() {
        const { selectedModel, permits, loading } = this.props.stores.batchStore
        return (
            <div>
                <PageHeader title="选房" />
                {selectedModel && selectedModel.uuid ?
                    <Row>
                        <Row type="flex" justify="center">
                            <Search size="large" onSearch={this.handleSearch} onPressEnter={this.handlePressEnter} placeholder="输入准购证号查询" enterButton style={{ width: '50%' }}></Search>
                        </Row>
                        <Spin spinning={loading}>
                            {permits.filter(e => e.permitCode.indexOf(this.state.searchKey) > -1).map(item => <PermitItem key={item.permitCode} model={item} onClick={this.handleItemClick} />)}
                        </Spin>
                    </Row>
                    : <Result
                        status="404"
                        title="没有可用批次"
                        subTitle="系统没有找到可用的批次，是否没有创建？"
                        extra={<Button type="primary" onClick={() => {
                            this.props.history.push('/batch/index')
                        }}>返回批次管理</Button>}
                    />
                }
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
        const enabled = model.users.filter(e => e.flag === '3').length > 0;
        return (
            <Button disabled={!enabled} onClick={this.handleClick}>
                准购证：{model.permitCode}
            </Button>
            // <Col span={6}>
            //     <Card size="small" title={model.permitCode} extra={canBeChoose ? <Button type="primary" size="small" onClick={this.handleClick}>选房</Button> : <Button disabled={true}>已选完</Button>} >
            //         {model.users.map(user => <Tag key={user.batchQuotaUuid}>{user.userName}</Tag>)}
            //     </Card>
            // </Col>
        );
    }
}