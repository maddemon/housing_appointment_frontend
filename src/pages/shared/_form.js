import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Tooltip, Icon, Row, Col } from 'antd'

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
        const children = this.props.children || [];
        const buttons = this.props.buttons || [];
        const style = this.props.style || {}
        const formItemLayout = this.props.itemLayout || {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const layout = this.props.layout || 'horizontal'



        return (
            <Form layout={layout} onSubmit={this.handleSubmit} style={style}>
                {children.map((item, key) =>
                    item.title ?
                        <Form.Item
                            key={item.name || key}
                            label={this.labelRender(item)}
                            extra={item.extra}
                            {...(item.layout ? item.layout : formItemLayout) }
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
    children: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
}
export default Form.create()(SharedForm);