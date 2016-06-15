import React, {Component} from 'React';
import {Provider} from 'react-redux';

import configureStore from './store/configureStore';
import EurobetApp from 'EurobetApp';


function setup(): Component {
    // Construct Root component
    class Root extends Component {
        constructor() {
            super();

            this.state = {
                isLoading: true,
                store: configureStore(() => this.setState({isLoading: false}))
            };
        }

        render() {
            if (this.state.isLoading) {
                return null;
            }

            return (
                <Provider store={this.state.store}>
                    <EurobetApp />
                </Provider>
            );
        }
    }

    // Return it
    return Root;
}

export default setup;
