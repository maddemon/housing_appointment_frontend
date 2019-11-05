import React, { Component } from 'react'
import Config from '../../common/config'

export default class LoginLogoControl extends Component {
    render() {
        return (
            <div className="top">
                <div className="header">
                    <img alt="logo" className="logo" src="/images/logo.png" />
                    <span className="title">{Config.SystemName}</span>
                </div>
            </div>
        )
    }
}
