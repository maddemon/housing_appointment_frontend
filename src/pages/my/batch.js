import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { PageHeader, Spin } from 'antd'

import NonBatchControl from './_nonBatch'
import BatchItemControl from './_batchItem'

@inject('stores')
@observer
export default class AppointmentStep1Page extends Component {

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('预约选房');
        await this.props.stores.batchStore.getAvaliables();
    }

    handleAppointmentClick = (batch) => {
        this.props.history.push('/my/appointment/?batchId=' + batch.id)
    }

    handleRedirectToPermitPage = () => {
        this.props.history.push('/my/permit')
    }

    render() {
        const { avaliables, loading } = this.props.stores.batchStore;
        return (
            <>
                <PageHeader title="预约选房" />
                <br />
                <Spin spinning={loading}>
                    {avaliables.length === 0 ?
                        <NonBatchControl />
                        :
                        avaliables.map((item, key) => <BatchItemControl model={item} key={key} onClick={this.handleAppointmentClick} />)
                    }
                </Spin>
            </>
        )
    }
}