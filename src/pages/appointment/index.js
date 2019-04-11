import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('stores')
@observer
export default class AppointmentIndexPage extends Component {
    componentWillMount() {
        console.log('AppointmentIndexPage')
    }
    render() {
        return (
            <div>
                预约管理
            </div>
        )
    }
}
