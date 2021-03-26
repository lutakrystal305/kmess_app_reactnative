import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { Provider } from 'react-redux';
import store from './storeRedux';
import { NavigationContainer } from '@react-navigation/native';
import { createSwitchNavigator } from '@react-navigation/compat';
import { AuthStack, AppStack } from './navigator/';
import AuthLoading from './components/Loading/AuthLoading';


export default function App() {
  
  const RootNavigator = 
    createSwitchNavigator({
      AuthLoading: AuthLoading,
      App: AppStack,
      Auth: AuthStack
    }, {
      initialRouteName: 'AuthLoading'
    })
  
  return (
    <Provider store={store}>
      <NavigationContainer style={styles.container}>
          <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
