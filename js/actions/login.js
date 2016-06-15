/**
 * @flow
 */

import ActionSheetIOS from 'ActionSheetIOS';
import Alert from 'Alert';
import Platform from 'Platform';

import type { ThunkAction } from './types';

import EurobetSDK from 'EurobetSDK';
import {gettext} from 'i18n';

import {getUserStateError, loginError} from './errors';


function getUserState(options): ThunkAction {
    const { silent } = options || {
        silent: false
    };

    return (dispatch, getState) => {
        const {user} = getState();

        const logState = EurobetSDK.getUserState(user.sessionId);

        logState.then(response => {
            dispatch({
                type: 'GOT_USER_DATA',
                data: {
                    user: response
                }
            });
        }, error => {
            if (error.isNetworkError) {
                dispatch(getUserStateError({
                    silent: silent,
                    title: gettext('Refreshing session token failed'),
                    message: gettext('Internet seems to be down'),
                    reason: 'network-failed'
                }, {
                    type: user.sessionId ? 'SKIP_LOGIN' : 'LOGGED_OUT'
                }));
            } else {
                if (error.isInvalidResponseCode) {
                    // We must be logged out
                    if (error.statusCode === 403) {
                        dispatch({
                            type: 'LOGGED_OUT',
                            data: {
                                reason: `user-me-${error.statusCode}`
                            }
                        });
                    } else {
                        // Server error, notify user
                        dispatch(getUserStateError({
                            silent: silent,
                            title: gettext('Refreshing session token failed'),
                            message: gettext('Server error occured, please try again later'),
                            reason: `user-me-${error.statusCode}`
                        }, {
                            type: user.sessionId ? 'SKIP_LOGIN' : 'LOGGED_OUT'
                        }));
                    }
                } else {
                    console.warn(error);
                    throw new Error('This should actually never happen');
                }
            }
        });

        return logState;
    };
}

function login(email, password): ThunkAction {
    return (dispatch) => {
        const _doLogin = EurobetSDK.login(email, password);

        _doLogin.then(sessionId => {
            dispatch({
                type: 'LOGGED_IN',
                data: {
                    user: {
                        // Note: we should use a more solid api here
                        sessionId
                    }
                }
            });
        }, error => {
            if (error.isNetworkError) {
                dispatch(loginError({
                    title: gettext('Something went wrong'),
                    message: gettext('Internet seems to be down'),
                    reason: 'network-failed'
                }));

            } else if (error.isValidationError) {
                dispatch(loginError({
                    title: gettext('Login failed'),
                    message: error.firstError(),
                    reason: 'login-failed'
                }));

            } else if (error.isInvalidResponseCode) {
                // Server error, notify user
                dispatch(loginError({
                    title: gettext('Something went wrong'),
                    message: gettext('Server error occured, please try again later'),
                    reason: `user-login-${error.statusCode}`
                }));
            } else {
                console.warn(error);
                throw new Error('This should actually never happen');
            }
        });

        return _doLogin;
    };
}


function dologOut(): ThunkAction {
    return (dispatch) => {
        EurobetSDK.logout();

        // Notify all stores
        return dispatch({
            type: 'LOGGED_OUT'
        });
    };
}

function logOut(): ThunkAction {
    return (dispatch, getState) => {
        let name = getState().user.name || gettext('there');

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    title: gettext('Hi, %s').replace('%s', name),
                    options: [gettext('Log out'), gettext('Cancel')],  // TODO: If ios >= 10, flip the order of buttons
                    destructiveButtonIndex: 0,
                    cancelButtonIndex: 1
                },
                (buttonIndex) => {
                    if (buttonIndex === 0) {
                        dispatch(dologOut());
                    }
                }
            );
        } else {
            Alert.alert(
                gettext('Hi, %s').replace('%s', name),
                gettext('Log out from Eurobet?'),
                [
                    { text: gettext('Cancel') },
                    { text: gettext('Log out'), onPress: () => dispatch(dologOut()) }
                ]
            );
        }
    };
}

export default {
    getUserState,
    login,
    logOut
};
