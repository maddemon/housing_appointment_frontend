import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect, Switch, } from "react-router-dom";
import { inject, observer } from 'mobx-react';
import DocumentTitle from 'react-document-title';
import { Layout, Breadcrumb } from 'antd';
import TopNavbar from '../shared/_header';
import UserLoginPage from '../user/login';
import UserIndexPage from '../user';
import HousesIndexPage from '../houses'
import BatchIndexPage from '../batch';
import PermitIndexPage from '../permit';
import QuotaIndexPage from '../quota';
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
                <Layout hasSider={false}>
                    <Router>
                        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                            <TopNavbar />
                        </Header>
                        <Content style={{ padding: '0 50px', marginTop: 64 }}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                {(this.props.stores.globalStore.breadcrumb || []).map((name, i) => <Breadcrumb.Item key={i}>{name}</Breadcrumb.Item>)}
                            </Breadcrumb>
                            <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                                <Switch>
                                    <Route exact path="/" component={HomePage} />
                                    <PrivateRoute exact path="/my/appointments" component={MyAppointmentsPage} />
                                    <PrivateRoute exact path="/my/quotas" component={MyQuotasPage} />
                                    <PrivateRoute exact path="/appointment/make" component={MakeAppointmentPage} />
                                    <PrivateRoute exact path="/houses/index" component={HousesIndexPage} />
                                    <PrivateRoute exact path="/batch/chooseRoom" component={ChooseRoomPage} />
                                    <PrivateRoute exact path="/batch/choosePermit" component={ChooseUserPage} />
                                    <PrivateRoute exact path="/batch/chooseResult" component={ChooseResultPage} />
                                    <PrivateRoute exact path="/batch/index" component={BatchIndexPage} />
                                    <PrivateRoute exact path="/permit/index" component={PermitIndexPage} />
                                    <PrivateRoute exact path="/appointment/index" component={AppointmentIndexPage} />
                                    <PrivateRoute exact path="/user/index" component={UserIndexPage} />
                                    <PrivateRoute exact path="/user/editpassword" component={UserEditPasswordPage} />
                                    <Route exact path="/user/login" component={UserLoginPage} />
                                    <Route component={NoMatch} />
                                </Switch>
                            </div>
                        </Content>
                        <Footer>
                            &copy;2019
                        </Footer>
                    </Router >
                </Layout>
            </DocumentTitle>
        );
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
            <Route {...this.props}></Route>
        )
    }
}

function NoMatch({ location }) {
    return (
        <div>
            <h1>404</h1>
            <h3>
                未能找到路径 <code>{location.pathname}</code>
            </h3>
        </div>
    );
}