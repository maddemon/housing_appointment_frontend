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
        data.roomFile = this.state.roomFile;
        data.agreementFile = this.state.agreementFile;

        const result = await this.props.stores.houseStore.save(data);
        if (this.props.onSubmit) {
            this.props.onSubmit(result)
        }
        return result && result.ok;
    }

    handleRoomFileUpload = (file) => {
        this.setState({ roomFile: file })
    }
    handleAgreementFileUpload = (file) => {
        this.setState({ agreementFile: file })
    }

    getFormItems = () => {
        const model = this.props.model || {}
        return [
            { name: 'id', defaultValue: model.id, type: "hidden" },
            { title: '名称', name: 'name', defaultValue: model.name, rules: [{ required: true, message: '此项没有填写' }], },
            { title: '楼盘地址', name: 'address', defaultValue: model.address },
            { name: 'roomFilePath', type: 'hidden' },
            {
                title: '房屋列表',
                name: 'roomfile',
                render:
                    <>
                        <ImportButton
                            name="file"
                            text={this.state.roomFile ? this.state.roomFile.fileName : "请选择房屋表格文件(Excel)"}
                            action="/api/file/upload"
                            accept=".xls,.xlsx"
                            onChange={this.handleRoomFileUpload}
                        />
                        <br />
                        <a href="/templates/楼盘导入模板.xlsx">下载导入模板</a>
                    </>
            },
            { name: 'agreementFilePath', type: 'hidden' },
            {
                title: '购房意向书',
                name: 'agreementfile',
                render:
                    <>
                        <ImportButton
                            name="file"
                            text={this.state.agreementFile ? this.state.agreementFile.fileName : "请选择购房意向书模板(Word)"}
                            action="/api/file/upload"
                            accept=".doc,.docx"
                            onChange={this.handleAgreementFileUpload}
                        />
                    </>
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

