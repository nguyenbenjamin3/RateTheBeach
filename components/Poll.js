// import React, {useState, useEffect} from 'react';
// import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import {collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc, setDoc} from 'firebase/firestore';
// import {db} from '../firebase';

// const Poll = ({question, options, createdAt, pollId, lifetime,
//   upVotes, userId, hasVoted, userOption, onVote,

// }) => {
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [totalVotes, setTotalVotes] = useState(0);
//   const [upvotes, setUpVotes] = useState(0);
//   const [userUpvoted, setUserUpvoted] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [votes, setVotes] = useState([]);
//   const [userVoted, setUserVoted] = useState(false);

  
//   const createdAtTime = new Date(createdAt.toDate()).toLocaleString();

//   const handleSelectOption = option => {
//     if (!hasVoted) {
//       setSelectedOption(option);
//     }
//   };

//   const checkUserVoted = async () => {
//     try {
//       const userVotesRef = collection(db, 'userVotes');
//       const userVoteQuery = query(
//         userVotesRef,
//         where('pollId', '==', pollId),
//         where('userId', '==', userId),
//       );
//       const userVoteSnapshot = await getDocs(userVoteQuery);
//       if (userVoteSnapshot.size > 0) {
//         setUserVoted(true);
//         setSelectedOption(userVoteSnapshot.docs[0].data().selectedOption);
//         setShowResults(true);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const checkUserUpvoted = async () => {
//     try {
//       const upvotesRef = collection(db, 'upvotes');
//       const upvoteQuery = query(
//         upvotesRef,
//         where('pollId', '==', pollId),
//         where('userId', '==', userId),
//       );
//       const upvoteSnapshot = await getDocs(upvoteQuery);
//       if (upvoteSnapshot.size > 0) {
//         setUserUpvoted(true);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };
  

//   const fetchVoteData = async () => {
//     try {
//       const voteRef = collection(db, 'votes');
//       const voteQuery = query(voteRef, where('pollId', '==', pollId));
//       const voteSnapshot = await getDocs(voteQuery);
  
//       const voteData = voteSnapshot.docs.map(doc => doc.data());
//       const voteCounts = Array(options.length).fill(0);
  
//       voteData.forEach(vote => {
//         const optionIndex = options.indexOf(vote.option);
//         if (optionIndex > -1) {
//           voteCounts[optionIndex]++;
//         }
//       });
  
//       setVotes(voteCounts);
//       setTotalVotes(voteData.length);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleVote = async () => {
//     if (userVoted) {
//       console.log('User has already voted for this poll');
//       return;
//     }
//     if (pollId && selectedOption) {
//       console.log('pollId and selectedOption are not null');
//       await addDoc(collection(db, 'votes'), {
//         pollId: pollId,
//         userId: userId,
//         selectedOption: selectedOption,
//       });
//       setTotalVotes(totalVotes + 1);
//       await fetchVoteData();
//       onVote && onVote();
//       setUserVoted(true);
//     } else {
//       console.log('pollId or selectedOption is null');
//     }
//   };
  
//   const handleVote3 = async () => {
//     try {
//       const voteRef = collection(db, 'votes');
//       const docId = `${pollId}-${userId}`;
//       const voteQuery = query(
//         voteRef,
//         where('pollId', '==', pollId),
//         where('userId', '==', userId),
//       );
//       const voteSnapshot = await getDocs(voteQuery);
//       if (voteSnapshot.size > 0) {
//         console.log('User has already voted for this poll');
//         return;
//       }
//       if (pollId && selectedOption) {
//         console.log('pollId and selectedOption are not null');
//         await addDoc(voteRef, {
//             pollId: pollId,
//             userId: userId,
//             selectedOption: selectedOption,
//           },
//           docId
//         );
//         setTotalVotes(totalVotes + 1);
//         await fetchVoteData();
//         onVote && onVote();
//         setUserVoted(true); 
//       } else {
//         console.log('pollId or selectedOption is null');
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleUpvote = async () => {
//     if (!userUpvoted) {
//       setUpVotes(upvotes + 1);
//       setUserUpvoted(true);
  
//       // Save upvotes to the Firestore database
//       await updateDoc(doc(db, 'polls', pollId), {
//         upvotes: userUpvoted ? upvotes : upvotes + 1,
//       });
  
//       // Store upvote information in the Firestore database
//       await addDoc(collection(db, 'upvotes'), {
//         pollId: pollId,
//         userId: userId,
//       });
//     }
//   };

//   useEffect(() => {
//     const fetchPollData = async () => {
//       try {
//         const pollRef = doc(db, 'polls', pollId);
//         const pollData = await getDoc(pollRef);
//         setUpVotes(pollData.data().upvotes);
//         setVotes(pollData.data().votes);
//       } catch (error) {
//         console.error(error);
//       }
//     };
  
//     fetchPollData();
//     checkUserVoted();
//     checkUserUpvoted();
//     fetchVoteData();
//   }, []);
  

//   return (
//     <View style={styles.container}>
//       <View style={styles.voteButtons}>
//         <TouchableOpacity onPress={handleUpvote}>
//           <Text style={styles.arrow}>▲</Text>
//         </TouchableOpacity>
//         <Text style={styles.voteCount}>{upvotes}</Text>
//       </View>
//       <View style={styles.pollContent}>
//         <Text style={styles.question}>{question}</Text>
//         {!userVoted ? (
//           options.map((option, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[
//                 styles.option,
//                 selectedOption === option && styles.selectedOption,
//               ]}
//               onPress={() => handleSelectOption(option)}
//             >
//               <Text
//                 style={[
//                   styles.optionText,
//                   selectedOption === option && styles.selectedOptionText,
//                 ]}
//               >
//                 {option}
//               </Text>
//             </TouchableOpacity>
//           ))
//         ) : (
//           options.map((option, index) => (
//             <View key={index} style={styles.resultContainer}>
//               <View style={styles.optionContainer}>
//                 <Text style={[styles.optionText, styles.resultOptionText]}>
//                   {option}
//                 </Text>
//                 <View
//                   style={[
//                     styles.resultBar,
//                     {
//                       width: `${totalVotes ? ((votes[index] || 0) / totalVotes) * 100 : 0}%`,
//                       position: 'absolute',
//                       zIndex: -1,
//                       opacity: 0.6,
//                     },
//                   ]}
//                 />
//               </View>
//               {userVoted && (
//                 <Text style={styles.percentage}>
//                   {/* {Math.round(((votes[index] || 0) / totalVotes) * 100)}% */}
//                   {Math.round(totalVotes ? ((votes[index] || 0) / totalVotes) * 100 : 0)}%
//                 </Text>
//               )}
//             </View>
//           ))
//         )}
//         <TouchableOpacity
//           style={styles.button}
//           onPress={handleVote}
//           disabled={!selectedOption || userVoted || showResults}
//         >
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity>
//         <Text>{`Created at: ${createdAtTime}`}</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//   },
//   resultBar: {
//     backgroundColor: '#aaffaa',
//     height: 30,
//   },
//   resultOption: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 5,
//     marginTop: 5,
//   },
//   resultOptionText: {
//     fontSize: 16,
//   },
//   yourVoteText: {
//     fontStyle: 'italic',
//     fontSize: 14,
//     color: 'green',
//   },
//   // resultOptionText: {
//   //   zIndex: 2,
//   // },
//   resultContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   optionContainer: {
//     position: 'relative',
//     flex: 1,
//   },
//   voteButtons: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 10,
//   },
//   voteCount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginVertical: 5,
//   },
//   arrow: {
//     fontSize: 30,
//   },
//   question: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'black',
//     marginBottom: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   result: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   percentage: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   option: {
//     padding: 10,
//     borderWidth: 2,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//   },
//   selectedOption: {
//     backgroundColor: '#aaffaa',
//     borderColor: '#00aa00',
//   },
//   optionText: {
//     flex: 1,
//   },
//   selectedOptionText: {
//     fontWeight: 'bold',
//   },
//   votes: {
//     marginLeft: 10,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//   },
// });

// export default Poll;






































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

const Poll = ({pollId, userId, question, options, createdAt, upvotes, showResults}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [optionVotes, setOptionVotes] = useState(new Array(options.length).fill(0));
  const [hasVoted, setHasVoted] = useState(false);
  //const [showResults, setShowResults] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(upvotes || 0);

  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const upvotePoll = async () => {
    if (upvoted) {
      console.log('User has already upvoted this poll');
      return;
    }
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
        showResults = true;//setShowResults(true);
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

  const handleSelectOption = option => {
    setSelectedOption(option);
  };

  const handleVote = async () => {
    try {
      if (hasVoted || showResults) {
        console.log('User has already voted for this poll');
        return;
      }
      if (pollId && selectedOption) {
        console.log(userFirstName, userLastName, selectedOption);
        const voteRef = collection(db, 'votes');
        const docId = `${pollId}-${userId}`;
        await setDoc(doc(voteRef, docId), {
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
          <Text style={styles.question}>{question}</Text>
          {options.map((option, index) => renderOption(option, index))}
          {!hasVoted && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleVote}
              disabled={!selectedOption || hasVoted}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          )}
          <Text>{`Created by: ${userFirstName} ${userLastName}`}</Text>
          <Text>{`Created at: ${createdAtTime}`}</Text>
          {/* <Text>{`Expires at: ${}`}</Text> */}
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
});

export default Poll;