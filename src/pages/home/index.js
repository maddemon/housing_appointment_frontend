import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import UserQuotasPage from '../user/quotas'
import UserIndexPage from '../user/index'
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
                return <UserQuotasPage {...this.props} />
            }
            else if (user.role === 'admin') {
                return <UserIndexPage {...this.props} />
            }
        }
        return <Redirect to="/user/login" />
    }
}
