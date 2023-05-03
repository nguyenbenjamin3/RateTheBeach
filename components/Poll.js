import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import PollOptions from './PollOptions'
import {db} from '../firebase';
import {Alert} from 'react-native';

const Poll = ({pollId, userId, question, options, createdAt, upvotes, showResults, expiresAt, lifetimeInHours}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');

  const [optionVotes, setOptionVotes] = useState(new Array(options.length).fill(0));
  const [hasVoted, setHasVoted] = useState(false);
  //const [showResults, setShowResults] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(upvotes || 0);

  const [link, setLink] = useState('');
  console.log(lifetimeInHours);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          if (userData.uid === userId) {
            setUserFirstName(userData.firstName);
            setUserLastName(userData.lastName);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [userId]);


  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const upvotePoll = async () => {
    if (upvoted) {
      console.log('User has already upvoted this poll');
      return;
    } else {
      handleUpVote();
    }
  };

  const handleLink = () => {
    const baseUrl = 'https://RateTheBeach.com/poll/';
    const pollUrl = `${baseUrl}${pollId}`;
    setLink(pollUrl);
    Alert.alert('Poll Link', pollUrl);
  };

  const handleUpVote = async () => {
    try {
      // Add a new document to the upvotes collection with the pollId and userId
      const upvotesRef = collection(db, 'upvotes');
      const newUpvoteDoc = {
        pollId: pollId,
        userId: userId,
      };
      await addDoc(upvotesRef, newUpvoteDoc);

      setUpvoteCount(upvoteCount + 1);
      setUpvoted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const hasUserMadeAVote = async () => {
    try{
      const voteRef = collection(db, 'votes');
      const voteQuery = query(
        voteRef,
        where('pollId', '==', pollId),
        where('userId', '==', userId),
      );
      const alreadyVotedSnapshot = await getDocs(voteQuery);
      if (alreadyVotedSnapshot.size > 0) {
        showResults = true;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    const checkUpvoteStatus = async () => {
      try {
        const upvotesRef = collection(db, 'upvotes');
        const upvoteQuery = query(
          upvotesRef,
          where('pollId', '==', pollId),
          where('userId', '==', userId),
        );
        const upvoteSnapshot = await getDocs(upvoteQuery);
        if (upvoteSnapshot.size > 0) {
          setUpvoted(true);
        }
        // this fetches the total upvote count for the poll
        const totalUpvotesQuery = query(upvotesRef, where('pollId', '==', pollId));
        const totalUpvotesSnapshot = await getDocs(totalUpvotesQuery);
        setUpvoteCount(totalUpvotesSnapshot.size);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchUserAndVote = async () => {
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          if (userData.uid === userId) {
            setUserFirstName(userData.firstName);
            setUserLastName(userData.lastName);
          }
        });
        const voteRef = collection(db, 'votes');
        const voteQuery = query(
          voteRef,
          where('pollId', '==', pollId),
          where('userId', '==', userId),
        );
        const voteSnapshot = await getDocs(voteQuery);
        if (voteSnapshot.size > 0) {
          setHasVoted(true);
        }
        const voteCounts = new Array(options.length).fill(0);
        const allVotesQuery = query(voteRef, where('pollId', '==', pollId));
        const allVotesSnapshot = await getDocs(allVotesQuery);
        allVotesSnapshot.forEach(voteDoc => {
          const voteData = voteDoc.data();
          const optionIndex = options.indexOf(voteData.option);
          if (optionIndex !== -1) {
            voteCounts[optionIndex]++;
          }
        });
        setOptionVotes(voteCounts);
        setTotalVotes(allVotesSnapshot.size);
      } catch (error) {
        console.error(error);
      }
    };
    hasUserMadeAVote();
    checkUpvoteStatus();
    fetchUserAndVote();
  }, [userId, pollId]);

  const createdAtTime = new Date(createdAt.toDate()).toLocaleString();

  // const createdAtDate = createdAt.toDate(); // convert Firestore Timestamp to Date object
  // const expirationTime = createdAtDate.getTime() + (lifetimeInHours * 60 * 60 * 1000);
  // const expiresAtTime = new Date(expirationTime).toLocaleString(); // convert expiration time to Date object and format as string




  const handleSelectOption = option => {
    setSelectedOption(option);
  };

  const handleVote = async () => {
    try {
      const upvotesRef = collection(db, 'upvotes');
      const upvoteQuery = query(
        upvotesRef,
        where('pollId', '==', pollId),
        where('userId', '==', userId),
      );
      const upvoteSnapshot = await getDocs(upvoteQuery);
      if (upvoteSnapshot.size > 0) {
        console.log('User has already upvoted for this poll');
        return;
      }
      // const votesRef = collection(db, 'votes');
      // const voteQuery = query(
      //   votesRef,
      //   where('pollId', '==', pollId),
      //   where('userId', '==', userId),
      // );
      // const voteSnapshot = await getDocs(voteQuery);
      // if (voteSnapshot.size > 0) {
      //   console.log('User has already upvoted for this poll');
      //   showResults = true;
      //   return;
      // }
      if (pollId && selectedOption) {
        console.log(userFirstName, userLastName, selectedOption);
        const voteRef = collection(db, 'votes');
        const docId = `${pollId}-${userId}`;
        await setDoc(doc(voteRef, docId),{
          pollId: pollId,
          uid: userId,
          option: selectedOption,
        });
        const updatedOptionVotes = [...optionVotes];
        const optionIndex = options.indexOf(selectedOption);
        updatedOptionVotes[optionIndex]++;
        
        setTotalVotes(totalVotes + 1);
        setOptionVotes(updatedOptionVotes);
        setHasVoted(true);
        showResults = true;
      } else {
        console.log('pollId or selectedOption is null');
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const renderOption = (option, index) => {
    if (hasVoted || showResults) {
      const votePercentage = totalVotes > 0 ? (optionVotes[index] / totalVotes) * 100 : 0;
      return (
        <View key={index} style={styles.optionContainer}>
          <View
            style={[
              styles.percentageBar,
              { width: `${votePercentage}%`, backgroundColor: '#007bff' },
            ]}
          />
          <Text style={styles.optionText}>{option}</Text>
          <Text style={styles.percentageText}>{votePercentage.toFixed(1)}%</Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedOption === option && styles.selectedOption,
          ]}
          onPress={() => handleSelectOption(option)}
          disabled={hasVoted}
        >
          <Text
            style={[
              styles.optionText,
              selectedOption === option && styles.selectedOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.pollContainer}>
      <View style={styles.voteButtonContainer}>
        <TouchableOpacity onPress={upvotePoll}>
          <Text
            style={[
              styles.upvoteArrow,
              { color: upvoted ? 'green' : 'gray' },
            ]}
          >
            ▲
          </Text>
        </TouchableOpacity>
        <Text style={styles.upvoteCount}>{upvoteCount}</Text>
      </View>
      <View style={styles.pollContentWrapper}>
        <View style={styles.pollContent}>
          <Text style={styles.question} numberOfLines={2} lineBreakMode="tail" >{question}</Text>
          {options.map((option, index) => renderOption(option, index))}
          <View style={styles.buttonContainer}>
          {!hasVoted && (
            <TouchableOpacity
                style={styles.button}
                onPress={handleVote}
                disabled={!selectedOption || hasVoted}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleLink} style={styles.showLinkButton}>
              <Text style={styles.showLinkButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
          {/* <Text>{`Created by: ${userFirstName} ${userLastName}`}</Text> */}
          <Text>{`Created at: ${createdAtTime}`}</Text>
          {/* <Text>{`Expires at: ${expiresAtTime}`}</Text> */}
        </View>
      </View>
    </View>
  );
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
    padding: 10,
  },
  percentageText: {
    padding: 10,
    fontWeight: 'bold',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '80%',
    
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
  upvoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  upvoteCount: {
    marginLeft: 5,
    fontSize: 20,
    justifyContent: 'center',
  },
  pollContainer: {
    flexDirection: 'row',
  },
  voteButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  pollContent: {
    flex: 1,
  },
  upvoteArrow: {
    justifyContent: 'center',
    fontSize: 30,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 120, // Set a fixed width
    height: 40, // Set a fixed height
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Add space between buttons
  },
  showLinkButton: {
    width: 120, // Set a fixed width
    height: 40, // Set a fixed height
    backgroundColor: 'gray',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showLinkButtonText: {
    color: 'white',
  },
});

export default Poll;