import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { PageHeader, Tag, message, Modal } from 'antd'

import moment from 'moment'
import { QueryString } from '../../common/utils'
import BatchItemControl from './_batchItem'
import PermitItemControl from './_permitItem'
import NonBatchControl from './_nonBatch'
import NonPermitControl from './_nonPermit'

@inject('stores')
@observer
export default class MakeAppointmentPage extends Component {

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('预约选房');
        await this.loadList()
    }

    loadList = async (props) => {
        props = props || this.props
        const query = QueryString.parseJSON(props.location.search)
        if (query.batchId) {
            await this.props.stores.batchStore.getModel(query.batchId);
        }
        else {
            await this.props.stores.batchStore.getCurrentModel();
        }
        this.props.stores.permitStore.getList();
    }

    handleBack = () => {
        this.props.history.goBack();
    }

    handleClick = (userQuota) => {
        const batch = this.props.stores.batchStore.model;
        Modal.confirm({
            title: "确认",
            okText: "预约",
            cancelText: "再想想",
            content: <div>
                <p>已选批次：{batch.name}</p>
                <p>已选购房证：{userQuota.permitCode}-{userQuota.quotaCode}</p>
                <p>当前日期：{moment().format('LL')}</p>
                <p style={{ color: 'red' }}>系统将在{moment(batch.appointmentEndTime).add(1, "days").format('ll')}发送入围通知短信，请留意您的短信，方便查看是否入选。</p>
            </div>,
            onOk: async () => {
                const result = await this.props.stores.appointmentStore.make(batch.id, userQuota.id)
                if (result.ok) {
                    message.success("预约成功");
                    this.props.history.push('/my/history')
                }
                return false;
            }
        })
    }

    render() {
        const batch = this.props.stores.batchStore.model;
        const loading = this.props.stores.batchStore.loading;
        const permits = this.props.stores.permitStore.list;

        if (loading) {
            return null;
        }
        if (!batch && !loading) {
            return <NonBatchControl />
        }
        return (
            <>
                <PageHeader title="预约选房" tags={<Tag color="red">{batch.name}</Tag>} onBack={this.handleBack} />
                <BatchItemControl model={batch} isAppoinmentPage={true} />
                <br />
                {permits.length === 0 ?
                    <NonPermitControl /> :
                    permits.map((item, key) => <PermitItemControl
                        key={key}
                        model={item}
                        onClick={this.handleClick}
                    />)}
            </>
        )
    }
}