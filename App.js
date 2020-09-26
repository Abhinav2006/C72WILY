import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import BookTransaction from './Screens/BookTransaction';
import SearchScreen from './Screens/SearchScreen';

export default class App extends React.Component{
  render(){
    return(
      <AppContainer/>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const TabNavigator = createBottomTabNavigator({
  Transaction:{screen:BookTransaction},
  Search:{screen:SearchScreen}
},{
  defaultNavigationOptions: ({navigation})=>({
    tabBarIcon: ()=>{
      const routeName = navigation.state.routeName
      if (routeName === "Transaction"){
        return(<Image source = {require("./assets/book.png")} style = {{width: 20, height: 20}}/>)
      } else if (routeName === "Search"){
        return(<Image source = {require("./assets/searchingbook.png")} style = {{width: 20, height: 20}}/>)
      }
    }
  })
})

const AppContainer = createAppContainer(TabNavigator)