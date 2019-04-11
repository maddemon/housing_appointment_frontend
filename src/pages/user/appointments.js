import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('stores')
@observer
export default class UserReservePage extends Component {
    componentWillMount() {
        this.props.stores.globalStore.setTitle('我的预约');
    }
    render() {
        return (
            <div>
                我的预约
            </div>
        )
    }
}
