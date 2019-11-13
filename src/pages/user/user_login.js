import React, { Component } from "react";
import { Icon, Button, Row, Col, Tabs, Input, message } from "antd";
import { inject, observer } from "mobx-react";
import { QueryString } from "../../common/utils";
import ShareForm from "../shared/form";
import LoginLogo from "./_login_logo";

@inject("stores")
@observer
export default class UserLoginPage extends Component {
  state = { name: null, getTimes: 0, seconds: 0 };

  componentWillMount() {
    this.props.stores.globalStore.setTitle("用户登录");
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  updateSeconds = () => {
    if (this.state.seconds < 1) {
      clearInterval(this.state.timer);
      this.setState({ seconds: 0, timer: null });
    } else {
      const seconds = this.state.seconds - 1;
      this.setState({ seconds });
    }
  };

  handleVerifyCodeClick = async () => {
    if (!this.state.name) {
      message.error("没有填写证件号码");
      return false;
    }

    const response = await this.props.stores.messageStore.sendVerifyCodeMessage(
      this.state.name
    );
    if (response && response.ok) {
      message.success(
        `短信验证码已发送至${response.data.phone}手机号码中，请注意查收`
      );
    }
    const getTimes = this.state.getTimes + 1;
    this.setState({ seconds: 60, getTimes: getTimes });
    const timer = setInterval(this.updateSeconds, 1000);
    this.setState({ timer });
  };

  handleSubmit = async formData => {
    const response = await this.props.stores.userStore.login(formData);
    if (response && response.ok) {
      const query = QueryString.parseJSON(this.props.location.seach);
      this.props.history.push(query.returnUrl || "/");
    }
  };

  getVerifyCodeButtonText = () => {
    if (this.state.getTimes > 0) {
      if (this.state.seconds > 0) {
        return `${this.state.seconds}秒后重新获取`;
      } else {
        return `重新获取手机验证码`;
      }
    }
    return "点击获取手机验证码";
  };

  handleNameChange = e => {
    this.setState({ name: e.target.value });
  };

  render() {
    return (
      <div className="container login-page">
        <LoginLogo />
        <Row className="login">
          <Col
            xs={{ span: 20, offset: 2 }}
            sm={{ span: 16, offset: 4 }}
            md={{ span: 12, offset: 6 }}
            lg={{ span: 6, offset: 9 }}
            xl={{ span: 4, offset: 10 }}
          >
            <Tabs animated={false}>
              <Tabs.TabPane tab="用户登录" key="member">
                <ShareForm
                  loading={this.props.stores.userStore.loading}
                  onSubmit={this.handleSubmit}
                  items={[
                    {
                      name: "name",
                      rules: [{ required: true, message: "此项没有填写" }],
                      render: (
                        <Input
                          size="large"
                          placeholder="身份证件号码"
                          onChange={this.handleNameChange}
                        />
                      )
                    },
                    {
                      render: (
                        <Button
                          size="large"
                          type="primary"
                          block
                          onClick={this.handleVerifyCodeClick}
                          disabled={this.state.seconds > 0}
                        >
                          {this.getVerifyCodeButtonText()}
                        </Button>
                      )
                    },
                    {
                      name: "code",
                      rules: [{ required: true, message: "此项没有填写" }],
                      render: <Input size="large" placeholder="手机验证码" />
                    }
                  ]}
                  buttons={[
                    <Button
                      size="large"
                      loading={this.props.stores.userStore.loading}
                      type="primary"
                      htmlType="submit"
                      block
                    >
                      <Icon type="login" />
                      登录
                    </Button>
                  ]}
                />
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}
