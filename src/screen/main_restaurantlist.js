import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable} from 'react-native';
import {useState, useEffect} from 'react';
import { colorPack, styles, width } from '../style/style';


function Main_restaurantlist(id, name, fee, url, num) {
  const backgroundColor_odd = colorPack.highlight_dark
  const backgroundColor_even = colorPack.highlight_light
  var myBackgroundColor
  if(Number(num) %2 == 0){
    myBackgroundColor = backgroundColor_even
  }
  else{
    myBackgroundColor = backgroundColor_odd
  }
 // return 
  return (
    <TouchableOpacity style={[styles.restaurantList,{backgroundColor:myBackgroundColor}]} key={id}
    onPressOut=  {() => {  
      // navigation.navigate('Restaurant', {id: id, name: name, fee: fee, url: url})
      console.log('pressed')
    }}
    >

      <Text style={[styles.highlightText, styles.restaurantName]}>{name}</Text>

      <Text style={[styles.normalText, styles.restaurantFee]}>{`fee: ${fee}won each`}</Text>

      <Text style={[styles.normalText, styles.restaurantMembers]}>{`members: `}</Text>
      
    </TouchableOpacity>
  );  // return
}

function Main_restaurantlist_sample(id, name, fee, num) {
  const backgroundColor_odd = colorPack.highlight_dark
  const backgroundColor_even = colorPack.highlight_light
  var myBackgroundColor
  if(Number(num) %2 == 0){
    myBackgroundColor = backgroundColor_even
  }
  else{
    myBackgroundColor = backgroundColor_odd
  }
 // return 
  return (
    <TouchableOpacity style={[styles.restaurantList,{backgroundColor:myBackgroundColor}]} key={id}
    onPressOut=  {() => {  
      // navigation.navigate('Restaurant', {id: id, name: name, fee: fee, url: url})
      console.log('pressed')
    }}
    >

      <Text style={[styles.highlightText, styles.restaurantName]}>{name}</Text>

      <Text style={[styles.normalText, styles.restaurantFee]}>{`${fee}`}</Text>

      <Text style={[styles.normalText, styles.restaurantMembers]}>{``}</Text>
      
    </TouchableOpacity>
  );  // return
}

export {Main_restaurantlist, Main_restaurantlist_sample}