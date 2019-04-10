import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import stores from './stores';
import PrimaryLayout from './pages/shared/layout';

export default class App extends Component {
    render() {
        return (
            <Provider stores={stores}>
                <PrimaryLayout />
            </Provider>
        );
    }
}


