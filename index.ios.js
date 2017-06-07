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
        let month = date.getMonth() + 1;
        const paddedMonth = month > 10 ? month : `0${month}`;
        const day = date.getDate();
        const paddedDay = day > 10 ? day : `0${day}`;
        return `${paddedDay}/${paddedMonth}/${year}`;
    };

    _showModal = () => this.setState({ isModalVisible: true });

    _hideModal = () => this.setState({ isModalVisible: false });

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>SEMANA NUEVA</Text>
                    <TouchableOpacity onPress={this._showModal} style={styles.dateWrap}>
                        <Text style={styles.startDate}>Inicio: {this._formattedDate(this.state.startDate)}</Text>
                        <Text style={styles.endDate}>Fin: {this._formattedDate(this.state.endDate)}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Button style={styles.footerButton} title={'Cancelar'} onPress={this.onHandleStuff}>Cancelar</Button>
                    <Button style={styles.footerButton} title={'Listo'} onPress={this.onHandleStuff}>Listo</Button>
                </View>

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{ backgroundColor: '#fff' }}>
                        <Text style={{ margin: 10, fontSize: 18 }}>Start date</Text>
                        <DatePickerIOS date={this.state.startDate} mode="date"
                                       onDateChange={this.onDateChange}/>
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
        height: 48,
        width: '100%',
    },
    headerText: {
        color: '#fff',
        lineHeight: 64,
        textAlign: 'center'
    },
    footer: {
        flexDirection: 'row',
        height: 48,
        justifyContent: 'space-around',
    },
    dateWrap: {
        backgroundColor: 'teal',
        height: 40,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    startDate: {
        flex: 1,
        textAlign: 'center',
    },
    endDate: {
        flex: 1,
        textAlign: 'center',
    }
});

AppRegistry.registerComponent('TiempoDeComida', () => TiempoDeComida);
