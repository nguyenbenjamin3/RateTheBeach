import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import OnboardingScreen from './OnboardingScreen';
import { auth } from '../firebase';

const ProfileScreen = ({navigation}) => {


const handleSignOut = () => {
  auth
  .signOut()
  .then(() => {
    navigation.navigate('Onboarding')

  })
  .catch(error => alert(error.message))
}


  return (
    <View style={styles.container}>
      <Text style={styles.text}>ProfileScreen</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} 
        onPress = {handleSignOut}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
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
