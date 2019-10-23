import React, { Component } from 'react'
import { Modal } from 'antd'

export default class ModalBase extends Component {

    state = { visible: false }

    showModal = (e) => {
        if (e) e.stopPropagation()
        this.setState({ visible: true, })
    }
    hideModal = () => {
        this.setState({ visible: false, })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== undefined && nextProps.visible !== this.state.visible) {
            this.setState({ visible: nextProps.visible })
        }
    }

    handleSubmit = () => { }

    renderBody = () => { }

    render() {
        const { trigger, title, width, height, style } = this.props
        return (
            <>
                {trigger ?
                    <span onClick={this.showModal}>
                        {trigger}
                    </span>
                    : null}
                <Modal title={title || ''}
                    visible={this.state.visible}
                    width={width}
                    height={height}
                    onOk={this.handleSubmit}
                    onCancel={this.hideModal}
                    style={style}
                >
                    {this.renderBody()}
                </Modal>
            </>
        )
    }
}