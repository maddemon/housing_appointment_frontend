import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Card, Descriptions, Row, Col } from 'antd'

import QuotaItemControl from './_quotaItem'

@inject('stores')
@observer
export default class PermitItemControl extends Component {
    render() {
        const permit = this.props.model
        return (
            <Card>
                <Card title={`准购证号：${permit.permitCode}`}>
                街镇：{permit.town}<br />动迁机构：{permit.agency}
                </Card>
                {/* <Descriptions title={`准购证号：${permit.permitCode}`} bordered column={{ md: 2, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="街镇">{permit.town}</Descriptions.Item>
                    <Descriptions.Item label="动迁机构">{permit.agency}</Descriptions.Item>
                    <Descriptions.Item label="限购套数">{permit.quotaNumber}</Descriptions.Item>
                    <Descriptions.Item label="实发套数">{permit.issueNumber}</Descriptions.Item>
                    <Descriptions.Item label="备注">{permit.remark}</Descriptions.Item>
                </Descriptions> */}
                <br />
                <Row  gutter={{ lg: 24, md: 16 }}>
                    {permit.quotas.map((quota, key) => <Col key={key} lg={12} md={24} style={{marginTop:10}}>
                        <QuotaItemControl model={quota} onClick={this.props.onClick}/>
                    </Col>)}
                </Row>

            </Card>
        )
    }
}