/**
 * @flow
 */

import loginActions from './login';

import * as betActions from './bets';
import * as navigationActions from './navigation';


module.exports = {
    ...betActions,
    ...loginActions,
    ...navigationActions
};
