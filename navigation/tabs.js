import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {StyleSheet, Text, View,TouchableOpacity,Image} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';


const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator initialRouteName={"Home"}
        tabBarOptions={{
            tabBarShowLabel : false,
            style: {
                position: 'absolute',
                bottom: 25,
                left: 20,
                right: 20,
                backgroundColor: "#ffffff",
                borderRadius: 15,
                height: 65,
                ...styles.shadow,
            }
         }}
>
      <Tab.Screen name="Home" component={HomeScreen} options = {{
        tabBarIcon: ({focused}) => (
            <View 
            style={{
                alignItems:"center", justifyContent: "center",top: 2,
            }}> 
                <Image source={require('../images/icon_home_.png')}
                resizeMode = 'contain' 
                style={{
                    width: 20, height: 20
                }}/>
        
                    <Text style={{color: focused ? "#ffcd89" : "#748c94",fontSize: 12,}}>HOME
                      </Text>
                       </View>),}}/>
      <Tab.Screen name="Login" component={LoginScreen} options = {{
        tabBarIcon: ({focused}) => (
            <View 
            style={{
                alignItems:"center", justifyContent: "center",top: 2,
            }}>
                <Image source={require('../images/icon_heart_.png')}
                resizeMode = 'contain' 
                style={{
                    width: 20, height: 20
                }}/>
        
                    <Text style={{color: focused ? "#ffcd89" : "#748c94",fontSize: 12,}}>LOGIN
                      </Text>
                       </View>),}}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options = {{
        tabBarIcon: ({focused}) => (
            <View 
            style={{
                alignItems:"center", justifyContent: "center",top: 2,
            }}>
                
                <Image source={require('../images/icon_person_.png')}
                resizeMode = 'contain' 
                style={{
                    width: 20, height: 20
                }}/>
        
                    <Text style={{color: focused ? "#ffcd89" : "#748c94",fontSize: 12,}}>PROFILE
                      </Text>
                       </View>),}}/>
      
                       <Tab.Screen name="RegisterScreen" component={RegisterScreen}/>

    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Tabs;