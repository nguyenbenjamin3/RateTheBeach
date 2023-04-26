import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Poll from '../components/Poll';
import CreatePoll from '../components/CreatePoll';
import {useNavigation} from '@react-navigation/core'

import {collection, getDocs, orderBy, query} from 'firebase/firestore';
import {auth, db} from '../firebase';

const HomeScreen = () => {

  const navigation = useNavigation()
  
  const handleSignOut = () => {
    auth
    .signOut()
    .then(() => {
      navigation.replace("Login")
    })
    .catch(error => alert(error.message))
  } 
  //data for home screen to load
  const [feedData, setFeedData] = useState([]);

  //page number for pagination
  const [page, setPage] = useState(1);

  //state to show/hide the create poll form
  const [showCreatePoll, setShowCreatePoll] = useState(false);

  const loadMoreData = async () => {
    // Fetch data from your collection in descending order of createdAt timestamp
    const pollsRef = collection(db, 'polls');
    const pollsQuery = query(pollsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(pollsQuery);

    // Map over the array of documents to create an array of objects
    const newData = snapshot.docs.map(doc => {
      const pollData = doc.data();

      return {
        question: pollData.question,
        options: Object.values(pollData.options),
        createdAt: pollData.createdAt,
        lifetime: pollData.lifetime,
        downVotes: pollData.downVotes,
      };
    });

    setFeedData(newData);
    setPage(page + 1);
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  //function to add a new poll to the database
  const addPoll = async poll => {
    try {
      // Add a new document with a generated id.
      const pollsRef = await collection(db, 'polls');
      await addDoc(pollsRef, {...poll});
      setShowCreatePoll(false); // Hide the create poll form after adding the poll
    } catch (e) {
      console.error('Error adding poll:', e);
    }
  };

  return (
    <ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>      
      </TouchableOpacity>
      <Image source={require('../RateTheBeach.png')} style={styles.logo} />
      {/* Show the create poll form if showCreatePoll is true */}
      {showCreatePoll ? (
        <View style={styles.pollContainer}>
          <CreatePoll setShowCreatePoll={setShowCreatePoll} addPoll={addPoll} />
        </View>
      ) : (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            onPress={() => setShowCreatePoll(true)}
            style={styles.addButton}>
            <Text style={styles.addButtonTitle}>Add Poll</Text>
          </TouchableOpacity>
        </View>
      )}
      {feedData.map((item, index) => (
        <View key={index} style={styles.pollContainer}>
          <Poll
            question={item.question}
            options={item.options}
            createdAt={item.createdAt}
            lifetime={item.lifetime}
            downVotes={item.downVotes}
          />
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <Button title="Load More" onPress={loadMoreData} />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  logo: {
    width: 550,
    height: 250,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginBottom: 10,
  },
  pollContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  buttonContainer: {
    margin: 50,
  },
  addButtonContainer: {
    alignItems: 'center',
  },
  addButton: {
    width: 120,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6666e0',
    borderRadius: 12,
  },

  addButtonTitle: {
    color: 'white', // Set the text color here
    textAlign: 'center',

    fontSize: 18,
    fontWeight: 'bold',
  },
});
