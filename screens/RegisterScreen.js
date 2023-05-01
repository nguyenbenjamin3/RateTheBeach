import {
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {auth, db} from '../firebase';
import {collection, addDoc} from 'firebase/firestore';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleRegister = () => {
    if (!/^[^\s@]+@(csulb|student\.csulb)\.edu$/.test(email)) {
      console.error('Invalid email');
      return;
    }
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log(`User created with email: ${user.email}`);

        // Add user to Firestore
        const usersRef = collection(db, 'users');
        addDoc(usersRef, {
          uid: user.uid,
          email: user.email,
          firstName: firstName,
          lastName: lastName,
        })
          .then(() => {
            console.log('User added to Firestore');
          })
          .catch(error => {
            console.error('Error adding user to Firestore:', error);
          });
      })
      .catch(error => {
        console.error('Error creating user:', error);
      });
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.logoContainer}>
        <Image source={require('../RateTheBeach.png')} style={styles.logo} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter CSULB Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.inputs}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.inputs}
          secureTextEntry
        />
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={text => setFirstName(text)}
          style={styles.inputs}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={text => setLastName(text)}
          style={styles.inputs}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  inputContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  inputs: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
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
  logoContainer: {
    marginTop: 0,
  },
  logo: {
    width: 550,
    height: 250,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginBottom: 10,
  },
});
