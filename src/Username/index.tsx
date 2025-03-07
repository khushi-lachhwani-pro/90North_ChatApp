import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LabelText from 'Components/Text/LabelText';
import FormTextField from 'Components/Text/FormTextField';
import ChatApp1 from '@assets/Images/Chatapp1.png';

const API_URL = 'https://chat-api-k4vi.onrender.com/';

export default function SetUsernameScreen({ navigation }: any) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleSetUsername = async () => {
        if (!username.trim()) {
            setError('Username cannot be empty');
            return;
        }
        if (username.length < 3 || username.length > 50) {
            setError('Username must be between 3 and 50 characters');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}chat/username`, { username });

            if (response.data && response.data.id) {
                await AsyncStorage.setItem('userId', response.data.id.toString());
                await AsyncStorage.setItem('username', response.data.username);
                navigation.replace('RoomsList');
            } else {
                Alert.alert('Error', 'Failed to register username');
            }
        } catch (error: any) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
            console.error('Registration Error:', error?.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <Image
                    source={ChatApp1}
                    style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
            </View>


            <View style={styles.card}>

                <LabelText text='Welcome to Chat App' styleProps={{ color: 'white', fontWeight: '700', textAlign: 'center', fontSize: 20 }} />
                <LabelText text='Set Your Username :' styleProps={{ color: 'white', fontWeight: '700', fontSize: 20 }} />
                <FormTextField
                    style={{ borderWidth: 1, borderColor: 'white', paddingHorizontal: 10, color: 'white', borderRadius: 10 }}
                    value={username}
                    placeholder='Enter your username'
                    placeholderTextColor={'white'}
                    onChangeText={(text) => (setUsername(text))} />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={[styles.button]}
                    onPress={handleSetUsername}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <LabelText text="Register" styleProps={{ color: 'black', fontWeight: '700' }} />
                    )}
                </TouchableOpacity>

            </View>



        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
    card: {
        height: '50%',
        backgroundColor: 'black',
        padding: 20,
        gap: 10,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});


