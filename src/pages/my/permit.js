import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Button, Empty, Card, Tag, Icon, PageHeader, Spin, Table, Descriptions } from 'antd'
@inject('stores')
@observer
class UserQuotaPage extends Component {

    componentWillMount() {
        this.props.stores.globalStore.setTitle('预约选房');
        this.props.stores.permitStore.getList();
    }

    handleQuotaClick = (item) => {
        this.props.history.push('/appointment/make')
    }

    operateColumnRender = (item) => {
        if (!item.mine) {
            return null;
        }
        return (
            <Button type="primary" onClick={() => {
                this.props.history.push('/appointment/make?userQuotaId=' + item.id)
            }}>
                <Icon type="check"></Icon>预约
            </Button>
        )
    }

    statusColumnRender = (item) => {
        let color = "#2db7f5";
        switch (item.status) {
            default:
                color = "#999";
                break;
            case 1://等待他人
                color = "#2db7f5";
                break;
            case 2://已预约
                color = "#108ee9";
                break;
            case 3:
            case 4://已入围
            case 5://已选房
                color = "#87d068";
                break;
            case -1://放弃、尾批
                color = "#f50";
                break;
        }
        return <Tag color={color}>{item.statusText}</Tag>
    }
    render() {

        const { list, loading } = this.props.stores.permitStore;

        return (
            <>
                <PageHeader title="我的准购证" />
                <Spin spinning={loading}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                        {(list || []).length === 0 ? <Empty description="暂无可用购房证"></Empty> :
                            list.map((permit, key) => <Card key={key}><Descriptions title={`准购证号：${permit.permitCode}`} bordered column={{ md: 2, sm: 1, xs: 1 }}>
                                <Descriptions.Item label="街镇">{permit.town}</Descriptions.Item>
                                <Descriptions.Item label="动迁机构">{permit.agency}</Descriptions.Item>
                                <Descriptions.Item label="限购套数">{permit.quotaNumber}</Descriptions.Item>
                                <Descriptions.Item label="实发套数">{permit.issueNumber}</Descriptions.Item>
                                <Descriptions.Item label="备注">{permit.remark}</Descriptions.Item>
                            </Descriptions>
                                <br />
                                {permit.quotas.map((quota, key) => <span key={key}>
                                    <Descriptions title={<span>
                                        购房证：{permit.permitCode}-{quota.quotaCode}
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {this.operateColumnRender(quota)}
                                    </span>} bordered column={{ md: 2, sm: 1, xs: 1 }}>
                                        <Descriptions.Item label="姓名">{quota.user}</Descriptions.Item>
                                        <Descriptions.Item label="状态">{this.statusColumnRender(quota)}</Descriptions.Item>
                                        <Descriptions.Item label="打印时间">{quota.printTime}</Descriptions.Item>
                                        <Descriptions.Item label="备注">{quota.remark}</Descriptions.Item>
                                    </Descriptions>
                                    <br />
                                </span>)}
                            </Card>)}
                    </Row>
                </Spin>
            </>
        )
    }
}
export default UserQuotaPage