import {StyleSheet, Text, View, Image, ScrollView, Button} from 'react-native';
import React from 'react';
import Poll from '../components/Poll';
import CreatePoll from '../components/CreatePolls';

const HomeScreen = () => {
  const [feedData, setFeedData] = React.useState([]);
  const [page, setPage] = React.useState(1);

  const loadMoreData = () => {
    // Replace this with your own code to fetch the data you want to add
    const newData = [
      {
        question: 'What is your favorite food?',
        options: ['Pizza', 'Tacos', 'Burgers'],
      },
      {
        question: 'What is your favorite color?',
        options: ['Red', 'Green', 'Blue'],
      },
    ];

    // Append the new data to the existing data array
    setFeedData([...feedData, ...newData]);

    // Increment the page number for the next fetch
    setPage(page + 1);
  };

  useEffect =
    (() => {
      loadMoreData();
    },
    []);

  return (
    <ScrollView>
      <Text>HomeScreen</Text>
      <Image source={require('../RateTheBeach.png')} style={styles.logo} />
      {feedData.map((item, index) => (
        <View key={index} style={styles.pollContainer}>
          <Poll question={item.question} options={item.options} />
        </View>
      ))}
      {/* <View style={styles.pollContainer}>
        <Poll
          question="What is your favorite color?"
          options={['Red', 'Green', 'Blue']}
        />
      </View>
      <View style={styles.pollContainer}>
        <Poll
          question="What is your favorite color?"
          options={['Red', 'Green', 'Blue']}
        />
      </View>
      <View style={styles.pollContainer}>
        <Poll
          question="What is your favorite color?"
          options={['Red', 'Green', 'Blue']}
        />
      </View>
      <View style={styles.pollContainer}>
        <Poll
          question="What is your favorite color?"
          options={['Red', 'Green', 'Blue']}
        />
      </View> */}
      <View style={styles.buttonContainer}>
        <Button title="Load More" onPress={loadMoreData} />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  logo: {
    width: 550,
    height: 250,
    resizeMode: 'cover',
    alignSelf: 'center',
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
  },
});
