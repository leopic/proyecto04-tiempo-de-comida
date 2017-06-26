'use strict';

import React from 'react';
import {
    Button,
    ListView,
    Picker,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Modal from 'react-native-modal';

export default class TiemposListView extends React.Component {
    state = {
        isModalVisible: false,
        tiempoDeComidaActual: {},
        macronutrientes: [],
        tiempoSeleccionado: null
    };

    _showModal = () => this.setState({ isModalVisible: true });

    _hideModal = () => this.setState({ isModalVisible: false });

    _agregarTipoDeComida = () => {
        if (!this.state.tiempoSeleccionado) {
            return;
        }

        let temp = this.state.tiempoDeComidaActual;
        let entrada = temp.data;
        entrada.comidas.push(this.state.tiempoSeleccionado);
        entrada.cantidad.push(0);
        let copiaDeTipos = entrada.macronutrientes.slice();
        copiaDeTipos.splice(copiaDeTipos.indexOf(this.state.tiempoSeleccionado), 1);
        entrada.macronutrientes = copiaDeTipos.sort();

        temp.data = entrada;

        this._actualizarTiempoDeComida(temp);
        this._hideModal();
    };

    _onTapAgregarMacronutriente = (data, rowId) => {
        this.setState({
            tiempoDeComidaActual: {data: data, rowId: rowId},
            macronutrientes: data.macronutrientes,
            tiempoSeleccionado: data.macronutrientes[0]
        });

        this._showModal();
    };

    _onEliminarTiempo = (data, rowId) => {
        this.props.onEliminarTiempo(rowId);
    };

    _modificarCantidadMacronutriente = (idx, cantidad): any => {
        let temp = this.state.tiempoDeComidaActual;
        let entrada = temp.data;
        entrada.cantidad[idx] = entrada.cantidad[idx] + cantidad;
        temp.data = entrada;

        return temp;
    };

    _aumentarMacronutriente = idx => {
        const temp = this._modificarCantidadMacronutriente(idx, 1);
        this._actualizarTiempoDeComida(temp);
    };

    _reducirMacronutriente = idx => {
        const temp = this._modificarCantidadMacronutriente(idx, -1);
        this._actualizarTiempoDeComida(temp);
    };

    _eliminarMacroNutriente = idx => {
        let temp = this.state.tiempoDeComidaActual;
        let entrada = temp.data;
        let copiaDeTipos = entrada.macronutrientes.slice();
        copiaDeTipos.push(entrada.comidas[idx]);
        entrada.macronutrientes = copiaDeTipos;
        entrada.cantidad.splice(idx, 1);
        entrada.comidas.splice(idx, 1);
        temp.data = entrada;
        this._actualizarTiempoDeComida(temp);
    };

    _actualizarTiempoDeComida = nuevoTiempo => {
        this.setState({ tiempoDeComidaActual: nuevoTiempo });
        this.props.onActualizarTiempoDeComida(this.state.tiempoDeComidaActual);
    };

    render() {
        let listaDeTiposDeComida = this.state.macronutrientes.map((tipo, idx): Picker.Item[] => {
            return <Picker.Item key={idx} value={tipo} label={tipo} />
        });

        let dibujarMacronutriente = (tiempoDeComida): View => {
            let comidas = tiempoDeComida.comidas;
            let cantidades = tiempoDeComida.cantidad;

            if (!comidas.length || !cantidades.length) {
                return <View/>;
            }

            let comidasView = comidas.map((macronutriente, idx) => {
                return <View style={styles.macronutriente} key={macronutriente + idx}>
                    <TouchableOpacity onPress={() => { this._eliminarMacroNutriente(idx); }}
                                      style={[styles.button, styles.buttonSm, styles.buttonWarning]}>
                        <Text style={[styles.buttonLabel, styles.buttonSmLabel, styles.buttonWarningLabel]}>X</Text>
                    </TouchableOpacity>

                    <Text style={{flexGrow: 2, textAlign: 'left', paddingLeft: 4}}>{macronutriente}: {cantidades[idx]}</Text>

                    <View style={styles.stepperContainer}>
                        <TouchableOpacity onPress={() => { this._reducirMacronutriente(idx); }}
                                          style={[styles.button, styles.buttonSm]}>
                            <Text style={[styles.buttonSmLabel]}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this._aumentarMacronutriente(idx); }}
                                          style={[styles.button, styles.buttonSm]}>
                            <Text style={styles.buttonSmLabel}>+</Text>
                        </TouchableOpacity>
                        </View>
                </View>
            });

            return <View>{comidasView}</View>
        };

        let btnAgregarMacronutriente = (data, rId): View|TouchableOpacity => {
            if (!data.macronutrientes.length) {
                return <View/>
            }

            return <TouchableOpacity onPress={() => { this._onTapAgregarMacronutriente(data, rId); }} style={styles.button}>
                <Text style={styles.buttonLabel}>Agregar macronutriente</Text>
            </TouchableOpacity>
        };

        let celda = (data, sId, rId): View => {
            return <View style={styles.viewItem}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => { this._onEliminarTiempo(data, rId); }}
                                      style={[styles.button, styles.buttonSm, styles.buttonWarning]}>
                        <Text style={[styles.buttonLabel, styles.buttonSmLabel, styles.buttonWarningLabel]}>X</Text>
                    </TouchableOpacity>

                    <Text style={styles.viewLabel}>{data.nombre}</Text>
                </View>

                <ListView dataSource={data.comidasDataSource} enableEmptySections={true} style={{marginBottom: 8}}
                          renderRow={(macronutriente) => dibujarMacronutriente(macronutriente) }/>

                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    {btnAgregarMacronutriente(data, rId)}
                </View>

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{backgroundColor: '#fff'}}>
                        <Text style={{margin: 10, fontSize: 18}}>Seleccione el tipo de comida</Text>

                        <Picker selectedValue={this.state.tiempoSeleccionado}
                                onValueChange={(itemValue) => { this.setState({tiempoSeleccionado: itemValue}); }}>
                            {listaDeTiposDeComida}
                        </Picker>

                        <View style={{flexDirection: 'row', height: 48, justifyContent: 'space-around'}}>
                            <Button title={'Agregar'} onPress={this._agregarTipoDeComida}/>
                            <Button title={'Cancelar'} onPress={this._hideModal}/>
                        </View>
                    </View>
                </Modal>
            </View>
        };

        return (
            <ListView
                dataSource={this.props.entradasDataSource}
                enableEmptySections={true}
                style={styles.listView}
                renderRow={celda}
            />
        );
    }
}

const styles = StyleSheet.create({
    listView: {
        padding: 10,
        backgroundColor: '#fff'
    },
    viewItem: {
        padding: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    viewLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        flexGrow: 2,
        lineHeight: 44,
        paddingLeft: 4,
    },
    button: {
        backgroundColor: '#eee',
        padding: 4,
        paddingLeft: 8,
        paddingRight: 8,
        marginTop: 4,
        marginBottom: 4,
        borderRadius: 4,
        minWidth: 44,
        minHeight: 44,
    },
    buttonLabel: {
        color: '#000',
        textAlign: 'center',
        lineHeight: 44,
        fontSize: 13,
    },
    buttonWarningLabel: {
        color: 'rgb(255, 100, 100)',
    },
    stepperContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'stretch',
        borderRadius: 4,
    },
    buttonSm: {
        backgroundColor: '#f7f7f7',
        margin: 2,
        padding: 0,
    },
    buttonSmLabel: {
        lineHeight: 44,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
        color: '#007AFF'
    },
    macronutriente: {
        alignContent: 'stretch',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 2,
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
    }
});
