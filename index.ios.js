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

    // Cuando se agrega un nuevo tipo a una comida existente
    onAlimentoChanged = (temp) => {
        let entradas = this.entradas.slice();
        entradas[temp.rowId] = temp.data;

        let comidasDataSource = this.ds.cloneWithRows([{
            comidas: temp.data.comidas,
            cantidad: temp.data.cantidad
        }]);

        // TODO: Remover el tiempo de comida nuevo
        let tiempoDeComida = entradas[temp.rowId];
        tiempoDeComida.comidas = temp.data.comidas;
        tiempoDeComida.cantidad = temp.data.cantidad;
        tiempoDeComida.comidasDataSource = comidasDataSource;

        this.entradas = entradas;

        // Update yo!
        this.setState({
            entradasDataSource: this.ds.cloneWithRows(this.entradas)
        });

        console.log('padre.onAlimentoChanged', temp);
    };

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

                <View>
                    <Button style={styles.footerButton} title={'Nuevo tiempo'}
                            onPress={this.onAgregarTiempoPresionado}/>
                </View>

                <MyListView
                    entradasDataSource={this.state.entradasDataSource}
                    onClick={this.onAgregarTiempoPresionado}
                    onAlimentoChanged={this.onAlimentoChanged}
                />

                <View style={styles.footer}>
                    <Button style={styles.footerButton} disabled={true} title={'Cancelar'} onPress={this.onHandleStuff}/>
                    <Button style={styles.footerButton} disabled={true} title={'Listo'} onPress={this.onHandleStuff}/>
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

class MyListView extends React.Component {
    state = {
        isModalVisible: false,
        temp: {},
        tiposDeAlimentos: []
    };

    _showModal = () => this.setState({ isModalVisible: true });

    _hideModal = () => {
        this.setState({isModalVisible: false});
    };

    _agregarTipoDeComida = () => {
        if (!this.state.tiempoSeleccionado) {
            return;
        }

        console.log('_agregarTipoDeComida called!');
        console.log('tiempo seleccionado:', this.state.tiempoSeleccionado);
        let temp = this.state.temp;
        let entrada = temp.data;
        entrada.comidas.push(this.state.tiempoSeleccionado);
        entrada.cantidad.push(0);
        temp.data = entrada;

        this.setState({temp: temp, tiempoSeleccionado: null});
        this.props.onAlimentoChanged(this.state.temp);
        this._hideModal();
    };

    _onTapAlimento = (data, rowId) => {
        console.log('_onTapAlimento.alimento tapped!', data, rowId);
        // TODO: Filtrar los tipos de alimentos basados en lo agregado

        this.setState({
            temp: { data: data, rowId: rowId },
            tiposDeAlimentos: data.tiposDeAlimentos
        });

        this._showModal();
    };

    render() {
        let listaDeTiposDeComida = this.state.tiposDeAlimentos.map((tipo, idx) => {
            return <Picker.Item key={idx} value={tipo} label={tipo} />
        });

        let entradaComida = (comida) => {
            let comidas = comida.comidas;
            let cantidades = comida.cantidad;

            if (!comidas.length || !cantidades.length) {
                return <View/>;
            }

            return <View style={{padding: 4}}>
                <Text>comida: {comidas.join('-')}</Text>
                <Text>cantidad: {cantidades.join('-')}</Text>
            </View>
        };

        let celda = (data, sId, rId) => {
            return <View style={listViewStyles.viewItem}>
                <Text style={listViewStyles.viewLabel}>{data.nombre}</Text>

                <Button title={'Nuevo Alimento'} onPress={() => { this._onTapAlimento(data, rId); }}/>

                <ListView dataSource={data.comidasDataSource} enableEmptySections={true} renderRow={entradaComida}/>

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{backgroundColor: '#fff'}}>
                        <Text style={{margin: 10, fontSize: 18}}>Seleccione el tipo de comida</Text>

                        <Picker selectedValue={this.state.tiempoSeleccionado}
                            onValueChange={(itemValue, itemIndex) => { this.setState({tiempoSeleccionado: itemValue}); }}>
                        {listaDeTiposDeComida}
                        </Picker>

                        <Button title={'Agregar'} onPress={this._agregarTipoDeComida}>Agregar</Button>
                        <Button title={'Close'} onPress={this._hideModal}>Cancelar</Button>
                    </View>
                </Modal>
            </View>
        };

        return (
            <ListView
                dataSource={this.props.entradasDataSource}
                enableEmptySections={true}
                style={listViewStyles.listView}
                renderRow={celda}
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
        fontWeight: 'bold',
    }
});

AppRegistry.registerComponent('TiempoDeComida', () => TiempoDeComida);
