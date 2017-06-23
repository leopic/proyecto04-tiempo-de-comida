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

        let temp = this.state.temp;
        let entrada = temp.data;
        entrada.comidas.push(this.state.tiempoSeleccionado);
        entrada.cantidad.push(0);
        let copiaDeTipos = entrada.tiposDeAlimentos.slice();
        copiaDeTipos.splice(copiaDeTipos.indexOf(this.state.tiempoSeleccionado), 1);
        entrada.tiposDeAlimentos = copiaDeTipos;

        temp.data = entrada;

        this.setState({temp: temp});
        this.props.onAgregarTipo(this.state.temp);
        this._hideModal();
    };

    _onTapAlimento = (data, rowId) => {
        this.setState({
            temp: { data: data, rowId: rowId },
            tiposDeAlimentos: data.tiposDeAlimentos
        });

        this._showModal();
    };

    _onEliminarTiempo = (data, rowId) => {
        this.props.onEliminarTiempo(rowId);
    };

    render() {
        let listaDeTiposDeComida = this.state.tiposDeAlimentos.map((tipo, idx): Picker.Item[] => {
            return <Picker.Item key={idx} value={tipo} label={tipo} />
        });

        let entradaComida = (comida): View => {
            let comidas = comida.comidas;
            let cantidades = comida.cantidad;

            if (!comidas.length || !cantidades.length) {
                return <View/>;
            }

            let comidasView = comidas.map((comida, idx) => {
                return <View style={{padding: 4}} key={comida + idx}>
                    <Text>{comida}: {cantidades[idx]}</Text>
                </View>
            });

            return <View>{comidasView}</View>
        };

        let btnNuevoAlimento = (data, rId): View|TouchableOpacity => {
            if (!data.tiposDeAlimentos.length) {
                return <View/>
            }

            return <TouchableOpacity onPress={() => { this._onTapAlimento(data, rId); }} style={styles.button}>
                <Text style={styles.buttonLabel}>Agregar macronutriente</Text>
            </TouchableOpacity>
        };

        let celda = (data, sId, rId): View => {
            return <View style={styles.viewItem}>
                <Text style={styles.viewLabel}>{data.nombre}</Text>

                <ListView dataSource={data.comidasDataSource} enableEmptySections={true} renderRow={entradaComida}/>

                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    {btnNuevoAlimento(data, rId)}

                    <TouchableOpacity onPress={() => { this._onEliminarTiempo(data, rId); }}
                                      style={[styles.button, styles.buttonWarning]}>
                        <Text style={[styles.buttonLabel]}>Eliminar tiempo</Text>
                    </TouchableOpacity>
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
    },
    button: {
        backgroundColor: '#eee',
        padding: 4,
        marginTop: 4,
        marginBottom: 4
    },
    buttonLabel: {
        color: '#000',
        textAlign: 'center',
        fontSize: 13,
    },
    buttonWarning: {
        backgroundColor: 'rgb(255, 200, 200)'
    }
});
