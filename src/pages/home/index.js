import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import MyQuotasPage from '../my/quotas'
import BatchIndexPage from '../batch/index'
@inject('stores')
@observer
export default class HomePage extends Component {
    componentWillMount() {
        this.props.stores.globalStore.setTitle('首页');
    }
    render() {
        const user = this.props.stores.userStore.current;
        if (user) {
            if (user.role === 'user') {
                return <MyQuotasPage {...this.props} />
            }
            else if (user.role === 'admin') {
                return <BatchIndexPage {...this.props} />
            }
        }
        return <Redirect to="/user/login" />
    }
}
