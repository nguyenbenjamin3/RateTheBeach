import {KeyboardAvoidingView, TouchableOpacity, StyleSheet, Text, TextInput, View, Button,Image} from 'react-native';
import {useNavigation} from '@react-navigation/core'
import  {useState, React, useEffect} from 'react';
import {auth} from '../firebase'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate("Home")
      }   
    })
      return unsubscribe
  }, [])
 
  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress = {handleLogin}
          style={styles.button}

        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
};

export default LoginScreen;

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