/**
 * @providesModule Loader
 * @flow
 */

import React from 'react';
import ProgressBarAndroid from 'ProgressBarAndroid';
import StyleSheet from 'StyleSheet';

import {Colors} from 'EurobetConstants';


const styles = StyleSheet.create({
    centering: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default (props) => {
    // Note: we can use unified ActivityIndicator soon

    return (
        <ActivityIndicatorIOS
          style={styles.loader}
          color={Colors.Primay}
          size="large"
        />
    );
};
