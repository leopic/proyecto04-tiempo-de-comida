'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Button,
    Text,
    View
} from 'react-native';

export default class TiempoDeComida extends Component {
    handleStuff() {
        console.log('handleStuff');
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Semana Nueva</Text>
                </View>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <View style={styles.footer}>
                    <Button style={styles.footerButton} title={'Cancelar'} onPress={this.handleStuff}>Cancelar</Button>
                    <Button style={styles.footerButton} title={'Listo'} onPress={this.handleStuff}>Listo</Button>
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
    }
});

AppRegistry.registerComponent('TiempoDeComida', () => TiempoDeComida);
