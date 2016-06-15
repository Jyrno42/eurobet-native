import type { ThunkAction } from './types';

import EurobetSDK from 'EurobetSDK';
import {gettext} from 'i18n';

import {LoginState} from 'EurobetConstants';

import {loadBetsError} from './errors';


export function loadBets(): ThunkAction {
    return (dispatch, getState) => {
        const {user} = getState();

        if (!user.sessionid && user.isLoggedIn !== LoginState.authenticated) {
            console.warn('No session id, skipped refreshing bets');
            return;
        }

        dispatch({
            type: 'LOAD_BETS_START'
        });

        const _prom = EurobetSDK.getBets();

        _prom.then(data => {
            dispatch({
                type: 'LOAD_BETS_COMPLETED',
                data: {
                    ...data
                }
            });
        }, error => {
            if (error.isNetworkError) {
                dispatch(loadBetsError({
                    title: gettext('Refreshing top bets failed'),
                    message: gettext('Internet seems to be down'),
                    reason: 'network-failed'
                }))
            } else {
                // TODO: If unauthorized force reauth?

                // Server error, notify user
                dispatch(loadBetsError({
                    title: gettext('Refreshing top bets failed'),
                    message: gettext('Server error occured, please try again later'),
                    reason: `user-me-${error.statusCode}`
                }));
            }
        });

        return _prom;
    };
}
