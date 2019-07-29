import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, PageHeader, Table, Input } from 'antd';
import { QueryString } from '../../common/utils'
const { Search } = Input;

@inject('stores')
@observer
export default class HomePage extends Component {
    state = { searchKey: '', pageIndex: 1, pageSize: 20 }

    async componentWillMount() {
        this.props.stores.globalStore.setTitle('公示预约结果');
        //await this.props.stores.batchStore.getList(1, 100);
        //await this.loadList(this.props)
    }

    loadList = async (props) => {
        let query = QueryString.parseJSON(props.location.search)
        await this.setState({ searchKey: query.searchKey || '', pageIndex: query.pageIndex || 1 });
        this.props.stores.appointmentStore.setResultList(this.state.searchKey, this.state.pageIndex, this.state.pageSize);
    }


    handleSearch = key => {
        this.props.history.push('?searchKey=' + key)
    }

    render() {
        // const { loading, resultList, page } = this.props.stores.appointmentStore
        return <Row>
            <PageHeader title="欢迎您"
                subTitle="预约公示"
                extra={
                    <Search placeholder="输入姓名查询" onSearch={this.handleSearch} enterButton ></Search>
                }
            />
            {/* <Table
                loading={loading}
                rowKey="uuid"
                columns={[
                    { dataIndex: "userName", title: "用户" },
                    { dataIndex: "reserveDate", title: "预约时间" },
                    { dataIndex: "reserveResult", title: "预约结果" },
                    { dataIndex: "chooseResult", title: "选房结果" },
                ]}
                dataSource={resultList || []}
                pagination={{ ...page, size: 5, onChange: this.handlePageChange, }}
            ></Table> */}
        </Row>
    }
}
