import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect, Switch, } from "react-router-dom";
import { inject, observer } from 'mobx-react';
import DocumentTitle from 'react-document-title';
import { Layout, Breadcrumb, Result, Button, Icon } from 'antd';
import TopNavbar from '../shared/_header';
import UserLoginPage from '../user/login';
import UserIndexPage from '../user';
import HousesIndexPage from '../houses'
import BatchIndexPage from '../batch';
import PermitIndexPage from '../permit';
import PermitStatisticPage from '../permit/statistic';
import AppointmentIndexPage from '../appointment';
import MyAppointmentsPage from '../my/appointments';
import MyQuotasPage from '../my/quotas';
import MakeAppointmentPage from '../my/make_appointment';
import UserEditPasswordPage from '../user/edit_password';
import ChooseRoomPage from '../batch/chooseRoom';
import ChooseUserPage from '../batch/choosePermit';
import ChooseResultPage from '../batch/chooseResult';
import HomePage from '../home';
import 'moment/locale/zh-cn'

const { Header, Content, Footer } = Layout;

@inject('stores')
@observer
export default class PrimaryLayout extends Component {
    render() {
        return (
            <DocumentTitle title={this.props.stores.globalStore.title}>
                <Router>
                    <Switch>
                        <PrivateRoute exact path="/" component={HomePage} />
                        <Route exact path="/batch/chooseResult" component={ChooseResultPage} />
                        <Route exact path="/user/login" component={UserLoginPage} />
                        <PrivateRoute exact path="/my/appointments" component={MyAppointmentsPage} />
                        <PrivateRoute exact path="/my/quotas" component={MyQuotasPage} />
                        <PrivateRoute exact path="/appointment/make" component={MakeAppointmentPage} />
                        <PrivateRoute exact path="/houses/index" component={HousesIndexPage} />
                        <PrivateRoute exact path="/batch/chooseRoom" component={ChooseRoomPage} />
                        <PrivateRoute exact path="/batch/choosePermit" component={ChooseUserPage} />
                        <PrivateRoute exact path="/batch/index" component={BatchIndexPage} />
                        <PrivateRoute exact path="/permit/index" component={PermitIndexPage} />
                        <PrivateRoute exact path="/permit/statistic" component={PermitStatisticPage} />
                        <PrivateRoute exact path="/appointment/index" component={AppointmentIndexPage} />
                        <PrivateRoute exact path="/user/index" component={UserIndexPage} />
                        <PrivateRoute exact path="/user/editpassword" component={UserEditPasswordPage} />
                        <Route component={NoMatch} />
                    </Switch>
                </Router >
            </DocumentTitle>
        );
    }
}

@inject('stores')
@observer
class MainLayoutRoute extends Component {
    render() {
        return (
            <Layout hasSider={false}>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <TopNavbar />
                </Header>
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        {(this.props.stores.globalStore.breadcrumb || []).map((name, i) => <Breadcrumb.Item key={i}>{name}</Breadcrumb.Item>)}
                    </Breadcrumb>
                    <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                        <Route {...this.props}></Route>
                    </div>
                </Content>
            </Layout>

        )
    }
}

@inject('stores')
@observer
class PrivateRoute extends Component {
    render() {
        const authenticated = this.props.stores.userStore.authenticated();
        if (!authenticated) {
            const returnUrl = `${this.props.location.pathname}${this.props.location.search}`
            return <Redirect to={`/user/login?returnUrl=${returnUrl}`} />
        }
        return (
            <MainLayoutRoute>
                 <Route {...this.props}></Route>
            </MainLayoutRoute>
        )
    }
}

function NoMatch({ location, history }) {
    return (
        <Result status="404"
            title="页面未找到"
            subTitle={`未能找到路径 ${location.pathname}`}
            extra={<Button size="large" type="primary" onClick={() => {
                history.push("/")
            }} ><Icon type="left" />返回首页</Button>}
        >
        </Result>
    );
}