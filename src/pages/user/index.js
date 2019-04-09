import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('stores')
@observer
export default class UserIndexPage extends Component {
    render() {
        return (
            <div>
                用户管理
            </div>
        )
    }
}
