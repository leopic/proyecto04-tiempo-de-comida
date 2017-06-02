'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    DatePickerIOS,
    Button,
    Text,
    View
} from 'react-native';

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
        endDate: this.props.endDate
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Semana Nueva</Text>
                </View>

                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>

                <DatePickerIOS date={this.state.startDate} mode="datetime" style={styles.datePicker}
                               onDateChange={this.onDateChange}/>

                <DatePickerIOS date={this.state.endDate} mode="datetime" style={styles.datePicker}
                               onDateChange={function (a, b) { console.log(a, b); }}/>

                <View style={styles.footer}>
                    <Button style={styles.footerButton} title={'Cancelar'} onPress={this.onHandleStuff}>Cancelar</Button>
                    <Button style={styles.footerButton} title={'Listo'} onPress={this.onHandleStuff}>Listo</Button>
                </View>
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
        // height: 0
    }
});

AppRegistry.registerComponent('TiempoDeComida', () => TiempoDeComida);
