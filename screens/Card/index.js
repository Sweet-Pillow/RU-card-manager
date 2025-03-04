import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

export default function Card() {

    const [cards, setCards] = useState([]);
    const [showButtons, setShowButtons] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            // const loadCards = async () => {
            //     const storedCards = await AsyncStorage.clear();
            //     if (storedCards) setCards(JSON.parse(storedCards));
            // };

            const loadCards = async () => {
                const storedCards = await AsyncStorage.getItem('cards');
                console.log(storedCards)
                if (storedCards) setCards(JSON.parse(storedCards));
            };

            loadCards();
        }, [])
    );

    async function handleRemover() {
        const storedCards = await AsyncStorage.clear();
        if (storedCards) setCards(JSON.parse(storedCards));

        setCards([])
        setShowButtons(false)
    }

    async function handleNFCWrite() {
        let result = false;

        try {
            // STEP 1
            await NfcManager.requestTechnology(NfcTech.Ndef);

            // const bytes = Ndef.encodeMessage([Ndef.textRecord(cards.id)]);
            const bytes = Ndef.encodeMessage([Ndef.textRecord("teste")]);

            if (bytes) {
                await NfcManager.ndefHandler // STEP 2
                    .writeNdefMessage(bytes); // STEP 3
                result = true;
            }
        } catch (ex) {
            console.warn(ex);
        } finally {
            // STEP 4
            NfcManager.cancelTechnologyRequest();
        }

        return result;
    }

    return (
        <View style={styles.container}>
            {
                cards.length != 0?
            <TouchableOpacity onPress={handleNFCWrite} onLongPress={() => setShowButtons(true)} delayLongPress={200} >
                <View style={styles.item}>
                    <Text style={styles.texto}>{cards.cardName}</Text>
                    <Text style={styles.texto}>{cards.id}</Text>
                </View>
            </TouchableOpacity> : ""
            }
            {
                showButtons &&
                <View style={styles.botoesContainer}>
                    <Button title="Remover" onPress={handleRemover} />
                    <Button title="Cancelar" onPress={() => setShowButtons(false)} color="red" />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    texto: {
        fontSize: 18,
    },
    container: {
        padding: 50,
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});