import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Row, Col, Menu, Icon, Popover } from "antd";
import Config from "../../common/config";
import EditPasswordModal from "../user/edit_password";

const { SubMenu } = Menu;

@inject("stores")
@observer
class TopNavbar extends Component {
  state = { current: [this.props.location.pathname], editpw_visible: false };

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.state.current[0]) {
      this.setState({ current: [nextProps.location.pathname] });
    }
  }

  handleMenuClick = async menu => {
    if (menu.key === "/user/logout") {
      await this.props.stores.userStore.logout();
      await this.props.history.push("/user/login");
    } else if (menu.key === "edit_password") {
      this.setState({ editpw_visible: !this.state.editpw_visible });
    } else {
      this.props.history.push(menu.key);
    }
  };

  getMenuItems = identity => {
    let result = [
      // <Menu.Item key="/" ><Icon type="home" />首页</Menu.Item>,
    ];
    if (identity) {
      switch (identity.role) {
        case "user":
          result = result.concat([
            <Menu.Item key="/my/batch">
              <Icon type="form" />
              预约选房
            </Menu.Item>,
            <Menu.Item key="/my/permit">
              <Icon type="book" />
              我的购房证
            </Menu.Item>,
            <Menu.Item key="/my/history">
              <Icon type="calendar" />
              预约记录
            </Menu.Item>
          ]);
          break;
        case "admin":
          result = result.concat([
            <Menu.Item key="/batch/index">
              <Icon type="import" />
              批次管理
            </Menu.Item>,
            <Menu.Item key="/house/index">
              <Icon type="build" />
              楼盘管理
            </Menu.Item>,
            <Menu.Item key="/permit/index">
              <Icon type="switcher" />
              准购证管理{" "}
            </Menu.Item>,
            <Menu.Item key="/user/index">
              <Icon type="usergroup-add" />
              用户管理
            </Menu.Item>
          ]);
          break;
        case "jiansheju":
          result = result.concat([
            <Menu.Item key="/permit/statistic">
              <Icon type="bar-chart" />
              发证情况
            </Menu.Item>
          ]);
          break;
        default:
          break;
      }
      if (identity.role === "user") {
        result.push(
          <Menu.Item key="edit_password">
            {" "}
            <Icon type="key" /> 修改密码{" "}
          </Menu.Item>
        );
        result.push(
          <Menu.Item key="/user/logout">
            {" "}
            <Icon type="poweroff" /> 退出{" "}
          </Menu.Item>
        );
      } else {
        result.push(
          <SubMenu
            key="user_menu"
            title={
              <>
                <Icon type="user" /> {identity.name} <Icon type="caret-down" />
              </>
            }
          >
            <Menu.Item key="edit_password">
              {" "}
              <Icon type="key" /> 修改密码{" "}
            </Menu.Item>
            <Menu.Item key="/user/logout">
              {" "}
              <Icon type="poweroff" /> 退出{" "}
            </Menu.Item>
          </SubMenu>
        );
      }
    } else {
      result = result.concat([
        <Menu.Item key="/user/login">
          <Icon type="login" /> 登录
        </Menu.Item>
      ]);
    }
    return result;
  };

  render() {
    const identity = this.props.stores.userStore.current();
    const theme = "dark";
    return (
      <>
        <Popover
          placement="bottomRight"
          trigger="click"
          content={
            <Menu
              onClick={this.handleMenuClick}
              mode="vertical"
              selectedKeys={this.state.current}
              theme={"light"}
              style={{ width: 256, borderRight: "none" }}
            >
              {this.getMenuItems(identity)}
            </Menu>
          }
        >
          <Icon type="menu" className="nav-phone-icon" />
        </Popover>
        <Row key="menu">
          <Col xs={24} sm={24} md={5} lg={5} xl={5} xxl={4} className="logo">
            <Link to="/">
              <h1 style={{ lineHeight: "64px", color: "#fff" }}>
                {Config.SystemName}
              </h1>
            </Link>
          </Col>
          <Col xs={0} sm={0} md={19} log={19} xl={19} xxl={20}>
            <Menu
              onClick={this.handleMenuClick}
              mode="horizontal"
              selectedKeys={this.state.current}
              theme={theme}
              style={{ lineHeight: "64px" }}
            >
              {this.getMenuItems(identity)}
            </Menu>
          </Col>
        </Row>
        <EditPasswordModal key="modal" visible={this.state.editpw_visible} />
      </>
    );
  }
}

export default withRouter(TopNavbar);
