import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import Form from '../shared/form'

class SharedModal extends Component {
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
                    okText="确定"
                    cancelText="取消"
                >
                    {children}
                </Modal>
            </>
        )
    }

}

export default class FormModal extends SharedModal {
    form = null;
    handleSubmit = () => {
        this.form.validateFields(async (err, values) => {
            if (err) {
                return false;
            }
            else {
                if (await this.props.onSubmit(values) !== false) {
                    this.hideModal();
                    this.form.resetFields();
                }
            }
        })
    }

    render() {
        const { trigger, title, width, height, style } = this.props
        return (
            <>
                <span onClick={this.showModal}>
                    {trigger}
                </span>
                <Modal title={title || ''}
                    visible={this.state.visible}
                    width={width}
                    height={height}
                    onOk={this.handleSubmit}
                    onCancel={this.hideModal}
                    style={style}
                    okText="确定"
                    cancelText="取消"
                >
                    <Form items={this.props.items || []} ref={frm => this.form = frm} />
                </Modal>
            </>
        )
    }
}
FormModal.propTypes = {
    trigger: PropTypes.element.isRequired,
    items: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired
}