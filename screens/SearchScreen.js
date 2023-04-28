import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';
import {collection, query, where, getDocs, doc} from 'firebase/firestore';
import {db} from '../firebase';

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const postsRef = collection(db, 'polls');
      const q = query(postsRef, where('question', '>=', searchTerm));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(doc); //posts
      console.log(results); //null
      setSearchResults(results);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.question}</Text>
      <Text style={styles.author}>{item.creator}</Text>
      <Text style={styles.body}>{item.options}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search posts..."
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  author: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 5,
  },
  body: {},
});

export default SearchScreen;
