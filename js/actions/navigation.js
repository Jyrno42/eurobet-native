/**
 * @flow
 */

export function navigatePush(target) {
    if (typeof target === 'string') {
        target = {
            key: target, 
            title: target 
        };
    }

    return {
        type: 'LOCATION_PUSH',
        target
    };
}

export function navigatePop() {
    return {
        type: 'LOCATION_POP'
    };
}


export function navigateReset() {
    return {
        type: 'LOCATION_RESET'
    };
}


export function hideSplashScreen() {
    return {
        type: 'HIDE_SPLASH_SCREEN'
    };
}
