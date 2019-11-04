import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Card, Icon} from 'antd'
import StatusTag from '../shared/_statusTag'

@inject('stores')
@observer
export default class QuotaItemControl extends Component {

    handleClick = () => {
        if (this.props.onClick) {
            this.props.onClick(this.props.model)
        }
    }

    handleClick = () => {
        const model = this.props.model
        if(this.props.onClick){
            this.props.onClick(model)
        }
    }
    render() {
        const model = this.props.model
        const batch = this.props.stores.batchStore.model

        const showButton = model.mine && (model.status === 0 || (model.status === 5 && batch.last))

        return (
            <Card>
                <div style={{margin:5}}>
                    {model.user}（{model.permitCode}-{model.quotaCode}）
                    <StatusTag status={model.status} text={model.statusText} />
                </div>
                {showButton ? <Button type="primary" onClick={this.handleClick}>
                    <Icon type="check" />
                    选择此购房资格</Button> : null}
            </Card>

            // <Button style={{ width: '100%', height: 80 }} disabled={disabled} onClick={this.handleClick} dashed>
            //     {model.user}（{model.permitCode}-{model.quotaCode}）  <br />
            //     <StatusTag status={model.status} text={model.statusText} />
            // </Button>
        )
    }
}
