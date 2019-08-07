import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from './form'
import { Modal } from 'antd'

export default class FormModal extends Component {

    state = { visible: false }
    showModal = (e) => {
        if (e) e.stopPropagation()
        this.setState({ visible: true, })
    }
    hideModal = () => {
        this.setState({ visible: false, })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== this.state.visible) {
            this.setState({ visible: nextProps.visible })
        }
    }


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
                    <Form items={this.props.items || []} ref={frm => this.form = frm} loading={this.props.loading} />
                </Modal>
            </>
        )
    }
}
FormModal.propTypes = {
    trigger: PropTypes.element,
    items: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool
}