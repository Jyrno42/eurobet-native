/**
 * @providesModule EurobetTopBets
 * @flow
 */

import React, { Component, PropTypes } from 'React';
import { connect } from 'react-redux';

import Dimensions from 'Dimensions';
import Platform from 'Platform';
import StyleSheet from 'StyleSheet';
import View from 'View';
import Text from 'Text';
import TouchableHighlight from 'TouchableHighlight';
import TouchableNativeFeedback from 'TouchableNativeFeedback';
import ListView from 'ListView';
import RefreshControl from 'RefreshControl';

import {Colors, OrigScreenWidth} from 'EurobetConstants';
import TitleBar from 'TitleBar';
import Loader from 'Loader';

import { loadBets } from './actions';
import { getAllBets } from './reducers/bets';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#fff'
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      padding: 15
    },
    text: {
        fontSize: 14
    },
    boldText: {
        fontWeight: 'bold'
    },
    scoreCol: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    score: {
        flex: 1,
        textAlign: 'right'
    }
});


class EurobetTopBets extends Component {
    static propTypes = {
        loadBets: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        bets: PropTypes.array
    };

    constructor(props) {
        super(props);

        const dataSource = new ListView.DataSource({
            // sectionHeaderHasChanged: this._sectionHeaderHasChanged,
            rowHasChanged: this._rowHasChanged
        });

        this.state = {
            dataSource: dataSource.cloneWithRows(this._getListViewData(props.bets || [])),
            refreshing: false
        };
    }

    componentDidMount() {
        this.props.loadBets();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.bets !== this.props.bets) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this._getListViewData(nextProps.bets || []))
            });
        }

        if (this.state.refreshing && !nextProps.isLoading) {
            this.setState({
                refreshing: false
            });
        }
    }

    _rowHasChanged(oldRow, newRow) {
        return oldRow !== newRow;
    }

    _getListViewData(bets) {
        return bets;
    }

    renderRow = (rowData, sectionID, rowID) => {
        // TouchableNativeFeedback will show material style ripple if we add onPress
        // handler
        const RealTouchable = Platform.select({
            android: TouchableNativeFeedback,
            ios: TouchableHighlight
        });

        const {width} = Dimensions.get('window');

        const dynamicWidth = {
            width: 30 * (width / OrigScreenWidth)
        };

        return (
            <RealTouchable>
                <View>
                    <View style={styles.row}>
                        <Text style={[styles.text, dynamicWidth]}>{`${parseInt(rowID, 10) + 1}.`}</Text>
                        <Text style={[styles.text, styles.boldText]}>{rowData.name}</Text>

                        <View style={styles.scoreCol}>
                            <Text style={[styles.text, styles.score]}>{rowData.total_points}</Text>
                        </View>
                    </View>
                </View>
            </RealTouchable>
        );
    };

    refreshList = () => {
        this.setState({refreshing: true});

        this.props.loadBets();
    };

    render() {
        // NOTE: Listview.enableEmptySections will be deprecated on the next react-native release 0.29

        return (
            <View style={styles.container}>
                <TitleBar title="Eurobet" />

                {this.props.bets === null ? (
                    <Loader />
                ) : (
                    <ListView
                        enableEmptySections={true}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        refreshControl={(
                            <RefreshControl
                                colors={[Colors.Primary, Colors.Green]}
                                progressViewOffset={-10}
                                progressBackgroundColor="#f5f5f5"
                                refreshing={this.state.refreshing}
                                onRefresh={this.refreshList}
                            />
                        )}
                    />
                )}
            </View>
        );
    }
}

export default connect(state => ({
    isLoading: state.bets.isLoading,
    bets: getAllBets(state.bets)
}), {
    loadBets
})(EurobetTopBets);
