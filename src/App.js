import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider, inject, observer } from 'mobx-react';
import DocumentTitle from 'react-document-title';
import { Layout } from 'antd'
import stores from './stores/index';
import Header from './pages/shared/_header';
import UserLoginPage from './pages/user/login';
import UserIndexPage from './pages/user/index';
import MyQuotasPage from './pages/my/quotas';
import MyReservesPage from './pages/my/reserves';

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
        const user = this.props.stores.userStore.current;
        return (
            <Router>
                <DocumentTitle title={this.props.stores.globalStore.title}>
                    <Layout>
                        <Header />
                        <Route exact path="/" component={MyQuotasPage} />
                        <Route exact path="/user/login" componment={UserLoginPage} />
                        <Route exact path="/my/quotas" componment={MyQuotasPage} />
                        <Route exact path="/my/reserves" componment={MyReservesPage} />
                        <Route exact path="/user/index" component={UserIndexPage} />
                    </Layout>
                </DocumentTitle>
            </Router>
        );
    }
}
