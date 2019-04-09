import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { Provider, inject, observer } from 'mobx-react';
import DocumentTitle from 'react-document-title';
import { Layout, Col, Row } from 'antd';
import stores from './stores';
import Header from './pages/shared/_header';
import UserLoginPage from './pages/user/login';
import UserIndexPage from './pages/user';
import BatchIndexPage from './pages/batch';
import QuotaIndexPage from './pages/quota';
import ReserveIndexPage from './pages/reserve';
import UserQuotasPage from './pages/user/quotas';
import UserReservesPage from './pages/user/reserves';
import UserEditPasswordPage from './pages/user/edit_password';
import HomePage from './pages/home';

@observer
export default class App extends Component {
    render() {
        return (
            <Provider stores={stores}>
                <PageRouter />
            </Provider>
        );
    }
}

@inject('stores')
@observer
class PageRouter extends Component {
    render() {
        return (
            <DocumentTitle title={this.props.stores.globalStore.title}>
                <Layout>
                    <Row>
                        <Col xxl={4} xl={2} lg={0} md={0} sm={0} xs={0}> </Col>
                        <Col xxl={16} xl={20}>
                            <Router>
                                <Header />
                                <Switch>
                                    <PrivateRoute exact path="/" component={HomePage} />

                                    <PrivateRoute exact path="/user/quotas" component={UserQuotasPage} />

                                    <PrivateRoute path="/user/reserves" component={UserReservesPage} />

                                    <PrivateRoute path="/batch/index" component={BatchIndexPage} />

                                    <PrivateRoute path="/quota/index" component={QuotaIndexPage} />

                                    <PrivateRoute path="/reserve/index" component={ReserveIndexPage} />

                                    <PrivateRoute path="/user/index" component={UserIndexPage} />

                                    <PrivateRoute path="/user/editpassword" component={UserEditPasswordPage} />

                                    <Route path="/user/login" component={UserLoginPage} />
                                    <Route component={NoMatch} />
                                </Switch>
                            </Router >
                        </Col>
                        <Col xxl={4} xl={2} lg={0} md={0} sm={0} xs={0}> </Col>
                    </Row>
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
