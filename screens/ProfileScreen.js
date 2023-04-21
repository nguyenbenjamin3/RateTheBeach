import React from 'react';
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#ffcd89',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
