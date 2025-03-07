import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import FormTextField from '@Components/Text/FormTextField';
import LabelText from '@Components/Text/LabelText';
import Chatroom from '@assets/Images/Chatroom.jpg';

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

          //  Alert.alert('Success', 'Room created successfully!');
            navigation.navigate('Chat', { roomId: response.data.id, roomName: response.data.name });
        } catch (error) {
            Alert.alert('Error', 'Failed to create room. Please try again.');
            console.error('Create Room Error:', error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <>

            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={Chatroom} style={styles.image} />
                </View>
                <View style={styles.card}>
                    <LabelText text="Create Your Chat Room" styleProps={{ color: 'white', fontWeight: '700', textAlign: 'center', fontSize: 20 }} />
                    <LabelText text="Room Name :" styleProps={{ color: 'white', fontWeight: '700', fontSize: 20 }} />
                    <FormTextField
                        style={{ borderWidth: 1, borderColor: 'white', paddingHorizontal: 10, color: 'white', borderRadius: 10 }}
                        value={roomName}
                    //    placeholder="Enter your room name"
                        placeholderTextColor={'white'}
                        onChangeText={setRoomName}
                    />
                    <TouchableOpacity style={styles.createButton} onPress={createRoom} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Room'}</Text>
                    </TouchableOpacity>
                </View>
            </View>



        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black', 
    },
    imageContainer: {
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '80%',
        resizeMode: 'cover',
    },
    card: {
        height: '50%',
        backgroundColor: 'black',
        padding: 20,
        gap: 10,
        justifyContent: 'center',
    },
    createButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});
