import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import stores from './stores';
import PrimaryLayout from './pages/shared/layout';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd'

export default class App extends Component {
    render() {
        return (
            <Provider stores={stores}>
                <LocaleProvider locale={zhCN}>
                    <PrimaryLayout />
                </LocaleProvider>
            </Provider>
        );
    }
}


