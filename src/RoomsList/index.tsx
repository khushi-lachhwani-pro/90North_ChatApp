import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment-timezone';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const API_URL = 'https://chat-api-k4vi.onrender.com/';

export default function RoomsListScreen({ navigation }: any) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('CreateRoom')}>
          <AntDesign name="pluscircle" size={30} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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

  const handleJoinRoom = async (roomId: number, roomName: string) => {
    try {
      await AsyncStorage.multiSet([
        ['roomId', roomId.toString()],
        ['roomName', roomName],
      ]);
      navigation.navigate('Chat', { roomId, roomName });
    } catch (error) {
      Alert.alert('Error', 'Failed to join the room. Please try again.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  };


  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <FlatList
          data={rooms}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.roomItem}
              onPress={() => handleJoinRoom(item.id, item.name)}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <FontAwesome6 name='users-line' size={25} color={'#bcbcbc'}/>
              </View>
              <View style={{padding:10,flex:1}}>
                <Text style={styles.roomName}>{item.name}</Text>
                <Text style={styles.roomDate}>
                  {moment(item?.created_at).format('DD-MM-YYYY HH:mm')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noRooms}>No rooms available</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomItem: {
    backgroundColor: 'white',
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.3,
    flexDirection: 'row',
    gap: 10,
    padding: 10,},
  roomName: {
    flex:1,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  roomDate: {
    color: '#bcbcbc',
    fontStyle: 'italic',
    marginTop: 5,
  },
  noRooms: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});
