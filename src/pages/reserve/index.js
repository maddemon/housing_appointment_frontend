import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('stores')
@observer
export default class ReserveIndexPage extends Component {
    componentWillMount() {
        console.log('ReserveIndexPage')
    }
    render() {
        return (
            <div>
                预约管理
            </div>
        )
    }
}
