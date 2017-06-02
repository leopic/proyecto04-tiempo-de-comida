'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    DatePickerIOS,
    TouchableOpacity,
    Button,
    Text,
    View
} from 'react-native';

import Modal from 'react-native-modal';

export default class TiempoDeComida extends Component {
    onHandleStuff($event) {
        console.log('onHandleStuff', $event);
    };

    onDateChange = (date) => {
        let endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 7);
        this.setState({ startDate: date, endDate: endDate });
    };

    static endDate() {
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);
        return endDate;
    }

    static defaultProps = {
        startDate: new Date(),
        endDate: TiempoDeComida.endDate()
    };

    state = {
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        isModalVisible: false
    };

    _formattedDate(date: Date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}/${day}/${year}`;
    };

    _showModal = () => this.setState({ isModalVisible: true });

    _hideModal = () => this.setState({ isModalVisible: false });

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Semana Nueva</Text>
                </View>

                <Text>startDate: {this._formattedDate(this.state.startDate)}</Text>
                <Text>endDate: {this._formattedDate(this.state.endDate)}</Text>

                <Button title={'MODAL'} onPress={this._showModal}>MODAL</Button>

                <View style={styles.footer}>
                    <Button style={styles.footerButton} title={'Cancelar'} onPress={this.onHandleStuff}>Cancelar</Button>
                    <Button style={styles.footerButton} title={'Listo'} onPress={this.onHandleStuff}>Listo</Button>
                </View>

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{ backgroundColor: '#fff' }}>
                        <Text style={{ margin: 10, fontSize: 18 }}>Start date</Text>
                        <DatePickerIOS date={this.state.startDate} mode="date"
                                       style={styles.datePicker} onDateChange={this.onDateChange}/>
                        <Text style={{ color: '#fff' }}>Hello!</Text>
                        <Button title={'Close'} onPress={this._hideModal}>Close</Button>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        alignSelf: 'flex-start',
        backgroundColor: 'blue',
        height: 64,
        width: '100%',
    },
    headerText: {
        color: '#fff',
        lineHeight: 64,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        height: 48,
        justifyContent: 'space-around',
    },
    welcome: {
        alignSelf: 'flex-end',
        backgroundColor: 'red',
        color: '#fff',
        flexGrow: 2,
        fontSize: 20,
        margin: 0,
        textAlign: 'center',
        width: '100%',
    },
    datePicker: {
        // backgroundColor: 'pink',
        // height: 20
    }
});

AppRegistry.registerComponent('TiempoDeComida', () => TiempoDeComida);
