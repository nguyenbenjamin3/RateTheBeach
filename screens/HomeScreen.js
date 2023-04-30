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

  //const [showModal, setShowModal] = useState(false);

  const loadMoreData = async () => {
    // Fetch data from your collection in descending order of createdAt timestamp
    const pollsRef = collectionGroup(db, 'polls');
    const pollsQuery = query(pollsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(pollsQuery);

    // Map over the array of documents to create an array of objects
    const newData = snapshot.docs.map(doc => {
      const pollData = doc.data();
      //console.log(doc.id);
      //console.log(pollData.creator);
      const currentTime = new Date();

      // Check if the poll is expired
      if (pollData.lifetime && pollData.lifetime.toDate() < currentTime) {
        return null;
      }

      return {
        question: pollData.question,
        options: Object.values(pollData.options),
        createdAt: pollData.createdAt,
        pollId: doc.id,
        lifetime: pollData.lifetime,
        downVotes: pollData.downVotes,
        userId: pollData.creator,
      };
    });

    // Remove null values from the array
    const filteredData = newData.filter(item => item !== null);

    setFeedData(filteredData);
    setPage(page + 1);
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <ScrollView style={styles.scrollview}>
      <Image source={require('../RateTheBeach.png')} style={styles.logo} />
      {/* Show the create poll form if showCreatePoll is true */}
      {showCreatePoll ? (
        <View style={styles.pollContainer}>
          <CreatePoll setShowCreatePoll={setShowCreatePoll} />
        </View>
      ) : (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            onPress={() => setShowCreatePoll(true)}
            style={styles.addButton}>
            <Text style={styles.addButtonTitle}>Add Post</Text>
          </TouchableOpacity>
        </View>
      )}
      {feedData.map(
        (item, index) =>
          item && (
            <View key={index} style={styles.pollContainer}>
              <Poll
                question={item.question}
                options={item.options}
                createdAt={item.createdAt}
                pollId={item.pollId}
                lifetime={item.lifetime}
                downVotes={item.downVotes}
                userId={item.userId}
              />
            </View>
          ),
      )}

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
    marginTop: 10,
    marginBottom: 100,
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
  ScrollView: {
    marginBottom: 100,
  },

  addButtonTitle: {
    color: 'white', // Set the text color here
    textAlign: 'center',

    fontSize: 18,
    fontWeight: 'bold',
  },
});
