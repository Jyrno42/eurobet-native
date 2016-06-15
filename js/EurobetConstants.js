/**
 * @providesModule EurobetConstants
 * @flow
 */

export const Language = 'et';

export const LoginState = {
    unknown: 0,
    authenticated: 1,
    anonymous: 2,
    error: 3
};

// Note: For local development, set this to `10.0.2.2:8000`
export const ApiBase = 'http://eurobet.thorgate.eu';
export const ApiRoot = `${ApiBase}/api/v1/`;

export const Colors = {
    PrimaryDark: '#2F4154',
    Primary: '#34495E',
    Green: '#26B99A',
    Error: '#a94442'
};

export const OrigScreenWidth = 320;
export const OrigScreenHeight = 592;
