/**
 * @providesModule EurobetApp
 * @flow
 */

import React, { Component, PropTypes } from 'React';

import AppState from 'AppState';
import BackAndroid from 'BackAndroid';
import View from 'View';
import StyleSheet from 'StyleSheet';

import NavigationCard from 'NavigationCard';
import NavigationTransitioner from 'NavigationTransitioner';

import { connect } from 'react-redux';

import AnimatedScene from 'AnimatedScene';

import EurobetTopBets from 'EurobetTopBets';
import EurobetSplashScreen from 'EurobetSplashScreen';

import {Colors} from 'EurobetConstants';

import { getUserState, loadBets, navigatePop } from './actions';


class EurobetApp extends Component {
    static propTypes = {
        navigationState: PropTypes.object.isRequired,
        onNavigate: PropTypes.func.isRequired,
        getUserState: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.getUserState();

        BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
        AppState.addEventListener('change', this.handleAppStateChange);

    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);

        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleBackButton = () => {
        return this.props.onNavigate({type: 'back'});
    };

    handleAppStateChange = (appState) => {
        // If app becomes active, reload some things
        if (appState === 'active') {
             this.props.loadBets();
        }
    };

    _renderScene = ({scene}) => {
        const { route } = scene;

        switch(route.key) {
            case 'bets':
                return (
                    <EurobetTopBets />
                );

            case 'splash':
                return (
                    <EurobetSplashScreen />
                );

            case 'fake-splash':
                return (
                    <View />
                );
        }
    };

    render() {
        const {navigationState, onNavigate} = this.props;

        return (
            <NavigationTransitioner
                style={styles.outerContainer}
                navigationState={navigationState}
                onNavigate={onNavigate}
                renderScene={props => (
                    <AnimatedScene
                        {...props}

                        renderScene={this._renderScene}
                        key={props.scene.route.key}
                    />
                )}
            />
        );
    }
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: Colors.PrimaryDark
    },
    scene: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.4,
        shadowRadius: 10
    }
});

export default connect(
    state => ({
        navigationState: state.navigationState
    }),
    {
        getUserState,
        loadBets,
        onNavigate: (action) => {
            if (action.type === 'back' || action.type === 'BackAction') {
                return navigatePop();
            }
        }

    }
)(EurobetApp);
