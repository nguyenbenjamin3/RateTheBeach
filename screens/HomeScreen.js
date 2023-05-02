// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ScrollView,
//   FlatList,
//   RefreshControl,
//   Button,
//   TouchableOpacity,
//   ActivityIndicator,
//   Modal,
// } from 'react-native';
// import React, {useState, useEffect, useRef} from 'react';
// import Poll from '../components/Poll';
// import CreatePoll from '../components/CreatePoll';
// import CreateRating from '../components/CreateRating';
// import {
//   doc,
//   collection,
//   collectionGroup,
//   getDocs,
//   orderBy,
//   query,
//   where,
//   startAfter,
// } from 'firebase/firestore';
// import {db, auth} from '../firebase';

// const HomeScreen = () => {
//   //data for home screen to load
//   const [feedData, setFeedData] = useState([]);

//   const [showModal, setShowModal] = useState(false);

//   //page number for pagination
//   const [page, setPage] = useState(1);

//   const flatListRef = useRef(null);

//   //state to show/hide the create poll form
//   const [showCreatePoll, setShowCreatePoll] = useState(false);
//   const [showCreateRating, setShowCreateRating] = useState(false);
//   const [lastVisible, setLastVisible] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const scrollToCreation = () => {
//     flatListRef.current.scrollToOffset({offset: 0, animated: true});
//   };

//   const refreshData = async () => {
//     setFeedData([]);
//     setLastVisible(null);
//     await loadMoreData(true);
//   };

//   const onRefresh = async () => {
//     setIsRefreshing(true);
//     await refreshData();
//     setIsRefreshing(false);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };


//   const loadMoreData = async (reset = false) => {
//     setIsLoading(true);
//     const currentTime = new Date();
//     const votesRef = collection(db, 'votes');
//     // Fetch data from your collection in descending order of createdAt timestamp
//     const pollsRef = collection(db, 'polls');
//     //const pollsQuery = query(pollsRef, orderBy('createdAt', 'desc'));  
//     const pollsQuery = lastVisible && !reset
//     ? query(pollsRef, orderBy('createdAt', 'desc'), startAfter(lastVisible))
//     : query(pollsRef, orderBy('createdAt', 'desc'));

//     const snapshot = await getDocs(pollsQuery);

  
//     // Map over the array of documents to create an array of objects
//     const newDataPromises = snapshot.docs.map(async doc => {
//       const pollData = doc.data();
  
//       // Check if the poll is expired
//       if (pollData.lifetime && pollData.lifetime.toDate && pollData.lifetime.toDate() < currentTime) {
//         return null;
//       }
  
//       // Add this block to get the user's vote data for this poll
//       const userVoteQuery = query(
//         votesRef,
//         where('pollId', '==', doc.id),
//         where('userId', '==', auth.currentUser.uid),
//       );
//       const userVoteSnapshot = await getDocs(userVoteQuery);
//       const userVoted = userVoteSnapshot.size > 0;
//       const userOption = userVoted ? userVoteSnapshot.docs[0].data().option : null;
  
//       return {
//         question: pollData.question,
//         options: Object.values(pollData.options),
//         createdAt: pollData.createdAt,
//         pollId: doc.id,
//         lifetime: pollData.lifetime,
//         upVotes: pollData.upVotes,
//         userId: auth.currentUser.uid,
//         userVoted,
//         userOption,
//       };
//     });
  
//     const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
//     reset ? setLastVisible(null) : setLastVisible(lastVisibleDoc);

//     const newData = await Promise.all(newDataPromises);
  
//     // Remove null values from the array
//     const filteredData = newData.filter(item => item !== null);
    
//     if (reset) {
//       setFeedData(filteredData);
//     } else {
//       setFeedData([...feedData, ...filteredData]);
//     }
//     setPage(page + 1);
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     loadMoreData(true);
//   }, []);

//   const renderFooter = () => {
//     return (
//       <View style={styles.footer}>
//         {isLoading ? (
//           <ActivityIndicator size="large" color="#0000ff" />
//         ) : (
//           <TouchableOpacity
//             onPress={loadMoreData}
//             style={styles.loadMoreButton}>
//             <Text style={styles.loadMoreButtonText}>Load More</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   return (
//     <>
//       <FlatList
//         ref={flatListRef}
//         ListHeaderComponent={
//           <>
//             <Image source={require('../RateTheBeach.png')} style={styles.logo} />
//             {showCreatePoll ? (
//               <View style={styles.pollContainer}>
//                 <CreatePoll setShowCreatePoll={setShowCreatePoll} afterSubmit={scrollToCreation}/>
//               </View>
//             ) : null}
//             {showCreateRating ? (
//               <View style={styles.pollContainer}>
//                 <CreateRating setShowCreateRating={setShowCreateRating} afterSubmit={scrollToCreation}/>   
//               </View>) : null}
//           </>
//         }
//         data={feedData}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item, index }) => (
//           <View key={index} style={styles.pollContainer}>
//             <Poll
//               key={`${item.pollId}-${Math.random()}`}
//               question={item.question}
//               options={item.options}
//               createdAt={item.createdAt}
//               pollId={item.pollId}
//               lifetime={item.lifetime}
//               upvotes={item.upvotes}
//               userId={item.userId}
//               hasVoted={item.userVoted}
//               userOption={item.userOption}
//               onVote={() => loadMoreData(true)}
//             />
//           </View>
//         )}
//         ListFooterComponent={renderFooter}
//         refreshControl={
//           <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
//         }
//       />
//       <Modal animationType="slide" transparent={true} visible={showModal}>
//         <View style={styles.modalView}>
//           <Text style={styles.modalTitle}>Select Post Type</Text>
//           <TouchableOpacity
//             onPress={() => {
//               setShowCreatePoll(true);
//               setShowCreateRating(false);
//               closeModal();
//             }}
//             style={styles.modalButton}>
//             <Text style={styles.modalButtonText}>Create Poll Post</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               setShowCreateRating(true);
//               setShowCreatePoll(false);
//               closeModal();
//             }}
//             style={styles.modalButton}>
//             <Text style={styles.modalButtonText}>Create Rating Post</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
//             <Text style={styles.modalButtonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//       <TouchableOpacity
//         style={styles.fixedCreateButton}
//         onPress={() => setShowModal(true)}>
//         <Text style={styles.fixedCreateButtonText}>+</Text>
//       </TouchableOpacity>
//     </>
//   );  
// };
  

// export default HomeScreen;

// const styles = StyleSheet.create({
//   logo: {
//     width: 550,
//     height: 250,
//     resizeMode: 'cover',
//     alignSelf: 'center',
//     marginBottom: 10,
//   },
//   pollContainer: {
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 10,
//     padding: 10,
//     margin: 10,
//     backgroundColor: 'white',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     margin: 50,
//     marginTop: 10,
//     marginBottom: 100,
//   },
//   ScrollView: {
//     marginBottom: 100,
//   },
//   footer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//   },
//   loadMoreButton: {
//     backgroundColor: '#6666e0',
//     borderRadius: 10,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   loadMoreButtonText: {
//     color: 'white',
//     fontSize: 18,
//   },
//   fixedCreateButton: {
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'absolute',
//     bottom: 100,
//     right: 20,
//     zIndex: 10,
//   },
//   fixedCreateButtonText: {
//     fontSize: 36,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   modalView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 10,
//   },
//   modalButton: {
//     backgroundColor: 'rgba(12, 12, 12, 0.7)',
//     borderRadius: 10,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     marginVertical: 5,
//     width: '80%',
//   },
//   modalButtonText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });





import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  RefreshControl,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Poll from '../components/Poll';
import CreatePoll from '../components/CreatePoll';
import CreateRating from '../components/CreateRating';
import {
  doc,
  collection,
  collectionGroup,
  getDocs,
  orderBy,
  query,
  where,
  startAfter,
} from 'firebase/firestore';

import {db, auth} from '../firebase';

const HomeScreen = () => {
  //data for home screen to load
  const [feedData, setFeedData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  //page number for pagination
  const [page, setPage] = useState(1);
  const flatListRef = useRef(null);

  //state to show/hide the create poll form
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showCreateRating, setShowCreateRating] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [hasVoted, setHasVoted] = useState(null);

  // useEffect(() => {
  //   loadMoreData(true);
  // }, []);

  const scrollToCreation = () => {
    flatListRef.current.scrollToOffset({offset: 0, animated: true});
  };

  const refreshData = async () => {
    setFeedData([]);
    setLastVisible(null);
    await loadMoreData(true);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const checkHasVoted = async (pollId) => {
      const voteRef = collection(db, 'votes');
      const userVoteQuery = query(
        voteRef,
        where('pollId', '==', pollId),
        where('userId', '==', auth.currentUser.uid),
      );
      const userVoteSnapshot = await getDocs(userVoteQuery);

      setHasVoted(userVoteSnapshot.size > 0);
    };

    // Use the checkHasVoted function to check if the user has voted for each poll
    feedData.forEach((item) => {
      checkHasVoted(item.pollId);
    });
  }, [feedData]);


  const loadMoreData = async (reset = false) => {
    setIsLoading(true);
    const currentTime = new Date(Date.now());
    const votesRef = collection(db, 'votes');
    const pollsRef = collection(db, 'polls');

    const pollsQuery = lastVisible && !reset
    ? query(pollsRef, orderBy('createdAt', 'desc'), startAfter(lastVisible))
    : query(pollsRef, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(pollsQuery);

    // Map over the array of documents to create an array of objects
    const newDataPromises = snapshot.docs.map(async doc => {
      const pollData = doc.data();
      //console.log(doc.id);
      //console.log(pollData.creator);
      const currentTime = new Date();
      
      // Check if the poll is expired
      if (pollData.lifetime && pollData.lifetime.toDate && pollData.lifetime.toDate() < currentTime) {
        return null;
      }

      // // Check if the poll already exists in the feedData
      // if (feedData.some(feedItem => feedItem.pollId === doc.id)) {
      //   return null;
      // }
  
      // Add this block to get the user's vote data for this poll
      const userVoteQuery = query(
        votesRef,
        where('pollId', '==', doc.id),
        where('userId', '==', auth.currentUser.uid),
      );
      const userVoteSnapshot = await getDocs(userVoteQuery);
      setHasVoted(userVoteSnapshot.size > 0)
      const userOption = hasVoted ? userVoteSnapshot.docs[0].data().option : null;
  
      return {
        question: pollData.question,
        options: Object.values(pollData.options),
        createdAt: pollData.createdAt,
        pollId: doc.id,
        lifetime: pollData.lifetime,
        upVotes: pollData.upVotes,
        showResults: hasVoted,
        userOption,
        userId: pollData.creator,
      };
    });
  
    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
    reset ? setLastVisible(null) : setLastVisible(lastVisibleDoc);

    const newData = await Promise.all(newDataPromises);
  
    // Remove null values from the array
    const filteredData = newData.filter(item => item !== null);
    
    if (reset) {
      setFeedData(filteredData);
    } else {
      setFeedData([...feedData, ...filteredData]);
    }
    setPage(page + 1);
    setIsLoading(false);
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity
            onPress={loadMoreData}
            style={styles.loadMoreButton}>
            <Text style={styles.loadMoreButtonText}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <>
      <FlatList
        ref={flatListRef}
        ListHeaderComponent={
          <>
            <Image source={require('../RateTheBeach.png')} style={styles.logo} />
            {showCreatePoll ? (
              <View style={styles.pollContainer}>
                <CreatePoll setShowCreatePoll={setShowCreatePoll} afterSubmit={scrollToCreation}/>
              </View>
            ) : null}
            {showCreateRating ? (
              <View style={styles.pollContainer}>
                <CreateRating setShowCreateRating={setShowCreateRating} afterSubmit={scrollToCreation}/>   
              </View>) : null}
          </>
        }
        data={feedData}
        renderItem={({ item, index }) => (
          <View key={index} style={styles.pollContainer}>
            <Poll
              pollId={item.pollId}
              userId={auth.currentUser.uid}
              question={item.question}
              options={item.options}
              createdAt={item.createdAt}
              upvotes={item.upvotes}
              hasVoted={item.hasVoted}
              userOption={item.userOption}
            />
          </View>
        )}
        keyExtractor={(item, index) => item.pollId}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select Post Type</Text>
          <TouchableOpacity
            onPress={() => {
              setShowCreatePoll(true);
              setShowCreateRating(false);
              closeModal();
            }}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Create Poll Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowCreateRating(true);
              setShowCreatePoll(false);
              closeModal();
            }}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Create Rating Post</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

      </Modal>
      <TouchableOpacity
        style={styles.fixedCreateButton}
        onPress={() => setShowModal(true)}>
        <Text style={styles.fixedCreateButtonText}>+</Text>
      </TouchableOpacity>
    </>
  );  
};
  

export default HomeScreen;

const styles = StyleSheet.create({
  logo: {
    width: 550,
    height: 250,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginBottom: 10,
  },
  pollContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  buttonContainer: {
    margin: 50,
    marginTop: 10,
    marginBottom: 100,
  },
  ScrollView: {
    marginBottom: 100,
  },
  footer: {
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 50,
    width: 100,
    alignSelf: 'center',
  },

  addButtonContainer: {
    alignItems: 'center',
    padding: 10,
  },
  loadMoreButton: {
    backgroundColor: '#6666e0',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadMoreButtonText: {
    color: 'white',
    fontSize: 18,
  },
  fixedCreateButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 10,
  },
  fixedCreateButtonText: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: 'rgba(12, 12, 12, 0.7)',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 5,
    width: '80%',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
