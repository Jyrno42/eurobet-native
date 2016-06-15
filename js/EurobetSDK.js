/**
 * @providesModule EurobetSDK
 */

import CookieManager from 'react-native-cookies';
import Router, {Resource} from "tg-resources-react-native";

import {ApiBase, ApiRoot} from 'EurobetConstants';


const sDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const sMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];


class EurobetSDK extends Router {
    static defaultRoutes = {
        user: new Router({
            me: new Resource('user/me'),
            login: new Resource('user/login', {
                // return response instead, since we want to grab session id from headers
                mutateResponse(responseData, response) {
                    return response;
                }
            }),
            logout: new Resource('user/logout')
        }),
        bets: new Resource('bets')
    };

    static defaultOptions = {
        apiRoot: ApiRoot
    };

    constructor(routes, options) {
        super(routes, options);

        this._sessionId = null;
    }

    /**
     * Set current session cookie to specified value
     *
     * Since react-native handles cookies inside their xhr/fetch implementation by default and we want
     * to manually control them via redux we need to use react-native-cookies to set the session id.
     *
     * @param value
     * @returns {Promise}
     */
    setSessionId(value) {
        return new Promise((resolve, reject) => {
            // No need to touch cookie manager if we don't actually change the stored cookie
            if (this._sessionId === value) {
                this._sessionId = value;
                resolve(true);
            } else {
                const d = new Date(new Date().getTime() + (14 * 24 * 60 * 60 * 1000));  // 2 weeks
                const expTime = `${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()} GMT`;
                const expDate = `${sDays[d.getUTCDay()]}, ${d.getUTCDate()}-${sMonths[d.getUTCMonth()]}-${d.getUTCFullYear()} ${expTime}`;

                this._sessionId = value;

                if (value === null) {
                    value = '';
                }

                CookieManager.setFromResponse(ApiBase, `eurobet_ssid=${value}; expires=${expDate}; HttpOnly`, (res) => {
                    resolve(true);
                });

            }
        });
    }

    getUserState(sessionId) {
        return this.setSessionId(sessionId).then(res => {
            return this.user.me.fetch();
        });
    }

    login(email, password): Promise {
        return this.user.login.post(null, {
            email,
            password
        }).then(response => {
            return this.setSessionId(response.headers['x-session-id']).then(() => {
                return response.headers['x-session-id'];
            });
        });
    }

    logout() {
        return this.user.logout.post(null, {
            email,
            password
        }).then(data => {
            return this.setSessionId(null).then(() => {
                return data;
            });
        });
    }

    getBets() {
        return this.bets.fetch().then(data => {
            const result = {
                byId: [],
                allBets: {}
            };

            data.forEach(bet => {
                result.byId.push(bet.guid);
                result.allBets[bet.guid] = {
                    name: bet.name,
                    total_points: bet.total_points
                }
            });

            return result;
        });
    }
}


export default new EurobetSDK();
