'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    DatePickerIOS,
    TouchableOpacity,
    ListView,
    Button,
    Text,
    View
} from 'react-native';

import Modal from 'react-native-modal';

export default class TiempoDeComida extends Component {
    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.tiemposDeComida = this.props.tiemposDeComida;
        this.entradas = this.props.entradas;

        this.state = {
            endDate: this.props.endDate,
            entradasDataSource: this.ds.cloneWithRows(this.props.entradas),
            isModalVisible: false,
            startDate: this.props.startDate,
            tiemposDeComidaDataSource: this.ds.cloneWithRows(this.tiemposDeComida),
        };
    }

    onHandleStuff($event) {
        console.log('onHandleStuff', $event);
        console.log(this.state);
    }

    calledFromChild = () => {
        let test = this.tiemposDeComida.slice();
        test = test.concat('AGUA');
        this.tiemposDeComida = test;

        // Patada para que react actualice todo =/
        this.entradas = this.entradas.slice();

        this.setState({
            tiemposDeComidaDataSource: this.ds.cloneWithRows(this.tiemposDeComida),
            entradasDataSource: this.ds.cloneWithRows(this.entradas)
        });
    };

    onDateChange = (date) => {
        let endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 7);
        this.setState({startDate: date, endDate: endDate});
    };

    static endDate() {
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);
        return endDate;
    }

    static defaultProps = {
        startDate: new Date(),
        endDate: TiempoDeComida.endDate(),
        isModalVisible: false,
        tiemposDeComida: [
            'Lacteos',
            'Carbohidratos',
            'Proteinas',
            'Vegetales',
            'Grasas'
        ],
        tiemposDeComidaDataSource: [],
        entradas: [
            {id: 1, name: 'Desayuno'},
            {id: 2, name: 'Merienda'},
            {id: 3, name: 'Almuerzo'},
            {id: 4, name: 'Merienda'},
            {id: 5, name: 'Cena'}
        ],
        entradasDataSource: [],
    };

    _formattedDate(date: Date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        const paddedMonth = month > 10 ? month : `0${month}`;
        const day = date.getDate();
        const paddedDay = day > 10 ? day : `0${day}`;
        return `${paddedDay}/${paddedMonth}/${year}`;
    };

    _showModal = () => this.setState({isModalVisible: true});

    _hideModal = () => this.setState({isModalVisible: false});

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>SEMANA NUEVA</Text>
                    <TouchableOpacity onPress={this._showModal} style={styles.dateWrap}>
                        <Text
                            style={[styles.startDate, styles.dateStyles]}>Inicio: {this._formattedDate(this.state.startDate)}</Text>
                        <Text
                            style={[styles.endDate, styles.dateStyles]}>Fin: {this._formattedDate(this.state.endDate)}</Text>
                    </TouchableOpacity>
                </View>

                <MyListView
                    tiemposDataSource={this.state.tiemposDeComidaDataSource}
                    entradasDataSource={this.state.entradasDataSource}
                    onClick={this.calledFromChild}
                />

                <View style={styles.footer}>
                    <Button style={styles.footerButton} title={'Cancelar'}
                            onPress={this.onHandleStuff}>Cancelar</Button>
                    <Button style={styles.footerButton} title={'Listo'} onPress={this.onHandleStuff}>Listo</Button>
                </View>

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{backgroundColor: '#fff'}}>
                        <Text style={{margin: 10, fontSize: 18}}>Fecha de inicio</Text>
                        <DatePickerIOS date={this.state.startDate}
                                       mode="date" onDateChange={this.onDateChange}/>
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
        backgroundColor: '#eee',
        width: '100%',
    },
    headerText: {
        color: '#000',
        padding: 16,
        paddingTop: 32,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        height: 48,
        justifyContent: 'space-around',
    },
    dateWrap: {
        borderTopColor: '#c2c2c2',
        borderTopWidth: 1,
        backgroundColor: '#e1e1e1',
        height: 40,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateStyles: {
        flex: 1,
        textAlign: 'center',
    },
    startDate: {
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    endDate: {
        color: '#000',
        flex: 1,
        textAlign: 'center',
    }
});

class MyListView extends React.Component {
    render() {
        return (
            <ListView dataSource={this.props.entradasDataSource} style={listViewStyles.listView}
                      renderRow={data => {
                          return <View style={listViewStyles.viewItem}>
                              <Button title={'Clicka'}
                                      onPress={this.props.onClick}>Clicka</Button>
                              <Text style={listViewStyles.viewLabel}>
                                  id: {data.id} | name: {data.name}
                              </Text>
                              <ListView dataSource={this.props.tiemposDataSource} renderRow={t => {
                                  return <View
                                      style={{borderBottomWidth: 1, borderBottomColor: '#eaeaea', padding: 4}}>
                                      <Text>{t}</Text>
                                  </View>
                              }}/>
                          </View>
                      }}
            />
        );
    }
}

const listViewStyles = StyleSheet.create({
    listView: {
        padding: 10,
        backgroundColor: '#fff',
    },
    viewItem: {
        padding: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    viewLabel: {
        fontSize: 16,
        fontFamily: 'Courier New'
    }
});

AppRegistry.registerComponent('TiempoDeComida', () => TiempoDeComida);
