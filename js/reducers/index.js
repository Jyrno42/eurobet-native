import {combineReducers} from 'redux';

import user from './user';
import navigationState from './navigationState';
import bets from './bets';


export default combineReducers({
    user,
    navigationState,
    bets
});
