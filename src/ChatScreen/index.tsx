import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const WS_URL = 'wss://chat-api-k4vi.onrender.com/ws';
const API_URL = 'https://chat-api-k4vi.onrender.com';

export default function ChatScreen({ navigation, route }) {
    const { roomId, roomName } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef(null);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsername = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            setUsername(storedUsername || '');
        };
        fetchUsername();
    }, []);

    useEffect(() => {
        const setupWebSocket = async () => {
            if (socketRef.current) {
                socketRef.current.close(); // Close existing WebSocket before creating a new one
            }

            const storedUsername = await AsyncStorage.getItem('username');
            const ws = new WebSocket(`${WS_URL}/${roomId}/${storedUsername}`);
            socketRef.current = ws;

            ws.onopen = () => {
                console.log('Connected to WebSocket');
                ws.send(JSON.stringify({ event: 'join', username: storedUsername }));
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages((prev) => {
                    if (data.event === 'message' && data.message?.content?.trim()) {
                        return [...prev, {
                            content: data.message.content,
                            sender: data.message.username,
                            created_at: data.message.created_at
                        }];
                    } else if (data.event === 'join') {
                        return [...prev, { system: true, content: `${data.username} joined the chat` }];
                    } else if (data.event === 'leave') {
                        return [...prev, { system: true, content: `${data.username} left the chat` }];
                    }
                    return prev;
                });
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket Disconnected');
            };
        };

        const fetchPreviousMessages = async () => {
            try {
                const response = await axios.get(`${API_URL}/chat/rooms/${roomId}/messages?limit=10`);
                if (response.data && Array.isArray(response.data)) {
                    setMessages(response.data.reverse().map(msg => ({
                        content: msg.content,
                        sender: msg.username,
                        created_at: msg.created_at
                    })));
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error('Error fetching previous messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreviousMessages();
        setupWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.send(JSON.stringify({ event: 'leave', username }));
                socketRef.current.close();
            }
        };
    }, [roomId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ event: 'message', content: newMessage, sender: username }));
            setNewMessage('');
        } else {
            console.error("WebSocket is not connected.");
        }
    };

    useEffect(() => {
        navigation.setOptions({ headerTitle: roomName });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    if (item.system) {
                        return <Text style={styles.systemMessage}>{item.content}</Text>;
                    }
                    const isMyMessage = item.sender === username;
                    return (
                        <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
                            <Text style={[styles.sender, isMyMessage ? { color: 'white' } : { color: 'black' }]}>
                                {item.sender}:
                            </Text>
                            <Text style={[styles.message, isMyMessage ? { color: 'white' } : { color: 'black' }]}>
                                {item.content}
                            </Text>
                        </View>
                    );
                }}
                ListEmptyComponent={() => loading ? <Text style={styles.loadingText}>Loading messages...</Text> :
                    <View style={styles.emptyContainer}><Text style={styles.emptyText}>No messages yet. Start the conversation!</Text></View>
                }
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message"
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
    messageContainer: { borderRadius: 10, marginVertical: 5 },
    loadingText: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 20 },
    myMessage: { alignSelf: 'flex-end', backgroundColor: '#007bff', padding: 10, borderRadius: 10 },
    otherMessage: { alignSelf: 'flex-start', backgroundColor: 'white', padding: 10, borderRadius: 10 },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 20 },
    emptyText: { fontSize: 16, color: '#888', fontStyle: 'italic' },
    sender: { fontWeight: 'bold', marginBottom: 3 },
    inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#ccc' },
    input: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
    sendButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginLeft: 5 },
    sendText: { color: 'white', fontWeight: 'bold' },
    systemMessage: { textAlign: 'center', fontSize: 14, color: '#555', fontStyle: 'italic', marginVertical: 5 }
});