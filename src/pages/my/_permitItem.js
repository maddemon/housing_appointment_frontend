import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Card, Descriptions } from 'antd'

import QuotaItemControl from './_quotaItem'

@inject('stores')
@observer
export default class PermitItemControl extends Component {
    render() {
        const permit = this.props.model
        return (
            <Card>
                <Descriptions title={`准购证号：${permit.permitCode}`} bordered column={{ md: 2, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="街镇">{permit.town}</Descriptions.Item>
                    <Descriptions.Item label="动迁机构">{permit.agency}</Descriptions.Item>
                    <Descriptions.Item label="限购套数">{permit.quotaNumber}</Descriptions.Item>
                    <Descriptions.Item label="实发套数">{permit.issueNumber}</Descriptions.Item>
                    <Descriptions.Item label="备注">{permit.remark}</Descriptions.Item>
                </Descriptions>
                <br />
                {permit.quotas.map((quota, key) => (
                    <span key={key}>
                        <QuotaItemControl model={quota} onClick={this.props.onClick} />
                        <br />
                    </span>
                ))}
            </Card>
        )
    }
}