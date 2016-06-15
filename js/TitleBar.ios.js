/**
 * @providesModule HeaderBar
 * @flow
 */

import React, { Component, PropTypes } from 'react';

import View from 'View';
import Text from 'Text';
import StyleSheet from 'StyleSheet';

import {Colors} from 'EurobetConstants';


const styles = StyleSheet.create({
    toolbar: {
        flex: 1,
        backgroundColor: Colors.Primary,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center'
    },

    toolbarTitle:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        flex: 1
    }
});


class HeaderBar extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired
    };

    render() {
        const {title} = this.props;

        return (
            <View>
                <View style={styles.toolbar}>
                    <Text style={styles.toolbarTitle}>{title}</Text>
                </View>
            </View>
        );
    }
}


export default HeaderBar;
