//will eventually come from login screen, won't actually be part of navbar

import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import {auth} from '../firebase'
import { Button } from 'react-native-paper';
import {useState} from 'react'
import { black } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';


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
    <KeyboardAvoidingView>
      <View>
        <TextInput
        placeholder = "Elbee.Shark@csulb.edu"
        ></TextInput>
        <TextInput
        placeholder = "Enter a password"
        ></TextInput>
        <TextInput
        placeholder = "Re-enter password"
        ></TextInput>
        <Button
          onPress = {handleRegister}
          title = "Register"
          textColor = "black"
          
          

        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
