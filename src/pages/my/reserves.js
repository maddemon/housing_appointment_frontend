import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button } from 'antd'

@inject('stores')
@observer
export default class MyAppointmentsPage extends Component {
    componentWillMount() {
        console.log('MyReservesPage')
    }
    render() {
        return (
            <div>
                <Button>我的预约</Button>
            </div>
        )
    }
}
