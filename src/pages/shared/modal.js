import React from 'react'
import PropTypes from 'prop-types'
import Form from './form'
import { Modal } from 'antd'
import SharedModal from './SharedModal'

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
                >
                    <Form items={this.props.items || []} ref={frm => this.form = frm} loading={this.props.loading} />
                </Modal>
            </>
        )
    }
}
FormModal.propTypes = {
    trigger: PropTypes.element.isRequired,
    items: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool
}