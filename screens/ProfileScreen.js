import {useContext} from 'react';
import {useNavigation} from '@react-navigation/core';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import OnboardingScreen from './OnboardingScreen';
import { getAuth } from 'firebase/auth';
import { auth } from '../firebase';
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

var admin = require("firebase-admin");
var serviceAccount = require("path/to/serviceAccountKey.json");
initializeApp();
const db = getFirestore();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const ProfileScreen = ({navigation}) => {
  const auth2 = getAuth();
  const user = auth2.currentUser;

  const handleSignOut = () => {
    auth
    .signOut()
    .then(() => {
      navigation.navigate('Onboarding')

    })
    .catch(error => alert(error.message))
  }
  console.log(user.uid)
  // auth2
  // .getUser(user.uid)
  // .then((userRecord) => {
  //   // See the UserRecord reference doc for the contents of userRecord.
  //   console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
  // })
  // .catch((error) => {
  //   console.log('Error fetching user data:', error);
  // });
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Page {user.displayName}</Text>
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
