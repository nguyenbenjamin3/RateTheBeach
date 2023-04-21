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

const CreatePoll = ({addPoll, setShowCreatePoll}) => {
  // state to store the question and options
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  //function to add a new poll to the database
  function addPoll(question, options) {
    try {
      // Add a new document with a generated id.
      const pollsRef = addDoc(collection(db, 'polls'), {
        question: question,
        options: options,
      });
      console.log('Poll added with ID: ', pollsRef.id);
      setShowCreatePoll(false); // Hide the create poll form after adding the poll
    } catch (e) {
      console.error('Error adding poll: ', e);
    }
  }

  const handleAddPoll = () => {
    addPoll(
      question,
      options.filter(option => option !== ''),
    );
    setQuestion('');
    setOptions(['', '']);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new poll</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your question"
        value={question}
        onChangeText={setQuestion}
      />
      {options.map((option, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Option ${index + 1}`}
          value={option}
          onChangeText={value => handleOptionChange(value, index)}
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
