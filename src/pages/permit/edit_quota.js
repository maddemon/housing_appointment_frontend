import React, { Component } from 'react'
import { Button, message, Modal } from 'antd'
import FormModal from '../shared/modal'
import { inject, observer } from 'mobx-react'

@inject('stores')
@observer
export default class EditQuotaModal extends Component {
    modal = null;


    handleSaveSubmit = async (data) => {
        const response = await this.props.stores.quotaStore.save(data);
        if (response && response.ok) {
            message.success(data.id ? "修改完成" : "发证完成");
            if (this.props.onSubmit) {
                this.props.onSubmit()
            }
            return true;
        }
        return false;
    }

    handleSaveClick = () => {
        this.modal.handleSubmit()
    }

    handleDeleteClick = () => {
        const model = this.props.model || {}
        Modal.confirm({
            title: "你确定要删除此购房资格吗？",
            content: "本次操作将删除该用的购房资格，请确保操作无误！",
            onOk: async () => {
                const response = await this.props.stores.quotaStore.delete(model.id)
                if (response && response.ok) {
                    message.success("删除完成");
                    this.modal.hideModal();
                    if (this.props.onDelete) {
                        this.props.onDelete();
                    }
                }
            },
        })
    }

    handleCancelClick = () => {
        this.modal.hideModal();
    }

    getFormItems = () => {
        const model = this.props.model || {}
        return [
            { name: 'id', defaultValue: model.id, type: "hidden" },
            { name: 'userID', defaultValue: model.userID, type: "hidden" },
            { name: 'permitCode', defaultValue: model.permitCode, type: "hidden" },
            { name: 'quotaCode', title: "购房证号", defaultValue: model.quotaCode, rules: [{ required: true, message: '此项没有填写' }], },
            { name: 'user', title: "姓名", defaultValue: model.user, rules: [{ required: true, message: '此项没有填写' }], },
            { name: 'idCard', title: "证件号码", defaultValue: model.idCard, rules: [{ required: true, message: '此项没有填写' }], },
            { name: 'phone', title: "手机号", defaultValue: model.phone, rules: [{ required: true, message: '此项没有填写' }], }
        ]
    }

    getFooterButtons = () => {
        const model = this.props.model || {}
        let result = [];
        if (model.id) {
            result.push(<Button key="btn-delete" onClick={this.handleDeleteClick} type="danger">删除</Button>)
        }
        result.push(<Button key="btn-cancel" onClick={this.handleCancelClick}>取消</Button>)
        result.push(<Button key="btn-submit" type="primary" onClick={this.handleSaveClick}>提交</Button>)
    }

    render() {

        return (
            <FormModal
                ref={frm => this.modal = frm}
                title={this.props.title || '发证'}
                onSubmit={this.handleSaveSubmit}
                trigger={this.props.trigger || <Button>发证</Button>}
                items={this.getFormItems()}
                loading={this.props.stores.houseStore.loading}
                footer={this.getFooterButtons()}
            >
            </FormModal>
        )
    }
}
