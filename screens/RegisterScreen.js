import {KeyboardAvoidingView, TouchableOpacity, StyleSheet, Text, TextInput, View, Button, Image} from 'react-native';
import  React, {useState} from 'react';
import {auth} from '../firebase'

const RegisterScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
 
  const handleRegister = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log(user.email);
    })
    .catch(error => alert(error.message))
  } 
  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior="padding"
  >
        <View style={styles.logoContainer}>
        <Image source={require('../RateTheBeach.png')} style={styles.logo} />
      </View>
    <View style={styles.inputContainer}>
      <TextInput
          placeholder = "Enter CSULB Email"
          value = {email}
          onChangeText={text => setEmail(text)}
          style = {styles.inputs}
      />
      <TextInput
           placeholder = "Password"
           value = {password}
           onChangeText={text => setPassword(text)}
           style = {styles.inputs}
           secureTextEntry/>
    </View>

    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress = {handleRegister}
        style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

    </View>
  </KeyboardAvoidingView>
)
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


