import {REHYDRATE} from 'redux-persist/constants';

import type {Action} from '../actions/types';

import {LoginState} from 'EurobetConstants';


export type State = {
    isLoggedIn: number;
    sessionId: ?string;
    id: ?string;
    email: ?string;
    name: ?string;
};

const initialState: State = {
    isLoggedIn: LoginState.unknown,
    sessionId: null,
    id: null,
    email: null,
    name: null
};


export default function user(state: State = initialState, action: Action) {
    switch (action.type) {
        case REHYDRATE:
            if (action.payload.user) {
                // Let the splash screen handle login state, e.g. ignore isLoggedIn coming from persistance
                return {
                    ...state,
                    ...action.payload.user,
                    isLoggedIn: LoginState.unknown
                };
            }

            return state;

        case 'LOGIN_FAILED':
            return {
                ...state,

                isLoggedIn: LoginState.error
            };

        case 'SKIP_LOGIN':
            return {
                ...state,

                isLoggedIn: LoginState.authenticated
            };

        case 'LOGGED_OUT':
            return {
                ...initialState,

                isLoggedIn: LoginState.anonymous
            };

        case 'LOGGED_IN':
            let {sessionId} = action.data.user;

            return {
                ...state,

                isLoggedIn: LoginState.authenticated,
                sessionId
            };

        case 'GOT_USER_DATA':
            let {id, name, email} = action.data.user;

            return {
                ...state,
                isLoggedIn: LoginState.authenticated,
                id,
                name,
                email
            };

        default:
            return state;
    }
}
