import React from 'react'
import PropTypes from 'prop-types'
import Form from './form'
import ModalBase from './_modal'

export default class FormModal extends ModalBase {

    form = null;
    
    handleSubmit = () => {
        this.form.validateFields(async (err, values) => {
            if (err) {
                return false;
            }
            else {
                const result = await this.props.onSubmit(values)
                if (result !== false) {
                    this.hideModal();
                    this.form.resetFields();
                }
            }
        })
    }

    renderBody = () => {
        return <Form items={this.props.items || []} ref={frm => this.form = frm} loading={this.props.loading} />
    }
}
FormModal.propTypes = {
    trigger: PropTypes.element,
    items: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool
}