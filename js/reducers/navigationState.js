import * as NavigationStateUtils from 'NavigationStateUtils';


export type NavigationRoute = {
    key: string;
    title: ?string;
};

export type NavigationState = {
    index: number;
    routes: Array<NavigationRoute>;
};

const NavigationInitialState: NavigationState = {
    index: 0,
    routes: [
        { key: 'splash' }
    ]
};


export default function navigationState(state = NavigationInitialState, action) {
    switch (action.type) {
        case 'LOCATION_PUSH':
            if (state.routes[state.index].key === (action.target && action.target.key)) {
                return state;
            }

            return NavigationStateUtils.push(state, action.target);

        case 'LOCATION_POP':
            if (state.index === 0 || state.routes.length === 1) {
                return state;
            }

            // Don't allow to go back to splash-screen via back button
            if (state.routes[state.index - 1] && state.routes[state.index - 1].key === 'splash-fake') {
                return state;
            }

            return NavigationStateUtils.pop(state);

        case 'LOCATION_RESET':
            return {
                ...NavigationInitialState
            };

        case 'HIDE_SPLASH_SCREEN':
            return {
                index: 1,
                routes: [
                    { key: 'splash-fake' },
                    { key: 'bets' }
                ]
            };

        default:
            return state;
    }
}
