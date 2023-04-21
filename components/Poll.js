import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Poll = ({question, options}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);

  const handleSelectOption = option => {
    setSelectedOption(option);
  };

  const handleVote = () => {
    fetch(`https://api.example.com/poll/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        option: selectedOption,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setTotalVotes(data.totalVotes);
      })
      .catch(error => console.error(error));
  };

  return (
    <View>
      <Text style={styles.question}>{question}</Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedOption === option && styles.selectedOption,
          ]}
          onPress={() => handleSelectOption(option)}>
          <Text
            style={[
              styles.optionText,
              selectedOption === option && styles.selectedOptionText,
            ]}>
            {option}
          </Text>
          <Text style={styles.votes}>{`${totalVotes} votes`}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={handleVote}
        disabled={!selectedOption}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  option: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  selectedOption: {
    backgroundColor: '#aaffaa',
    borderColor: '#00aa00',
  },
  optionText: {
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  votes: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Poll;
