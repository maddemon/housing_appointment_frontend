import React, { Component } from 'react'
import { Button } from 'antd'
import Modal from '../shared/modal'
import { inject, observer } from 'mobx-react'
import ImportButton from '../shared/import_button'

@inject('stores')
@observer
export default class HouseEditModal extends Component {
    state = { uploading: false }
    handleSubmit = async (data) => {
        const result = await this.props.stores.houseStore.save(data);
        if (this.props.onSubmit) {
            this.props.onSubmit(result)
        }
        return result && result.ok;
    }

    handleUpload = (file) => {
        this.setState({ file })
    }

    getFormItems = () => {
        const model = this.props.model || {}
        return [
            { name: 'id', defaultValue: model.id, type: "hidden" },
            { title: '名称', name: 'name', defaultValue: model.name, rules: [{ required: true, message: '此项没有填写' }], },
            { title: '楼盘地址', name: 'address', defaultValue: model.address },
            { name: 'filePath', type: 'hidden', defaultValue: model.filePath },
            {
                title: '房屋列表',
                name: 'file',
                render: <ImportButton
                    name="file"
                    text={this.state.file ? this.state.file.fileName : "请选择房屋表格文件(Excel)"}
                    action="/api/file/upload"
                    accept=".xls,.xlsx"
                    onChange={this.handleUpload}
                />
            }
        ];
    }

    render() {
        return (
            <Modal
                title={this.props.title || '修改楼盘'}
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger || <Button>修改</Button>}
                items={this.getFormItems()}
                loading={this.props.stores.houseStore.loading}
            >
            </Modal>
        )
    }
}

