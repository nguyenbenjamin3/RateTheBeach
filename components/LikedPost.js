import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Poll from '../components/Poll';
import CreatePoll from '../components/CreatePoll';
import { db, auth } from '../firebase';
import {
  doc,
  collection,
  collectionGroup,
  getDocs,
  orderBy,
  query,
  setDoc,
  addDoc,
} from 'firebase/firestore';
import grayHeartImage from '../assets/icon_heart_.png';
import redHeartImage from '../assets/icon_heart_red_.png';

const HomeScreen = () => { //HomeScreen.js
  //data for home screen to load
  const [feedData, setFeedData] = useState([]);
  //page number for pagination
  const [page, setPage] = useState(1);
  //state to show/hide the create poll form
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showCreateRating, setShowCreateRating] = useState(false);

  const loadMoreData = async () => {
    // Fetch data from your collection in descending order of createdAt timestamp
    const pollsRef = collectionGroup(db, 'polls');
    const pollsQuery = query(pollsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(pollsQuery);

    // Map over the array of documents to create an array of objects
    const newData = snapshot.docs.map((doc) => {
      const pollData = doc.data();
      const currentTime = new Date();
      // Check if the poll is expired
      if (pollData.lifetime && pollData.lifetime.toDate() < currentTime) {
        return null;
      }

      return {
        question: pollData.question,
        options: Object.values(pollData.options),
        createdAt: pollData.createdAt,
        pollId: doc.id,
        lifetime: pollData.lifetime,
        downVotes: pollData.downVotes,
        userId: auth.currentUser.uid,
        liked: false,
      };
    });
    // Remove null values from the array
    const filteredData = newData.filter((poll) => poll !== null);

    setFeedData(filteredData);
    setPage(page + 1);
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const handleLikePress = async (pollId) => {
    const newFeedData = feedData.map((poll) => {
      if (poll.pollId === pollId) {
        if (poll.liked) {
          poll.liked = false;
          poll.downVotes--;
          return poll;
        } else {
          poll.liked = true;
          poll.downVotes++;
          return poll;
        }
      } else {
        return poll;
      }
    });

    const currentUser = auth.currentUser;
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDocs(docRef);

      if (userDoc.empty) {
        await setDoc(docRef, { savedPosts: [pollId] });
      } else {
        const userData = userDoc.docs[0].data();
        let savedPosts = [];
        if (userData.savedPosts) {
          savedPosts = userData.savedPosts;
        }
        if (poll.liked) {
          savedPosts.push(pollId);
        } else {
          const index = savedPosts.indexOf(pollId);
          if (index !== -1) {
            savedPosts.splice(index, 1);
          }
        }
        await setDoc(docRef, { savedPosts: savedPosts });
      }
    }

    setFeedData(newFeedData);
  };

  return (
    <ScrollView style={styles.scrollview}>
      <Image source={require('../RateTheBeach.png')} style={styles.logo} />
      {showCreatePoll ? (
        <View style={styles.pollContainer}>
          <CreatePoll setShowCreatePoll={setShowCreatePoll} />
        </View>
      ) : (
        <View>
          {feedData.map((poll, index) => (
            <Poll
              key={index}
              question={poll.question}
              options={poll.options}
              createdAt={poll.createdAt}
              pollId={poll.pollId}
              lifetime={poll.lifetime}
              downVotes={poll.downVotes}
              liked={poll.liked}
              handleLikePress={handleLikePress}
            />
          ))}
          <TouchableOpacity
            style={styles.createPollButton}
            onPress={() => setShowCreatePoll(true)}>
            <Text style={styles.createPollButtonText}>Create Poll</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  ); 