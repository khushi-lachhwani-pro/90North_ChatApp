import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'https://chat-api-k4vi.onrender.com/';

export default function CreateRoomScreen({ navigation }: any) {
    const [roomName, setRoomName] = useState('');
    const [loading, setLoading] = useState(false);


    const createRoom = async () => {
        if (!roomName.trim()) {
            Alert.alert('Error', 'Room name cannot be empty.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}chat/rooms`, { name: roomName });
            console.log(JSON.stringify(response));

            Alert.alert('Success', 'Room created successfully!');
            navigation.navigate('Chat', { roomId: response.data.id, roomName: response.data.name });
        } catch (error) {
            Alert.alert('Error', 'Failed to create room. Please try again.');
            console.error('Create Room Error:', error);
        } finally {
            setLoading(false);
        }
    };

  

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a New Room</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter room name"
                value={roomName}
                onChangeText={setRoomName}
            />
            <TouchableOpacity style={styles.createButton} onPress={createRoom} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Room'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10, backgroundColor: 'white' },
    createButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
