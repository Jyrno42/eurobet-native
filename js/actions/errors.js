import ActionSheetIOS from 'ActionSheetIOS';
import Alert from 'Alert';
import Platform from 'Platform';
import ToastAndroid from 'ToastAndroid';

import {gettext} from 'i18n';


export function showError(error, ...actions) {
    const errorTitle = error.title || gettext('Something went wrong');
    const errorMessage = error.message || gettext('Please try again');

    if (!error.silent) {
        if (Platform.OS === 'ios') {
            Alert.alert(
                errorTitle,
                errorMessage,
                [
                    {text: gettext('OK')}
                ]
            );
        } else {
            ToastAndroid.show(`${errorTitle}. ${errorMessage}`, ToastAndroid.SHORT);
        }
    }

    return actions;
}

export function loadBetsError(error, ...actions) {
    return showError(error, {
        type: 'LOAD_BETS_FAILED',
        data: {
            error
        }
    }, ...actions);

}

export function loginError(error, ...actions) {
    return showError(error, {
        type: 'LOGIN_FAILED',
        data: {
            error
        }
    }, ...actions);
}

export function getUserStateError(error, ...actions) {
    return showError(error, {
        type: 'USER_STATE_CHECK_FAILED',
        data: {
            error
        }
    }, ...actions);
}
