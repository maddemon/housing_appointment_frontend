import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Tooltip, Icon, Row, Col, Input, Upload, Button, DatePicker, Select, Radio, Checkbox, AutoComplete } from 'antd'

class SharedForm extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log(err);
                return false;
            }
            this.props.onSubmit(values);
        })
    }

    controlRender = item => {
        let getField = true
        if (item.getField === false) getField = false
        if (!item.name) getField = false
        if (!item.render) {

            switch (item.type) {
                case "hidden":
                    item.render = <Input type="hidden" />
                    break;
                default:
                case "number":
                case "text":
                    item.render = <Input type={item.type} placeholder={item.placeholder} />
                    break;
                case "textarea":
                    item.render = <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} onChange={item.onChange} placeholder={item.placeholder} />
                    break;
                case "date":
                    item.render = <DatePicker showTime={false} onChange={item.onChange} placeholder={item.placeholder} />
                    break;
                case "datetime":
                    item.render = <DatePicker showTime={true} onChange={item.onChange} placeholder={item.placeholder} />
                    break;
                case "select":
                    item.render = <Select>
                        {item.props.options.map(option => <Select.Option key={option.value}>{option.text}</Select.Option>)}
                    </Select>
                    break;
                case "file":
                    item.render = <Upload {...item.props}>
                        <Button> <Icon type="upload" />{item.text || '点击上传'}</Button>
                    </Upload>
                    break;
            }
        }
        let fieldParameter = {}
        if (item.defaultValue)
            fieldParameter.initialValue = item.defaultValue;
        if (item.rules)
            fieldParameter.rules = item.rules

        return getField ?
            this.props.form.getFieldDecorator(item.name, fieldParameter)(item.render)
            : item.render;
    }

    labelRender = item => {
        if (item.tips) {
            return <Tooltip title={item.tips}><Icon type="question-circle" /> {item.title} </Tooltip>
        }
        return item.title
    }

    render() {
        const items = this.props.items || [];
        const buttons = this.props.buttons || [];
        const style = this.props.style || {}
        const formItemLayout = this.props.itemLayout || {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const layout = this.props.layout || 'horizontal'



        return (
            <Form layout={layout} onSubmit={this.handleSubmit} style={style}>
                {items.map((item, key) =>
                    item.title ?
                        <Form.Item
                            key={item.name || key}
                            label={this.labelRender(item)}
                            extra={item.extra}
                            {...(item.layout ? item.layout : formItemLayout)}
                        >
                            {item.before}
                            {this.controlRender(item)}
                            {item.after}
                        </Form.Item>
                        : <span key={item.name || key}>{item.before} {this.controlRender(item)} {item.after}</span>
                )}
                <Row>
                    <Col span={formItemLayout.labelCol.span}></Col>
                    <Col span={formItemLayout.wrapperCol.span}>
                        {buttons.map((item, key) => <span key={key}> {item} </span>)}
                    </Col>
                </Row>
            </Form>
        )
    }
}
SharedForm.propTypes = {
    items: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
}
export default Form.create()(SharedForm);