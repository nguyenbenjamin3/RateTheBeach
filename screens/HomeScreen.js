//import {
//  StyleSheet,
//  Text,
//  View,
//  Image,
//  ScrollView,
//  Button,
//  TouchableOpacity,
//} from 'react-native';
//import React, {useState, useEffect} from 'react';
//import Poll from '../components/Poll';
//import CreatePoll from '../components/CreatePoll';
//import {
//  doc,
//  collection,
//  collectionGroup,
//  getDocs,
//  orderBy,
//  query,
//} from 'firebase/firestore';
//import {db, auth} from '../firebase';
//
//const HomeScreen = () => {
//  //data for home screen to load
//  const [feedData, setFeedData] = useState([]);
//
//  //page number for pagination
//  const [page, setPage] = useState(1);
//
//  // manages the poll model options
//  const [showPollTypeSelection, setShowPollTypeSelection] = useState(false);
//
//  //state to show/hide the create poll form
//  const [showCreatePoll, setShowCreatePoll] = useState(false);
//
//  const loadMoreData = async () => {
//    // Fetch data from your collection in descending order of createdAt timestamp
//    const pollsRef = collectionGroup(db, 'polls');
//    const pollsQuery = query(pollsRef, orderBy('createdAt', 'desc'));
//    const snapshot = await getDocs(pollsQuery);
//
//    // Map over the array of documents to create an array of objects
//    const newData = snapshot.docs.map(doc => {
//      const pollData = doc.data();
//      const currentTime = new Date();
//
//      // Check if the poll is expired
//      if (pollData.lifetime && pollData.lifetime.toDate() < currentTime) {
//        return null;
//      }
//
//      return {
//        question: pollData.question,
//        options: Object.values(pollData.options),
//        createdAt: pollData.createdAt,
//        pollId: doc.id,
//        lifetime: pollData.lifetime,
//        downVotes: pollData.downVotes,
//        userId: auth.currentUser.uid,
//      };
//    });
//
//    // Remove null values from the array
//    const filteredData = newData.filter(item => item !== null);
//
//    setFeedData(filteredData);
//    setPage(page + 1);
//  };
//
//  useEffect(() => {
//    loadMoreData();
//  }, []);
//
//  return (
//    <ScrollView>
//      <Image source={require('../RateTheBeach.png')} style={styles.logo} />
//      {/* Show the create poll form if showCreatePoll is true */}
//      {showCreatePoll ? (
//        <View style={styles.pollContainer}>
//          <CreatePoll setShowCreatePoll={setShowCreatePoll} />
//        </View>
//      ) : (
//        <View style={styles.addButtonContainer}>
//          <TouchableOpacity
//            //onPress={() => setShowCreatePoll(true)}
//            onPress={() => setShowPollTypeSelection(true)}
//            style={styles.addButton}>
//            <Text style={styles.addButtonTitle}>Add Poll</Text>
//          </TouchableOpacity>
//        </View>
//      )}
//      {feedData.map((item, index) => (
//        <View key={index} style={styles.pollContainer}>
//          <Poll
//            question={item.question}
//            options={item.options}
//            createdAt={item.createdAt}
//            pollId={item.pollId}
//            lifetime={item.lifetime}
//            downVotes={item.downVotes}
//            userId={item.userId} //figure out how to access current user id
//          />
//        </View>
//      ))}
//      <View style={styles.buttonContainer}>
//        <Button title="Load More" onPress={loadMoreData} />
//      </View>
//    </ScrollView>
//  );
//};
//
//export default HomeScreen;
//
//const styles = StyleSheet.create({
//  logo: {
//    width: 550,
//    height: 250,
//    resizeMode: 'cover',
//    alignSelf: 'center',
//    marginBottom: 10,
//  },
//  pollContainer: {
//    borderWidth: 1,
//    borderColor: 'gray',
//    borderRadius: 10,
//    padding: 10,
//    margin: 10,
//    backgroundColor: 'white',
//    alignItems: 'center',
//  },
//  buttonContainer: {
//    margin: 50,
//  },
//  addButtonContainer: {
//    alignItems: 'center',
//  },
//  addButton: {
//    width: 120,
//    height: 35,
//    alignItems: 'center',
//    justifyContent: 'center',
//    backgroundColor: '#6666e0',
//    borderRadius: 12,
//  },
//
//  addButtonTitle: {
//    color: 'white', // Set the text color here
//    textAlign: 'center',
//
//    fontSize: 18,
//    fontWeight: 'bold',
//  },
//});

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Poll from '../components/Poll';
import CreatePoll from '../components/CreatePoll';
import CreateRating from '../components/CreateRating';
import {
  doc,
  collection,
  collectionGroup,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import {db, auth} from '../firebase';

const HomeScreen = () => {
  //data for home screen to load
  const [feedData, setFeedData] = useState([]);

  //page number for pagination
  const [page, setPage] = useState(1);

  //state to show/hide the create poll form
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showCreateRating, setShowCreateRating] = useState(false);

  //state to show/hide poll type selection modal
  const [showModal, setShowModal] = useState(false);

  const loadMoreData = async () => {
  // Fetch data from your collection in descending order of createdAt timestamp
  const pollsRef = collectionGroup(db, 'polls');
  const pollsQuery = query(pollsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(pollsQuery);

  // Map over the array of documents to create an array of objects
  const newData = snapshot.docs.map(doc => {
    const pollData = doc.data();
    const currentTime = new Date();

    // Check if the poll is expired
    if (pollData.lifetime && pollData.lifetime.toDate && pollData.lifetime.toDate() < currentTime) {
      return null;
    }

    return {
      question: pollData.question,
      options: pollData.options,
      createdAt: pollData.createdAt,
      pollId: doc.id,
      lifetime: pollData.lifetime,
      upvotes: pollData.upvotes,
      downvotes: pollData.downvotes,
      userId: auth.currentUser.uid,
    };
  });

  // Remove null values from the array
  const filteredData = newData.filter(item => item !== null);

  // Add a console.log statement to check the fetched data
  console.log('Fetched data:', newData);

  setFeedData(filteredData);
  setPage(page + 1);
};

    useEffect(() => {
      loadMoreData();
    }, [refreshFeed]);

  const handleAddPollPress = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const refreshFeed = () => {
    setPage(1);
    loadMoreData();
  };

  return (
    <ScrollView>
      <Image source={require('../RateTheBeach.png')} style={styles.logo} />
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select Poll Type</Text>
          <TouchableOpacity
            onPress={() => {
              setShowCreatePoll(true);
              closeModal();
            }}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Create Poll</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowCreateRating(true);
              closeModal();
            }}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Create Rating Poll</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {showCreatePoll && (
          <View style={styles.pollContainer}>
            <CreatePoll setShowCreatePoll={setShowCreatePoll} refreshFeed={refreshFeed} />
          </View>
        )}
        {showCreateRating && (
          <View style={styles.pollContainer}>
            <CreateRating setShowCreateRating={setShowCreateRating} refreshFeed={refreshFeed} />
          </View>
        )}
        {feedData.map((poll, index) => (
          <View key={index} style={styles.pollContainer}>
            <Poll data={poll} />
          </View>
        ))}
      <Button title="Load More" onPress={loadMoreData} />
      <TouchableOpacity
        style={styles.addPollButton}
        onPress={handleAddPollPress}>
        <Text style={styles.addPollButtonText}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    logo: {
      width: '100%',
      height: 100,
      resizeMode: 'contain',
    },
    pollContainer: {
      marginBottom: 20,
    },
    addPollButton: {
      backgroundColor: '#1c313a',
      borderRadius: 50,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 30,
      right: 30,
    },
    addPollButtonText: {
      color: 'white',
      fontSize: 30,
    },
    modalView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalTitle: {
      fontSize: 24,
      marginBottom: 20,
      color: 'white',
    },
    modalButton: {
      backgroundColor: '#1c313a',
      borderRadius: 25,
      width: '70%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    modalButtonText: {
      color: 'white',
      fontSize: 16,
    },
});

export default HomeScreen;

