/**
 * @providesModule AnimatedScene
 * @flow
 */

import React, { Component, PropTypes } from 'React';

import Animated from 'Animated';
import StyleSheet from 'StyleSheet';


const styles = StyleSheet.create({
    scene: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.4,
        shadowRadius: 10
    }
});


class AnimatedScene extends Component {
    static propTypes = {
        renderScene: PropTypes.func.isRequired,
        layout: PropTypes.object.isRequired,
        position: PropTypes.object.isRequired,
        scene: PropTypes.object.isRequired
    };

    render() {
        return (
            <Animated.View style={[styles.scene, this._getAnimatedStyle()]}>
                {this.props.renderScene(this.props)}
            </Animated.View>
        );
    }

    _getAnimatedStyle() {
        const { layout, position, scene } = this.props;
        const { index } = scene;
        const inputRange = [index - 1, index, index + 1];

        return {
            transform: [
                {
                    translateY: position.interpolate({
                        inputRange,
                        outputRange: [layout.initHeight, 0, -10]
                    })
                }
            ]
        };
    }
}

export default AnimatedScene;
