'use strict';

import React from 'react';
import {
    AlertIOS,
    AppRegistry,
    Button,
    DatePickerIOS,
    ListView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Modal from 'react-native-modal';

import TiemposListView from './tiempos-list-view';

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
            comidas: [],
            cantidad: []
        }]);
        entradas = entradas.concat({
            comidas: [],
            cantidad: [],
            comidasDataSource: comidasDataSource,
            nombre: nuevoTiempoDecomida,
            tiposDeAlimentos: this.tiposDeAlimentos
        });

        this.entradas = entradas;

        this.setState({
            entradasDataSource: this.ds.cloneWithRows(this.entradas)
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

    // Cuando se elimina un tiempo de comida
    onEliminarTiempo = (rowId) => {
      let entradas = this.entradas.slice();
      entradas.splice(rowId, 1);
      this.entradas = entradas;

      this.setState({
        entradasDataSource: this.ds.cloneWithRows(this.entradas)
      })
    };

    // Cuando se quiere agregar un nuevo tiempo
    onAgregarTiempo = () => {
        AlertIOS.prompt(
            'Agregar tiempo de comida',
            null,
            this.agregarTiempoDeComida
        );
    };

    // Cuando se agrega un nuevo tipo a un tiempo existente
    onAgregarTipo = (temp) => {
        let entradas = this.entradas.slice();
        entradas[temp.rowId] = temp.data;

        let comidasDataSource = this.ds.cloneWithRows([{
            comidas: temp.data.comidas,
            cantidad: temp.data.cantidad
        }]);

        let tiempoDeComida = entradas[temp.rowId];
        tiempoDeComida.comidas = temp.data.comidas;
        tiempoDeComida.cantidad = temp.data.cantidad;
        tiempoDeComida.comidasDataSource = comidasDataSource;

        this.entradas = entradas;

        this.setState({
            entradasDataSource: this.ds.cloneWithRows(this.entradas)
        });
    };

    onModificarCantidadDeTipo = (temp) => {
        console.log('onModificarCantidadDeTipo', temp);
        this.onAgregarTipo(temp);
    };

    // Cuando cambia la fecha
    onDateChange = (date) => {
        let endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 7);

        this.setState({
            startDate: date,
            endDate: endDate
        });
    };

    // Cuando se hace click a los botones del footer
    onFooterButtonTap($event) {
        console.log('onFooterButtonTap', $event);
    }

    render() {
        let startDate = this._formattedDate(this.state.startDate);
        let endDate = this._formattedDate(this.state.endDate);

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>SEMANA NUEVA</Text>
                    <TouchableOpacity onPress={this._showModal} style={styles.dateWrap}>
                        <Text style={[styles.startDate, styles.dateStyles]}> Inicio: {startDate}</Text>
                        <Text style={[styles.endDate, styles.dateStyles]}> Fin: {endDate}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={this.onAgregarTiempo} style={styles.dateWrap}>
                    <Text style={[styles.startDate, styles.dateStyles]}>Agregar tiempo</Text>
                </TouchableOpacity>

                <TiemposListView
                    entradasDataSource={this.state.entradasDataSource}
                    onAgregarTipo={this.onAgregarTipo}
                    onEliminarTiempo={this.onEliminarTiempo}
                />

                <View style={styles.footer}>
                    <Button style={styles.footerButton} disabled={true} title={'Cancelar'} onPress={this.onFooterButtonTap}/>
                    <Button style={styles.footerButton} disabled={true} title={'Listo'} onPress={this.onFooterButtonTap}/>
                </View>

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{backgroundColor: '#fff'}}>
                        <Text style={{margin: 10, fontSize: 18}}>Fecha de inicio</Text>
                        <DatePickerIOS date={this.state.startDate} mode="date"
                                       onDateChange={this.onDateChange}/>
                        <Button title={'Cerrar'} onPress={this._hideModal}/>
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

AppRegistry.registerComponent('TiempoDeComida', () => TiempoDeComida);
