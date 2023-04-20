//will eventually come from login screen, won't actually be part of navbar

import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-gesture-handler';

const RegisterScreen = () => {
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
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
