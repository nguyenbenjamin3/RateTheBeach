import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {collection, query, where, getDocs, deleteDoc} from 'firebase/firestore';
import {auth, db} from '../firebase';

const Liked = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      const q = query(
        collection(db, 'polls'),
        where('creator', '==', auth.currentUser.uid),
      );
      const querySnapshot = await getDocs(q);
      const fetchedPolls = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPolls(fetchedPolls);
    };
    fetchPolls();
  }, []);

  const handleDeletePoll = async id => {
    try {
      await deleteDoc(collection(db, 'polls', id));
      setPolls(polls.filter(poll => poll.id !== id));
      console.log('Poll successfully deleted!');
    } catch (error) {
      console.error(error);
    }
  };

  const renderPoll = ({item}) => {
    const createdAtTime = new Date(item.createdAt.toDate()).toLocaleString();

    return (
      <View style={styles.pollContainer}>
        <Text style={styles.pollQuestion}>{item.question}</Text>

        {item.options.map((option, index) => (
          <View key={index} style={styles.optionContainer}>
            <Text style={styles.optionText}>{option}</Text>
          </View>
        ))}

        <Text>{`Created at: ${createdAtTime}`}</Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePoll(item.id)}>
          <Text style={styles.deleteButtonText}>Delete Poll</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={polls}
        renderItem={renderPoll}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => <Text>You have not created any polls.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  pollContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  pollQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
  },
  optionText: {
    flex: 1,
  },
  votes: {
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Liked;
