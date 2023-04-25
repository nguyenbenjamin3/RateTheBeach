import {StyleSheet, TextInput, View, Text, ScrollView, Image, TouchableOpacity} from "react-native";
import React from 'react';
import {collection, getDocs, orderBy, query} from 'firebase/firestore';

const SearchScreen = () => {

  const data = async () =>{};//Gets all posts made
  
  return (
    	//When Search is clicked on the Navigation Bar, display this
      <ScrollView>
        <View style = {styles.container}>

          <View>
            <TextInput
            style={{
              height: 50,
              width: 355,
              fontSize: 20,
              borderColor: 'gray',
              borderWidth: 2,
            }}
            defaultValue = "Search for posts..."
        ></TextInput>
          </View>

          <Image
            source={require('../images/search.png')}
            style={{
              marginLeft: 5,
              width: 20,
              height: 20,
            }}
          />
        </View>

        <TouchableOpacity>
        </TouchableOpacity>

      </ScrollView>

  );
};

export default SearchScreen;

// styles
const styles = StyleSheet.create({
  container: {
    margin: 5,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",

  }
});