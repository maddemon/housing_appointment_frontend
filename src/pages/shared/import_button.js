import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Button, message, Upload } from 'antd'

export default class ImportButton extends Component {
    static propTypes = {
        action: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired
    }

    state = { uploading: false }

    handleUpload = ({ file }) => {
        switch (file.status) {
            case 'uploading':
                this.setState({ uploading: true })
                return;
            case 'done':
                const response = file.response
                message.success(response.message)
                if (this.props.onChange) {
                    this.props.onChange(file.response)
                }
                this.setState({ uploading: false })
                break;
            default:
                this.setState({ uploading: false })
                break;
        }
    }

    render() {
        return (
            <Upload
                name={this.props.name}
                action={this.props.action}
                showUploadList={false}
                onChange={this.handleUpload}
                withCredentials={true}
            >
                <Button type="success" loading={this.state.uploading}><Icon type="import" /> {this.props.text}</Button>
            </Upload>
        )
    }
}
