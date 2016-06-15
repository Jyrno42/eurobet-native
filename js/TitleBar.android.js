/**
 * @providesModule TitleBar
 * @flow
 */

import React from 'react';
import ToolbarAndroid from 'ToolbarAndroid';
import StyleSheet from 'StyleSheet';

import {Colors} from 'EurobetConstants';


const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: Colors.Primary,
        height: 56
    }
});


export default (props) => {
    // TODO: Once we have multiple views: navIcon={require('./common/ic_menu_white_24dp.png')} + hook up the menu

    return (
        <ToolbarAndroid
            style={styles.toolbar}
            titleColor="#fff"
            subTitleColor="#fff"
            {...props}
        />
    );
};
