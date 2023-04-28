import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import Tabs from './navigation/tabs';
import DisplayScreens from './navigation/DisplayScreens';
import RegisterScreen from './screens/RegisterScreen';
import SearchScreen from './screens/SearchScreen';
import OnboardingScreen from './screens/OnboardingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'OnboardingScreen'}>
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{header: () => null}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{header: ({navigation}) => null}}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={({navigation}) => ({header: () => null})}
          />
          <Stack.Screen
            name="DisplayScreens"
            component={DisplayScreens}
            options={{header: () => null}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
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
