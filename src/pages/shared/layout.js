import React, { Component } from "react";
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { inject, observer } from "mobx-react";
import DocumentTitle from "react-document-title";
import { Layout, Breadcrumb, Result, Button, Icon } from "antd";
import TopNavbar from "../shared/_header";
import LoginPage from "../user/login";
import UserIndexPage from "../user";
import HousesIndexPage from "../house";
import HouseDetailPage from "../house/detail";
import BatchIndexPage from "../batch";
import PermitIndexPage from "../permit";
import PermitStatisticPage from "../permit/statistic";
import MyBatchPage from "../my/batch";
import MyAppointmentPage from "../my/appointment";
import MyPermitPage from "../my/permit";
import MyHistoryPage from "../my/history";
import UserEditPasswordPage from "../user/edit_password";
import ChooseUserPage from "../batch/choosePermit";
import SchedulePage from "../batch/schedule";
import BatchChooseResultPage from "../batch/result";
import BatchRoomListPage from "../batch/rooms";
import HomePage from "../home";
import "moment/locale/zh-cn";

const { Header, Content } = Layout;

@inject("stores")
@observer
export default class PrimaryLayout extends Component {
  render() {
    return (
      <DocumentTitle title={this.props.stores.globalStore.title}>
        <Router>
          <Switch>
            <PrivateRoute exact path="/" component={HomePage} />
            <Route exact path="/user/login" component={LoginPage} />
            <Route
              exact
              path="/batch/result"
              component={BatchChooseResultPage}
            />
            <Route exact path="/batch/rooms" component={BatchRoomListPage} />
            <PrivateRoute exact path="/my/history" component={MyHistoryPage} />
            <PrivateRoute exact path="/my/permit" component={MyPermitPage} />
            <PrivateRoute exact path="/my/batch" component={MyBatchPage} />
            <PrivateRoute
              exact
              path="/my/appointment"
              component={MyAppointmentPage}
            />
            <PrivateRoute
              exact
              path="/house/index"
              component={HousesIndexPage}
            />
            <PrivateRoute
              exact
              path="/house/detail"
              component={HouseDetailPage}
            />
            <PrivateRoute
              exact
              path="/batch/choosePermit"
              component={ChooseUserPage}
            />
            <PrivateRoute
              exact
              path="/batch/schedule"
              component={SchedulePage}
            />
            <PrivateRoute
              exact
              path="/batch/index"
              component={BatchIndexPage}
            />
            <PrivateRoute
              exact
              path="/permit/index"
              component={PermitIndexPage}
            />
            <PrivateRoute
              exact
              path="/permit/statistic"
              component={PermitStatisticPage}
            />
            
            <PrivateRoute exact path="/user/index" component={UserIndexPage} />
            <PrivateRoute
              exact
              path="/user/editpassword"
              component={UserEditPasswordPage}
            />
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </DocumentTitle>
    );
  }
}

@inject("stores")
@observer
class AdminLayout extends Component {
  render() {
    return (
      <Layout hasSider={false}>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <TopNavbar />
        </Header>
        <Content style={{ padding: "0 50px", marginTop: 64 }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            {(this.props.stores.globalStore.breadcrumb || []).map((name, i) => (
              <Breadcrumb.Item key={i}>{name}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
            <Route {...this.props}></Route>
          </div>
        </Content>
      </Layout>
    );
  }
}

@observer
class UserLayout extends Component {
  render() {
    return (
      <Layout hasSider={false}>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <TopNavbar />
        </Header>
        <Content style={{ padding: "0 5px", marginTop: 64 }}>
          <Route {...this.props}></Route>
        </Content>
      </Layout>
    );
  }
}

@inject("stores")
@observer
class PrivateRoute extends Component {
  render() {
    const user = this.props.stores.userStore.current();
    if (!user) {
      const returnUrl = `${this.props.location.pathname}${this.props.location.search}`;
      return <Redirect to={`/user/login?returnUrl=${returnUrl}`} />;
    }
    if (user.role === "user") {
      return (
        <UserLayout>
          <Route {...this.props}></Route>
        </UserLayout>
      );
    }
    return (
      <AdminLayout>
        <Route {...this.props}></Route>
      </AdminLayout>
    );
  }
}

function NoMatch({ location, history }) {
  return (
    <Result
      status="404"
      title="页面未找到"
      subTitle={`未能找到路径 ${location.pathname}`}
      extra={
        <Button
          size="large"
          type="primary"
          onClick={() => {
            history.push("/");
          }}
        >
          <Icon type="left" />
          返回首页
        </Button>
      }
    ></Result>
  );
}