import React, { Component } from "react";

export default class Drawer extends Component {
  state = { visible: false };
  show = () => this.setState({ visible: true });
  hide = () => {
    this.setState({ visible: false });
    if (this.props.onClose) {
      this.props.onClose();
    }
  };
  render() {
    const { trigger, title, width } = this.props;
    return (
      <>
        {trigger ? <span onClick={this.show}>{trigger}</span> : null}
        <Drawer
          title={title}
          width={width}
          onClose={this.hide}
          visible={this.state.visible}
        >
          {this.props.children}
        </Drawer>
      </>
    );
  }
}
