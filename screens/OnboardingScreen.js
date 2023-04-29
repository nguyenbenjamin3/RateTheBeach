import React from 'react';
import {View, Text, Button, StyleSheet, Image,SafeAreaView,TouchableOpacity} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const OnboardingScreen = ({navigation}) => {
    return (
      
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
          <View style={styles.logoContainer}>
        <Image source={require('../RateTheBeach.png')} style={styles.logo} />
      </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#ffcd89',
            padding: 20,
            width: '90%',
            borderRadius: 10,
            marginBottom: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={() => navigation.navigate('Login')}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              textAlign: 'center',
              fontWeight: 'bold',
              fontFamily: 'Roboto-MediumItalic',
            }}>
            Let's Rate!
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };
  
  export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,

  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
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

