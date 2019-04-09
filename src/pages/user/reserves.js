import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('stores')
@observer
export default class UserReservePage extends Component {
    componentWillMount() {
        console.log('UserReservePage')
    }
    render() {
        return (
            <div>
                预约管理
            </div>
        )
    }
}
