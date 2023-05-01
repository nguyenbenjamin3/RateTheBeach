import React, {useState} from 'react';
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

const CreatePoll = ({setShowCreatePoll}) => {
  // state to store the poll data
  const [poll, setPoll] = useState({
    question: '', // title of poll
    options: ['', ''], // array of options
    creator: '', // username or id of the poll creator
    createdAt: new Date(), // date and time when the poll was created
    lifetime: null, // timestamp for when the poll should expire
    upvotes: 0,
    downvotes: 0,
    pollId: '',
    link: '',
  });

  // function to add an empty option to the poll
  const handleAddOption = () => {
    setPoll(prevState => ({
      ...prevState,
      options: [...prevState.options, ''],
    }));
  };

  const handleCancel = () => {
    setShowCreatePoll(false);
  };

  // function to handle the change in the option text
  const handleOptionChange = (value, index) => {
    setPoll(prevState => {
      const newOptions = [...prevState.options];
      newOptions[index] = value;
      return {...prevState, options: newOptions};
    });
  };

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
      setShowCreatePoll(false); // Hide the create poll form after adding the poll

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
  //CHANGE THE FEATURES IN THIS FUNCTION TO CHANGE THE FEATURES OF THE POLLS
  const handleAddPoll = () => {
    const currentUser = auth.currentUser;
    const userId = currentUser ? currentUser.uid : null;

    addPollToDB({
      ...poll,
      options: poll.options.filter(option => option !== ''),
      creator: userId,
    });

    setPoll({
      question: '',
      options: ['', ''],
      creator: '',
      createdAt: new Date(),
      lifetime: null,
      upvotes: 0,
      downvotes: 0,
      pollId: '',
      link: '',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new poll</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your question"
        value={poll.question}
        onChangeText={text => setPoll({...poll, question: text})}
      />
      {poll.options.map((option, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Option ${index + 1}`}
          value={option}
          onChangeText={text => handleOptionChange(text, index)}
        />
      ))}
      <TouchableOpacity style={styles.button} onPress={handleAddOption}>
        <Text style={styles.buttonText}>Add Option</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAddPoll}>
        <Text style={styles.buttonText}>Add Poll</Text>
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
  cancelButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default CreatePoll;
