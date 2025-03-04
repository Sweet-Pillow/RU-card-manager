
import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, ToastAndroid, TextInput, Text } from 'react-native';
import NfcManager, { nfcManager, NfcTech } from 'react-native-nfc-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Pre-step, call this before any NFC operations
NfcManager.start();

function App() {

    const [disableButtom, setDisableButtom] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);
    const [tagId, setTagId] = useState("");
    const [cardName, setCardName] = useState("");

    useEffect(() => {
        hasSupport();
        isNFCEnable();

        const loadCards = async () => {
            const storedCards = await AsyncStorage.getItem('cards');
            storedCards && setDisableButtom(true)
        };

        loadCards();

    }, [])

    const hasSupport = async () => {
        const support = await nfcManager.isSupported();

        if (!support) {
            ToastAndroid.show("Aparelho não tem suporte para NFC.", ToastAndroid.SHORT)
            return
        }

    }

    const isNFCEnable = async () => {
        const enable = await nfcManager.isEnabled();

        if (!enable) {
            ToastAndroid.show("NFC não está habilitado.", ToastAndroid.SHORT)
            return
        }

    }

    const handleSave = async () => {

        const newCard = {
            id: tagId,
            cardName: cardName
        }

        const storedCards = await AsyncStorage.getItem('cards');
        
        !storedCards? await AsyncStorage.setItem('cards', JSON.stringify(newCard)): ToastAndroid.show("Já possui elementos", ToastAndroid.SHORT)

        setShowAddCard(false)
    }

    async function readNdef() {
        setDisableButtom(true)
        try {
            // register for the NFC tag with NDEF in it
            await NfcManager.requestTechnology(NfcTech.Ndef);
            // the resolved tag object will contain `ndefMessage` property
            const tag = await NfcManager.getTag();

            setTagId(tag.id)

            setShowAddCard(true)

            ToastAndroid.show("Tag Lida com sucesso.", ToastAndroid.SHORT)

            //console.warn('Tag found', tag);

        } catch (ex) {
            console.warn('Oops!', ex);
        } finally {

            // stop the nfc scanning
            NfcManager.cancelTechnologyRequest();

        }
        setDisableButtom(false)
    }

    return (
        <View>
            <Button title="Scanear" onPress={readNdef} disabled={disableButtom} />

            {
                showAddCard && (
                    <View style={styles.container}>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o nome do elemento"
                            value={cardName}
                            onChangeText={setCardName}
                        />

                        <Text style={styles.idText}>ID: {tagId}</Text>

                        <View style={styles.botoesContainer}>
                            <Button title="Salvar" onPress={handleSave} />
                            <Button title="Cancelar" onPress={() => setShowAddCard(false)} color="red" />
                        </View>
                    </View>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        margin: 16,
    },
    input: {
        fontSize: 18,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 16,
    },
    idText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default App;