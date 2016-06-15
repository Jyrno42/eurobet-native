/**
 * @providesModule Loader
 * @flow
 */

import React from 'react';
import ProgressBarAndroid from 'ProgressBarAndroid';
import StyleSheet from 'StyleSheet';

import {Colors} from 'EurobetConstants';


const styles = StyleSheet.create({
    loader: {
        marginTop: -7 // TODO: This should probably be dynamic???
    }
});


export default (props) => {
    // Note: we can use unified ActivityIndicator soon

    return (
        <ProgressBarAndroid
            styleAttr="Horizontal"
            color={Colors.Green}
            style={styles.loader}
            {...props}
        />
    );
};
