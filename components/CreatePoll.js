import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {collection, addDoc} from 'firebase/firestore';
import {db} from '../firebase';

const CreatePoll = ({setShowCreatePoll}) => {
  // state to store the question and options
  const [poll, setPoll] = useState({
    question: '', // title of poll
    options: ['', ''], // array of options
    creator: '', // username or id of the poll creator
    createdAt: new Date(), // date and time when the poll was created
    lifetime: null, // timestamp for when the poll should expire
    upvotes: 0,
    downvotes: 0,
    comments: [], // array of comments with their own sub-fields
    category: '', // category of the poll, e.g. 'food', 'politics', 'sports'
    type: '', // type of poll, either 'rating' or 'polling'
  });

  // function to add an empty option to the poll
  const handleAddOption = () => {
    setPoll(prevState => ({
      ...prevState,
      options: [...prevState.options, ''],
    }));
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
      // Add a new document with a generated id.
      const pollsRef = await addDoc(collection(db, 'polls'), poll);
      console.log('Poll added with ID: ', pollsRef.id);
      setShowCreatePoll(false); // Hide the create poll form after adding the poll
    } catch (e) {
      console.error('Error adding poll: ', e);
    }
  };

  // function to handle the add poll button
  const handleAddPoll = () => {
    addPollToDB({
      ...poll,
      options: poll.options.filter(option => option !== ''),
    });
    setPoll({
      question: '',
      options: ['', ''],
      creator: '',
      createdAt: new Date(),
      lifetime: null,
      upvotes: 0,
      downvotes: 0,
      comments: [],
      category: '',
      type: '',
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
});

export default CreatePoll;
