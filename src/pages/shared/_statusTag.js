import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tag } from 'antd'

export default class StatusTag extends Component {

    render() {
        const { status, text } = this.props
        let color = "#2db7f5";
        switch (status) {
            default:
                color = "#999";
                break;
            case 1://等待他人
                color = "#2db7f5";
                break;
            case 2://已预约
                color = "#108ee9";
                break;
            case 3:
            case 4://已入围
            case 5://已选房
                color = "#87d068";
                break;
            case -1://放弃、尾批
                color = "#f50";
                break;
        }
        return <Tag color={color}>{text || this.props.children}</Tag>
    }
}
StatusTag.propTypes = {
    status: PropTypes.number.isRequired,
    text: PropTypes.string
}