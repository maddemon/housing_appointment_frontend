import React, { Component } from 'react'
import { Modal } from 'antd'

export default class SharedModal extends Component {
    state = { visible: false }
    showModal = (e) => {
        if (e) e.stopPropagation()
        this.setState({ visible: true, })
    }
    hideModal = () => {
        this.setState({ visible: false, })
    }
    render() {
        const { children, trigger, title, width, height, onSubmit, style } = this.props
        return (
            <>
                <span onClick={this.showModal}>
                    {trigger}
                </span>
                <Modal title={title || ''}
                    visible={this.state.visible}
                    width={width}
                    height={height}
                    onOk={onSubmit}
                    onCancel={this.hideModal}
                    style={style}
                >
                    {children}
                </Modal>
            </>
        )
    }

}