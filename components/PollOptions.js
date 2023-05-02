import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PollOptions = ({ hasVoted, options, optionVotes, totalVotes, handleSelectOption, selectedOption, showResults}) => {
  const renderOption = (option, index) => {   
    //const votePercentage = totalVotes > 0 ? (optionVotes[index] / totalVotes) * 100 : 0;
 
    console.log('**************************');
    console.log('hasVoted =', hasVoted);
    console.log('optionVotes =', optionVotes);
    console.log('totalVotes =', totalVotes);
    console.log('**************************');


    if (hasVoted || showResults) {
     const votePercentage = totalVotes > 0 ? (optionVotes[index] / totalVotes) * 100 : 0;
      return (
        <View key={index} style={styles.optionContainer}>
          <View style={[styles.percentageBar, { width: `${votePercentage}%`, backgroundColor: '#007bff' }]} />
          <Text style={styles.optionText}>{option}</Text>
          <Text style={styles.percentageText}>{votePercentage.toFixed(1)}%</Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          key={index}
          style={[styles.option, selectedOption === option && styles.selectedOption]}
          onPress={() => handleSelectOption(option)}
        >
          <Text style={[styles.optionText, selectedOption === option && styles.selectedOptionText]}>{option}</Text>
        </TouchableOpacity>
      );
    }
  };

  return <>{options.map((option, index) => renderOption(option, index))}</>;
};

const styles = StyleSheet.create({
  optionContainer: {
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  percentageBar: {
    position: 'absolute',
    height: '100%',
  },
  optionText: {
    flex: 1,
  },
  percentageText: {
    padding: 10,
    fontWeight: 'bold',
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
  selectedOptionText: {
    fontWeight: 'bold',
  },
});

export default PollOptions;
