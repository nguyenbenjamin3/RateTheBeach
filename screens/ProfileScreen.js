import React from 'react';
import {useNavigation} from '@react-navigation/core'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';

const ProfileScreen = ({navigation}) => {

  const handleLogin = () => {
    navigation.navigate(LoginScreen);
  };

 
  const handleRegister = () => {
    navigation.navigate(RegisterScreen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>ProfileScreen</Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      
      
      
      </TouchableOpacity>
      </View>
     


      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      
      
      
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center', 
  },
  button: {
    backgroundColor: '#ffcd89',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16,
  },
});
