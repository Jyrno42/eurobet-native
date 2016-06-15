/**
 * @providesModule EurobetSplashScreen
 * @flow
 */

import React, {Component, PropTypes} from 'React';

import {connect} from 'react-redux';
import validateEmail from 'email-validator';

import Dimensions from 'Dimensions';
import View from 'View';
import Image from 'Image';
import Animated from 'Animated';
import Easing from 'Easing';
import StyleSheet from 'StyleSheet';
import TextInput from 'TextInput';
import Text from 'Text';
import TouchableHighlight from 'TouchableHighlight';

import {LoginState, Colors} from 'EurobetConstants';
import {login, hideSplashScreen, getUserState} from './actions';


const BALL_CONFIG = {
    areaHeight: 200,
    ballSize: 50
};

function genXBounce(baseX, xMod, speed, ticks, endX) {
    const res = [];

    let curSpeed = 1.0;
    let haveEnd = false;

    res.push([
        0,
        baseX
    ]);

    for (let i = 0; i < ticks; i += 1) {
        res.push([
            curSpeed * speed,
            baseX + (i * xMod)
        ]);

        curSpeed *= 0.9;

        if (baseX + (i * xMod) >= endX) {
            haveEnd = true;
            break;
        }
    }

    if (!haveEnd && endX) {
        res.push([curSpeed * speed, endX]);
    }

    return res;
}

function genYBounce(baseY, yMod, speed, ticks) {
    const res = [];

    let curSpeed = 1.0;
    let curHeight = 1.0;

    res.push([
        speed,
        baseY
    ]);

    for (let i = 0; i < ticks; i += 1) {
        let yVal = baseY + yMod;

        if (i % 2 === 0) {
            yVal = ((baseY + yMod) - (yMod * curHeight));

            curHeight *= 0.50; // Damping

            // Roll at the end
            if (curHeight < 0.05) {
                curHeight = 0;
            }
        }

        curSpeed *= 0.95;

        res.push([
            curSpeed * speed,
            yVal
        ]);
    }

    return res;
}


class EurobetSplashScreen extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        isAnonymous: PropTypes.bool.isRequired,
        loginError: PropTypes.bool.isRequired
    };

    constructor() {
        super();

        const {width} = Dimensions.get('window');

        this.state = {
            fadeInAnim: new Animated.Value(0),
            fadeOutAnim: new Animated.Value(1),
            ballX: new Animated.Value((width / -2) - (BALL_CONFIG.ballSize / 2)),
            ballY: new Animated.Value(0),
            ballRot: new Animated.Value(0),
            email: '',
            password: '',
            errors: undefined
        };
    }

    componentDidMount() {
        Animated.sequence([
            Animated.delay(1000),
            Animated.timing(this.state.fadeInAnim, {
                toValue: 1,
                duration: 700,
                easing: Easing.cubic
            })
        ]).start(() => this.startAndRepeat());
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isAuthenticated && nextProps.isAuthenticated) {
            this.transitionToBets();
        }
    }

    startAndRepeat = () => {
        this.animateBall(this.nextBallTick);
    };

    nextBallTick = () => {
        if (this.props.isAnonymous) {
            Animated.timing(this.state.fadeOutAnim, {
                toValue: 0,
                duration: 700,
                easing: Easing.cubic
            }).start();
        } else if (this.props.isAuthenticated) {
            this.transitionToBets();
        } else {
            this.animateBall(this.nextBallTick);
        }
    };

    transitionToBets() {
        this.props.getUserState({silent: true});
        this.props.hideSplashScreen();
    }

    animateBall(cb) {
        const {width, height} = Dimensions.get('window');

        const startX = (width / -2) - (BALL_CONFIG.ballSize / 2);
        const startY = 0;

        const offScreen = (width / 2) + (BALL_CONFIG.ballSize / 2);

        // Please note that the rotation animation is manually tuned and changing these values here
        // means one needs to manually tune it again
        const animationSpeed = 500;
        const animationTicks = 8;

        const xSequence = genXBounce(startX, width * 0.2, animationSpeed, animationTicks, offScreen);
        const ySequence = genYBounce(0, 150, animationSpeed / 2, animationTicks * 2);

        Animated.parallel([
            Animated.sequence(xSequence.map(x => Animated.timing(
                this.state.ballX, {
                    duration: x[0],
                    toValue: x[1],
                    easing: Easing.linear
                }
            ))),
            Animated.sequence(ySequence.map(x => Animated.timing(
                this.state.ballY, {
                    duration: x[0],
                    toValue: x[1],
                    easing: Easing.linear
                }
            ))),
            Animated.sequence(xSequence.map((x, i) => {
                return Animated.timing(
                    this.state.ballRot, {
                        duration: x[0],
                        toValue: -110 * (xSequence.length - i),
                        easing: Easing.linear
                    }
                );
            }))
        ]).start(() => {
            // Move back to start
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(this.state.ballY, {duration: 0, toValue: -height, easing: Easing.linear}),
                    Animated.parallel([
                        Animated.timing(this.state.ballX, {duration: 0, toValue: startX, easing: Easing.linear}),
                        Animated.timing(this.state.ballY, {duration: 0, toValue: startY, easing: Easing.linear}),
                        Animated.timing(this.state.ballRot, {duration: 0, toValue: 0})
                    ])
                ])
            ]).start(cb);
        });
    };

    getStyles() {
        const {width, height} = Dimensions.get('window');

        const scaleValue = (height / 592);

        return {
            containerStyle: [
                styles.container,
                {
                    width,
                    height,
                    opacity: this.state.fadeInAnim
                }
            ],

            logoRowStyle: [
                styles.logoRow,

                {
                    width,
                    height,
                    transform: [
                        {translateY: this.state.fadeInAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [height / -2, 0]
                        })}
                    ]
                }
            ],

            logoColumnStyle: [
                styles.logoColumn,

                {
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: 200 * scaleValue,

                    transform: [
                        {translateY: this.state.fadeOutAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-200 * scaleValue, 0]
                        })},
                        {scale: this.state.fadeOutAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1]
                        })}
                    ]
                }
            ],

            logoStyle: [
                styles.logo
            ],

            backgroundStyle: [
                styles.background,
                {
                    width,
                    height,
                    top: -414 * scaleValue,
                    opacity: this.state.fadeOutAnim
                }
            ],

            loginRowStyle: [
                {
                    position: 'absolute',
                    height,
                    width,
                    top: 0,
                    paddingLeft: 40 * scaleValue,
                    paddingRight: 40 * scaleValue,
                    transform: [
                        {translateY: this.state.fadeOutAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, height]
                        })}
                    ]
                }
            ],

            loginColumnStyle: [
                styles.loginColumn,

                {
                    paddingTop: 200 * scaleValue
                }
            ],

            rowStyle: [
                styles.row
            ],

            colStyle: [
                styles.col
            ],

            cellStyle: [
                styles.cell
            ],

            ballStyle: [
                {marginTop: -40 * scaleValue},

                {
                    transform: [
                        {translateX: this.state.ballX},
                        {translateY: this.state.ballY},
                        {rotateZ: this.state.ballRot.interpolate({
                            inputRange: [0, 360],
                            outputRange: ['0deg', '360deg']
                        })}
                    ]
                }
            ]
        };
    }

    onEmailChange = (email) => {
        this.setState({
            email
        });
    };

    onPasswordChange = (password) => {
        this.setState({
            password
        });
    };

    validate(state) {
        const newState = {
            errors: null
        };

        if (!state.email) {
            newState.errors = {
                email: 'required'
            };
        } else if (!state.email) {
            newState.errors = {
                email: 'invalid'
            };
        }

        if (!state.password) {
            if (newState.errors === null) {
                newState.errors = {};
            }

            newState.errors.password = 'required';
        }

        return newState;
    }

    attemptLogin = () => {
        this.setState(this.validate(this.state), () => {
            if (this.state.errors === null) {
                this.props.login(this.state.email, this.state.password);
            }
        });
    };

    render() {
        const {
            containerStyle, logoRowStyle, logoStyle, backgroundStyle, rowStyle,
            colStyle, cellStyle, ballStyle, logoColumnStyle, loginRowStyle, loginColumnStyle
        } = this.getStyles();

        const {loginError} = this.props.loginError;

        const emailError = loginError || (this.state.errors && this.state.errors.email);
        const passwordError = loginError || (this.state.errors && this.state.errors.password);

        return (
            <Animated.View style={containerStyle}>
                <Animated.View style={logoRowStyle}>
                    <Animated.View style={logoColumnStyle}>
                        <Image style={logoStyle} source={require('./common/eurobet-logo-big.png')} />
                    </Animated.View>
                </Animated.View>

                <Animated.Image style={backgroundStyle} source={require('./common/grass.png')} resizeMode={Image.resizeMode.contain}>
                    <View style={rowStyle}>
                        <View style={colStyle}>
                            <View style={cellStyle}>
                                <Animated.Image style={ballStyle} source={require('./common/ball.png')} />
                            </View>
                        </View>
                    </View>
                </Animated.Image>

                <Animated.View style={loginRowStyle}>
                    <View style={loginColumnStyle}>
                        <TextInput
                            ref="email"
                            placeholder="Email"
                            keyboardType="email-address"
                            returnKeyType="next"
                            blurOnSubmit={false}
                            underlineColorAndroid={passwordError ? Colors.Error : '#fff'}
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={[styles.formInput, emailError ? styles.formInputError : null].filter(x => x !== null)}
                            onSubmitEditing={() => this.refs.password.focus()}
                            onChangeText={this.onEmailChange}
                            value={this.state.email}
                        />
                        <TextInput
                            ref="password"
                            placeholder="Password"
                            secureTextEntry
                            returnKeyType="done"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            underlineColorAndroid={passwordError ? Colors.Error : '#fff'}
                            style={[styles.formInput, passwordError ? styles.formInputError : null].filter(x => x !== null)}
                            onSubmitEditing={this.attemptLogin}
                            onChangeText={this.onPasswordChange}
                            value={this.state.password}
                        />
                        <TouchableHighlight style={styles.buttonWrapper} onPress={this.attemptLogin}>
                            <Text style={styles.formButton}>
                                Log in
                            </Text>
                        </TouchableHighlight>
                    </View>
                </Animated.View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.PrimaryDark
    },
    background: {},
    logoRow: {},
    logoColumn: {},
    logo: {},
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    loginColumn: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    cell: {
        height: BALL_CONFIG.areaHeight
    },
    formInput: {
        height: 60,
        borderColor: '#ffffff',
        borderBottomWidth: 1,
        color: '#fff'
    },
    formInputError: {
        borderColor: Colors.Error
    },
    buttonWrapper: {
        marginTop: 20,
        height: 40,
        backgroundColor: Colors.Green,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    formButton: {
        textAlign: 'center',
        color: '#fff'
    }
});


export default connect(
    state => ({
        isAuthenticated: state.user.isLoggedIn === LoginState.authenticated,
        isAnonymous: state.user.isLoggedIn === LoginState.anonymous || state.user.isLoggedIn === LoginState.error,
        loginError: state.user.isLoggedIn === LoginState.error
    }),
    {
        getUserState,
        hideSplashScreen,
        login
    }
)(EurobetSplashScreen);
