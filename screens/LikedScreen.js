import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { collection, getDocs, where, query, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useFocusEffect } from '@react-navigation/native';

const LikedScreen = () => {
  const [likedPosts, setLikedPosts] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const likedPostsRef = collection(db, 'posts');
      let likedPostsQuery = query(
        likedPostsRef,
        where('likes', 'array-contains', '')
      );

      const unsubscribeAuth = auth.onAuthStateChanged((user) => {
        if (user) {
          likedPostsQuery = query(
            likedPostsRef,
            where('likes', 'array-contains', user.uid)
          );

          const unsubscribeSnapshot = onSnapshot(likedPostsQuery, (likedPostsSnapshot) => {
            const likedPostsData = likedPostsSnapshot.docs.map((doc) => {
              const post = doc.data();
              const { id } = doc;
              return { id, ...post };
            });

            setLikedPosts(likedPostsData);
          });

          return () => {
            unsubscribeSnapshot();
          };
        } else {
          setLikedPosts([]);
        }
      });

      return () => {
        unsubscribeAuth();
      };
    }, [])
  );

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={likedPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postContent: {
    fontSize: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default LikedScreen;
