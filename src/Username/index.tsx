import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                navigation.navigate('RoomsList');
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
            <View style={styles.card}>
                <Text style={styles.title}>Welcome to Chat App</Text>
                <Text style={styles.label}>Enter your username:</Text>
                <TextInput
                    style={[styles.input, error ? styles.inputError : {}]}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={(text) => {
                        setUsername(text);
                        setError('');
                    }}
                    autoCapitalize="none"
                    maxLength={50} // Prevent input beyond 50 characters
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={[styles.button, loading ? styles.buttonDisabled : {}]}
                    onPress={handleSetUsername}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Register</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#666',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 10,
        fontSize: 16,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#aaa',
    },
});
