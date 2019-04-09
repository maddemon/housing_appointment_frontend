import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Router, Redirect } from 'react-router-dom'

@inject('stores')
@observer
export default class UserLogout extends Component {

    componentWillMount() {
        console.log("h")
        this.props.stores.userStore.logout();
    }

    render() {
        console.log('user/logout')
        return (
            <Router>
                <Redirect to="/user/login"></Redirect>
            </Router>
        )
    }
}
