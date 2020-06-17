import React, { useState, ChangeEvent, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { Platform, View, Image, StyleSheet, Text, ImageBackground, TextInput, KeyboardAvoidingView } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import PickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

interface ItemSelect {
    label: string,
    value: string
}

const Home = () => {
    const [ufs, setUfs] = useState<ItemSelect[]>([]);
    const [cities, setCities] = useState<ItemSelect[]>([]);
    const navigator = useNavigation();

    const [selectUf, setSelectUf] = useState("0");
    const [selectCity, setSelectCity] = useState("0");

    useEffect(() => {
        axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
            .then(response => {
                const ufInitials = response.data.map(x => ({ label: x.sigla, value: x.sigla }));

                setUfs(ufInitials);
            });
    }, []);

    useEffect(() => {
        if (selectUf === "0") return;

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUf}/municipios`)
            .then(response => {
                const citiesNames = response.data.map(x => ({ label: x.nome, value: x.nome }));

                setCities(citiesNames);
            });
    }, [selectUf]);

    function handlerSelectUf(event: string) {
        setSelectUf(event);
    }

    function handlerSelectCity(event: string) {
        setSelectCity(event);
    }

    function handlerNavigationToPoint() {
        navigator.navigate('Points', {
            uf: selectUf,
            city: selectCity
        });
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground
                source={require("../../assets/home-background.png")}
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main}>
                    <Image source={require("../../assets/logo.png")} />
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de rediduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <PickerSelect
                        placeholder={{
                            label: "Selecione a UF",
                            value: null
                        }}
                        items={ufs}
                        onValueChange={handlerSelectUf}
                        value={selectUf}
                        style={pickerSelectStyles}
                    />

                    <PickerSelect
                        placeholder={{
                            label: "Selecione uma cidade",
                            value: null
                        }}
                        items={cities}
                        onValueChange={handlerSelectCity}
                        value={selectCity}
                        style={pickerSelectStyles}
                    />

                    <RectButton style={styles.button} onPress={handlerNavigationToPoint}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#fff" size={24} />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                    </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        backgroundColor: "#f0f0f5"
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
    inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
});

export default Home;