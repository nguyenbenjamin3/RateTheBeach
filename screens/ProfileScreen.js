import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {auth, db} from '../firebase';
import {collection, getDocs} from 'firebase/firestore';

const ProfileScreen = ({navigation}) => {
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          if (userData.uid === auth.currentUser.uid) {
            setUserFirstName(userData.firstName);
            setUserLastName(userData.lastName);
            setUserEmail(userData.email);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [auth.currentUser.uid]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate('Onboarding');
      })
      .catch(error => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>ProfileScreen</Text>
      <Text
        style={
          styles.nameText
        }>{`First Name: ${userFirstName} \nLast Name: ${userLastName} \nEmail: ${userEmail}`}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
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
  nameText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
