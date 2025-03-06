import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from 'Routes';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
