import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Button, Empty, Card, Tag, Icon, PageHeader, Spin, Table, Descriptions } from 'antd'
import NonPermitControl from './_nonPermit'
import PermitItemControl from './_permitItem'
import StatusTag from '../shared/_statusTag'

@inject('stores')
@observer
class UserQuotaPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('预约选房');
        this.props.stores.permitStore.getList();
        this.props.stores.batchStore.getModel()
    }

    render() {

        let { list, loading } = this.props.stores.permitStore;
        list = list || [];

        return (
            <>
                <PageHeader title="我的准购证" />
                <Spin spinning={loading}>
                    {(list || []).length === 0 ? <NonPermitControl /> :
                        list.map((item, key) => <Card title={`准购证号：${item.permitCode}`} key={item.permitCode}>
                            {item.quotas.map((quota, key1) => <Row key={key1} style={{ padding: 5 }}>
                                {quota.user}（{quota.permitCode}-{quota.quotaCode}） <StatusTag status={quota.status} text={quota.statusText} />
                            </Row>)}
                        </Card>)}
                </Spin>
            </>
        )
    }
}
export default UserQuotaPage