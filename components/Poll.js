//import React, {useState, useEffect} from 'react';
//import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
//import {collection, addDoc, query, where, getDocs} from 'firebase/firestore';
//import {db} from '../firebase';
//
//const Poll = ({pollId, userId, question, options, createdAt, downVotes}) => {
//  const [selectedOption, setSelectedOption] = useState(null);
//  const [totalVotes, setTotalVotes] = useState(0);
//
//  //  const createdAtTime = new Date(createdAt.toDate()).toLocaleString();
//  const createdAtTime = createdAt && createdAt.toDate ? new Date(createdAt.toDate()).toLocaleString() : 'N/A';
//
//
//  const handleSelectOption = option => {
//    setSelectedOption(option);
//  };
//
//  const handleVote = async () => {
//    try {
//      const voteRef = collection(db, 'votes');
//      const docId = `${pollId}-${userId}`;
//      const voteQuery = query(
//        voteRef,
//        where('pollId', '==', pollId),
//        where('userId', '==', userId),
//      );
//      const voteSnapshot = await getDocs(voteQuery);
//      if (voteSnapshot.size > 0) {
//        console.log('User has already voted for this poll');
//        return;
//      }
//      if (pollId && selectedOption) {
//        console.log('pollId and selectedOption are not null');
//        await addDoc(
//          voteRef,
//          {
//            pollId: pollId,
//            userId: userId,
//            option: selectedOption,
//          },
//          docId,
//        );
//        setTotalVotes(totalVotes + 1);
//      } else {
//        console.log('pollId or selectedOption is null');
//      }
//    } catch (error) {
//      console.error(error);
//    }
//  };
//
//  return (
//    <View>
//      <Text style={styles.question}>{question}</Text>
//
//      {options.map((option, index) => (
//        <TouchableOpacity
//          key={index}
//          style={[
//            styles.option,
//            selectedOption === option && styles.selectedOption,
//          ]}
//          onPress={() => handleSelectOption(option)}>
//          <Text
//            style={[
//              styles.optionText,
//              selectedOption === option && styles.selectedOptionText,
//            ]}>
//            {option}
//          </Text>
//
//          <Text style={styles.votes}>{`${totalVotes} votes`}</Text>
//          <Text style={styles.votes}>{`${downVotes} downvotes`}</Text>
//        </TouchableOpacity>
//      ))}
//      <TouchableOpacity
//        style={styles.button}
//        onPress={handleVote}
//        disabled={!selectedOption}>
//        <Text style={styles.buttonText}>Submit</Text>
//      </TouchableOpacity>
//      <Text>{`Created at: ${createdAtTime}`}</Text>
//    </View>
//  );
//};
//
//const styles = StyleSheet.create({
//  question: {
//    fontSize: 18,
//    fontWeight: 'bold',
//    color: 'black',
//    marginBottom: 10,
//    justifyContent: 'center',
//    alignItems: 'center',
//  },
//  option: {
//    padding: 10,
//    borderWidth: 2,
//    borderColor: '#ccc',
//    borderRadius: 5,
//    marginBottom: 10,
//    flexDirection: 'row',
//    justifyContent: 'flex-start',
//  },
//  selectedOption: {
//    backgroundColor: '#aaffaa',
//    borderColor: '#00aa00',
//  },
//  optionText: {
//    flex: 1,
//  },
//  selectedOptionText: {
//    fontWeight: 'bold',
//  },
//  votes: {
//    marginLeft: 10,
//  },
//  button: {
//    backgroundColor: '#007bff',
//    padding: 10,
//    borderRadius: 5,
//    marginTop: 10,
//  },
//  buttonText: {
//    color: '#fff',
//    textAlign: 'center',
//  },
//});
//
//export default Poll;


import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {collection, addDoc, query, where, getDocs} from 'firebase/firestore';
import {db} from '../firebase';

const Poll = ({pollId, userId, question, options = [], createdAt, downVotes}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);

  const createdAtTime = createdAt && createdAt.toDate ? new Date(createdAt.toDate()).toLocaleString() : 'N/A';

  const handleSelectOption = option => {
    setSelectedOption(option);
  };

  const handleVote = async () => {
    try {
      const voteRef = collection(db, 'votes');
      const docId = `${pollId}-${userId}`;
      const voteQuery = query(
        voteRef,
        where('pollId', '==', pollId),
        where('userId', '==', userId),
      );
      const voteSnapshot = await getDocs(voteQuery);
      if (voteSnapshot.size > 0) {
        console.log('User has already voted for this poll');
        return;
      }
      if (pollId && selectedOption) {
        console.log('pollId and selectedOption are not null');
        await addDoc(
          voteRef,
          {
            pollId: pollId,
            userId: userId,
            option: selectedOption,
          },
          docId,
        );
        setTotalVotes(totalVotes + 1);
      } else {
        console.log('pollId or selectedOption is null');
      }
    } catch (error) {
      console.error(error);
    }
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
          <Text style={styles.votes}>{`${downVotes} downvotes`}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={handleVote}
        disabled={!selectedOption}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <Text>{`Created at: ${createdAtTime}`}</Text>
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
