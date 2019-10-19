import React, { Component } from 'react'
import { Result } from 'antd'

export default class NonPermitControl extends Component {
    render() {
        return (
            <>
                <br />
                <Result
                    status="warning"
                    title="您还没有准购证"
                >
                    <div className="desc">
                        <li>您还没有领取购房准购证</li>
                    </div>
                </Result>
            </>
        )
    }
}
