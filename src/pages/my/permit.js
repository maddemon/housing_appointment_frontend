import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Button, Empty, Card, Tag, Icon, PageHeader, Spin, Table, Descriptions } from 'antd'
import NonPermitControl from './_nonPermit'
import PermitItemControl from './_permitItem'

@inject('stores')
@observer
class UserQuotaPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('预约选房');
        this.props.stores.permitStore.getList();
    }

    render() {

        const { list, loading } = this.props.stores.permitStore;

        return (
            <>
                <PageHeader title="我的准购证" />
                <Spin spinning={loading}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                        {(list || []).length === 0 ? <NonPermitControl /> :
                            list.map((item, key) => <PermitItemControl key={key} model={item} />)}
                    </Row>
                </Spin>
            </>
        )
    }
}
export default UserQuotaPage