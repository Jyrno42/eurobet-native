import AsyncStorage from 'AsyncStorage';

import {applyMiddleware, createStore} from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist';
import CookieManager from 'react-native-cookies';

import reducers from '../reducers';

import promise from './promise';
import array from './array';


const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

// Setup logger
const logger = createLogger({
    predicate: (getState, action) => isDebuggingInChrome,
    collapsed: true,
    duration: true
});

// Setup our store with middlewares
const createEuroBetStore = applyMiddleware(thunk, promise, array, logger)(createStore);


function configureStore(onComplete: ?() => void) {
    // Create store and auto-rehydrate it if needed
    const store = autoRehydrate()(createEuroBetStore)(reducers);

    // Persist the store via `redux-persist` (persistance.purgeAll to clear)
    const persistance = persistStore(store, {
        storage: AsyncStorage,
        blacklist: ['navigationState']
    }, () => {
        // Clear all cookies since we manage them ourselves
        CookieManager.clearAll(() => {
            if (onComplete) {
                onComplete();
            }
        });
    });

    // Export store globally if debugging via chrome
    if (isDebuggingInChrome) {
        window.store = store;
    }

    return store;
}

module.exports = configureStore;
