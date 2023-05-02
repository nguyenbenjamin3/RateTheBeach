import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {collection, addDoc, updateDoc, doc} from 'firebase/firestore';
import {db} from '../firebase';
import {auth} from '../firebase';

const CreateRating = ({setShowCreateRating}) => {
  const [ratingRange, setRatingRange] = useState({ min: 1, max: 5});
  // state to store the poll data
  const [poll, setPoll] = useState({
    question: '',
    options: Array.from(
      { length: ratingRange.max - ratingRange.min + 1 },
      (_, i) => i + ratingRange.min
    ),
    selectedRating: null,
    creator: '',
    createdAt: new Date(),
    lifetime: null,
    upvotes: 0,
    pollId: '',
    showResults: false,
  });

  const handleCancel = () => {
    setShowCreateRating(false);
  };

  const updateLifetime = async (pollId, upvotes) => {
    if (upvotes > 50) {
      try {
        await updateDoc(doc(db, 'polls', pollId), {
          lifetime: null, // setting the lifetime to null will make the poll last forever
        });
      } catch (e) {
        console.error('Error updating poll lifetime: ', e);
      }
    }
  };

  useEffect(() => {
    if (poll.pollId && poll.upvotes > 50) {
      updateLifetime(poll.pollId, poll.upvotes);
    }
  }, [poll.upvotes]);

  useEffect(() => {
    setPoll((prevState) => ({
      ...prevState,
      options: Array.from(
        { length: ratingRange.max - ratingRange.min + 1 },
        (_, i) => i + ratingRange.min
      ),
    }));
  }, [ratingRange]);

    //function to add a new poll to the database
    const addPollToDB = async poll => {
      try {
        const lifetimeInHours = 24;
        const endTime = new Date(Date.now() + lifetimeInHours * 60 * 60 * 1000);

        const pollWithEndTime = {
          ...poll,
          lifetime: endTime,
        };
        // Add a new document with a generated id.
        const pollsRef = await addDoc(collection(db, 'polls'), pollWithEndTime);
        console.log('Poll added with ID: ', pollsRef.id);

        // Hide the create poll form after adding the poll
        setShowCreateRating(false);

        // Update the document with the pollId
        await updateDoc(doc(db, 'polls', pollsRef.id), {
          pollId: pollsRef.id,
        });

        const userRef = collection(db, 'users');
        const userId = userRef.id;
        setPoll(prevState => ({...prevState, creator: userId}));
      } catch (e) {
        console.error('Error adding poll: ', e);
      }
    };

  // function to handle the add poll button
  const handleAddPoll = () => {
    const currentUser = auth.currentUser;
    const userId = currentUser ? currentUser.uid : null;

  // Function to handle rating button press
  const handleRatingPress = rating => {
    setPoll({...poll, selectedRating: rating});
  };

    addPollToDB({
      ...poll,
      creator: userId,
    });

    setPoll({
      question: '',
      options: [1, 2, 3, 4, 5],
      creator: '',
      createdAt: new Date(),
      lifetime: null,
      upvotes: 0,
      pollId: '',
      showResults: false,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new rating poll</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your question"
        value={poll.question}
        onChangeText={(text) => setPoll({ ...poll, question: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Minimum Rating (default: 1)"
        keyboardType="numeric"
        onChangeText={(text) => setRatingRange({ ...ratingRange, min: parseInt(text) || 1 })}
      />
      <TextInput
        style={styles.input}
        placeholder="Maximum Rating (default: 5)"
        keyboardType="numeric"
        onChangeText={(text) => {
          const maxValue = parseInt(text) || 5;
          setRatingRange({ ...ratingRange, max: maxValue > 10 ? 10 : maxValue });
        }}
      />
      <View style={styles.ratingContainer}>
        {poll.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.ratingButton}
            onPress={() => handleRatingPress(option)}
          >
            <Text style={styles.ratingButtonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddPoll}>
        <Text style={styles.buttonText}>Add Rating</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
  
};

const styles = StyleSheet.create({
    container: {
      padding: 10,
      margin: 10,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: 'gray',
      backgroundColor: 'white',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderRadius: 5,
      borderColor: 'gray',
      padding: 10,
      marginBottom: 10,
    },
    cancelButton: {
      backgroundColor: '#f44336',
      borderRadius: 5,
      padding: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    button: {
      backgroundColor: '#2196F3',
      borderRadius: 5,
      padding: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    radioLabel: {
      marginRight: 10,
    },
    radioValue: {
      fontWeight: 'bold',
    },
});

export default CreateRating;