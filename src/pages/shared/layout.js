import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, } from "react-router-dom";
import { inject, observer } from 'mobx-react';
import DocumentTitle from 'react-document-title';
import { Layout, Col, Row } from 'antd';
import TopNavbar from '../shared/_header';
import UserLoginPage from '../user/login';
import UserIndexPage from '../user';
import BatchIndexPage from '../batch';
import QuotaIndexPage from '../quota';
import ReserveIndexPage from '../reserve';
import UserReservesPage from '../user/reserves';
import UserEditPasswordPage from '../user/edit_password';
import HomePage from '../home';
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
                            <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                                <Switch>
                                    <PrivateRoute exact path="/" component={HomePage} />
                                    <PrivateRoute path="/user/reserves" component={UserReservesPage} />
                                    <PrivateRoute path="/batch/index" component={BatchIndexPage} />
                                    <PrivateRoute path="/quota/index" component={QuotaIndexPage} />
                                    <PrivateRoute path="/reserve/index" component={ReserveIndexPage} />
                                    <PrivateRoute path="/user/index" component={UserIndexPage} />
                                    <PrivateRoute path="/user/editpassword" component={UserEditPasswordPage} />
                                    <Route path="/user/login" component={UserLoginPage} />
                                    <Route component={NoMatch} />
                                </Switch>
                            </div>
                        </Content>
                        <Footer></Footer>
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
        const user = this.props.stores.userStore.current;
        if (!user) {
            return <Redirect to="/user/login" />
        }
        console.log(this.props)

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