import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://chat-api-k4vi.onrender.com/';

export default function RoomsListScreen({ navigation }: any) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [])
  );

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}chat/rooms`);
      setRooms(response?.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch rooms.');
      console.error('Fetch Rooms Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string, roomName: string) => {
    try {
      await AsyncStorage.multiSet([
        ['roomId', roomId],
        ['roomName', roomName],
      ]);
      navigation.navigate('Chat', { roomId, roomName });
    } catch (error) {
      Alert.alert('Error', 'Failed to join the room. Please try again.');
    }
  };


  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Available Chat Rooms</Text> */}

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item:any) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.roomItem}
              onPress={() => handleJoinRoom(item.id, item.name)}
            >
              <Text style={styles.roomName}>{item.name}</Text>
              <Text style={styles.joinText}>Join</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noRooms}>No rooms available</Text>}
        />
      )}

      <TouchableOpacity
        style={[styles.createRoomButton, loading && styles.disabledButton]}
        onPress={() => !loading && navigation.navigate('CreateRoom')}
        disabled={loading}
      >
        <Text style={styles.createRoomText}>Create Room</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  roomItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  roomName: {
    fontSize: 18,
    color: '#333',
  },
  joinText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  noRooms: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  createRoomButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createRoomText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
});
