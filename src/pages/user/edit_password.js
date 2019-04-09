import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button } from 'antd'
@inject('stores')
@observer
export default class EditPasswordPage extends Component {
    componentWillMount() {
        console.log('EditPasswordPage')
        this.props.stores.globalStore.setTitle('修改密码');
    }

    render() {
        return (
            <div>
                <Button>修改密码</Button>
            </div>
        )
    }
}
