/**
 * @providesModule EurobetNavigator
 * @flow
 */

import React, {Component, PropTypes} from 'React';
import BackAndroid from 'BackAndroid';
import {NavigationCardStack} from 'NavigationExperimental';
import StyleSheet from 'StyleSheet';
import Platform from 'Platform';


import EurobetSplashScreen from 'EurobetSplashScreen';
import EurobetTopBets from 'EurobetTopBets';


class EurobetNavigator extends Component {
    static childContextTypes = {
        addBackButtonListener: PropTypes.func,
        removeBackButtonListener: PropTypes.func
    };

    _handlers = ([]: Array<() => boolean>);

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    getChildContext() {
        return {
            addBackButtonListener: this.addBackButtonListener,
            removeBackButtonListener: this.removeBackButtonListener
        };
    }

    addBackButtonListener = (listener) => {
        this._handlers.push(listener);
    };

    removeBackButtonListener = (listener) => {
        this._handlers = this._handlers.filter((handler) => handler !== listener);
    };

    handleBackButton = () => {
        for (let i = this._handlers.length - 1; i >= 0; i--) {
            if (this._handlers[i]()) {
                return true;
            }
        }

        const {navigator} = this.refs;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop();
            return true;
        }

        return false;
    };

    renderScene = (route, navigator) => {
        if (route.bets) {
            return (
                <EurobetTopBets navigator={navigator} />
            );
        }

        return <EurobetSplashScreen navigator={navigator} />;
    };

    configureScene = (route) => {
        return Navigator.SceneConfigs.VerticalUpSwipeJump;
    };

    render() {
        const navigationState = ();
        
        return (
            <NavigationTransitioner
                ref="navigator"
                style={styles.container}
                navigationState={navigationState}

                initialRoute={{}}
                renderScene={this.renderScene}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2f4154'
    }
});


export default EurobetNavigator;
