import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RoomsListScreen from 'RoomsList';
import CreateRoomScreen from 'CreateRooms';
import ChatScreen from 'ChatScreen';
import SetUsernameScreen from 'Username';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SetUsername">
                <Stack.Screen name="SetUsername"
                    component={SetUsernameScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RoomsList"
                    component={RoomsListScreen}
                    options={{
                        headerTitle: 'Chat Rooms',
                        headerShadowVisible: false
                    }}
                />
                <Stack.Screen name="CreateRoom" component={CreateRoomScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="Chat" component={ChatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
