'use strict';

import React from 'react';
import {
    AlertIOS,
    AppRegistry,
    Button,
    DatePickerIOS,
    ListView,
    Picker,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Modal from 'react-native-modal';

export default class TiempoDeComida extends React.Component {
    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.entradas = this.props.entradas;
        this.tiposDeAlimentos = this.props.tiposDeAlimentos;

        this.state = {
            endDate: this.props.endDate,
            entradasDataSource: this.ds.cloneWithRows(this.entradas),
            isModalVisible: false,
            startDate: this.props.startDate,
        };
    }

    agregarTiempoDeComida = (nuevoTiempoDecomida: String = '') => {
        nuevoTiempoDecomida = nuevoTiempoDecomida.trim();

        if (!nuevoTiempoDecomida) {
            console.log('no se ingreso ningun valor');
            return;
        }

        let entradas = this.entradas.slice();
        let comidasDataSource = this.ds.cloneWithRows([{
            tipo: [],
            cantidad: []
        }]);
        entradas = entradas.concat({
            comidas: [],
            comidasDataSource: comidasDataSource,
            nombre: nuevoTiempoDecomida,
            tiposDeAlimentos: this.tiposDeAlimentos
        });

        this.entradas = entradas;

        // Update yo!
        this.setState({
            entradasDataSource: this.ds.cloneWithRows(this.entradas)
        });
    };

    onHandleStuff($event) {
        console.log('onHandleStuff', $event);
        console.log(this.state);
    }

    onAgregarTiempoPresionado = () => {
        AlertIOS.prompt(
            'Nuevo tiempo de comida',
            null,
            this.agregarTiempoDeComida
        );
    };

    onDateChange = (date) => {
        let endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 7);

        this.setState({
            startDate: date,
            endDate: endDate
        });
    };

    static endDate() {
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);
        return endDate;
    }

    static defaultProps = {
        endDate: TiempoDeComida.endDate(),
        entradas: [],
        isModalVisible: false,
        startDate: new Date(),
        tiposDeAlimentos: ['Carbohidratos', 'Frutas', 'Grasas', 'Proteinas', 'Vegetales'],
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

    _onTapAlimento = (data, rowId) => {
        console.log('alimento tapped!', data, rowId);
    };

    onAlimentoChanged = (a) => {
        console.log('padre.onAlimentoChanged', a);
    };

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

                <View>
                    <Button style={styles.footerButton} title={'Nueva entrada'}
                            onPress={this.onAgregarTiempoPresionado}>Nueva entrada</Button>
                </View>

                <MyListView
                    entradasDataSource={this.state.entradasDataSource}
                    onClick={this.onAgregarTiempoPresionado}
                    onAlimentoChanged={this.onAlimentoChanged}
                />

                <View style={styles.footer}>
                    <Button style={styles.footerButton} title={'Cancelar'}
                            onPress={this.onHandleStuff}>Cancelar</Button>
                    <Button style={styles.footerButton} title={'Listo'} onPress={this.onHandleStuff}>Listo</Button>
                </View>

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{backgroundColor: '#fff'}}>
                        <Text style={{margin: 10, fontSize: 18}}>Fecha de inicio</Text>
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
    state = {
        isMyModalVisible: false,
        temp: {}
    };

    _showModal = () => this.setState({ isMyModalVisible: true });

    _hideModal = () => {
        this.setState({isMyModalVisible: false});

        // Comunicar al padre
        this.props.onAlimentoChanged(this.state.temp);
        this.setState({temp: null});
    };

    _onTapAlimento = (data, rowId) => {
        console.log('_onTapAlimento.alimento tapped!', data, rowId);
        this.setState({temp: { data: data, rowId: rowId }});
        this._showModal();
    };

    // TODO:
    // https://stackoverflow.com/questions/35397678/bind-picker-to-list-of-picker-item-in-react-native

    render() {
        return (
            <ListView dataSource={this.props.entradasDataSource} enableEmptySections={true}
                      style={listViewStyles.listView} renderRow={(data, sId, rId) => {
                          return <View style={listViewStyles.viewItem}>
                              <Button title={'+'} onPress={this.props.onClick}>Nuevo tiempo de comida</Button>

                              <Text style={listViewStyles.viewLabel}> nombre: {data.nombre} </Text>

                              <Button title={'v'} onPress={() => { this._onTapAlimento(data, rId); }}>Nuevo Alimento</Button>

                              <ListView dataSource={data.comidasDataSource} enableEmptySections={true}
                                        renderRow={comida => {
                                            return <View style={{padding: 4}}>
                                                <Text>comida: {comida.tipo[0]}</Text>
                                                <Text>comida: {comida.cantidad[0]}</Text>
                                            </View>
                                        }}/>

                              <Modal isVisible={this.state.isMyModalVisible}>
                                  <View style={{backgroundColor: '#fff'}}>
                                      <Picker
                                          selectedValue={this.state.language}
                                          onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
                                          <Picker.Item label="Java" value="java" />
                                          <Picker.Item label="JavaScript" value="js" />
                                      </Picker>
                                      <Button title={'Close'} onPress={this._hideModal}>Close</Button>
                                  </View>
                              </Modal>
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
