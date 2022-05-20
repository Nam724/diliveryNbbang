import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable} from 'react-native';
import {useState, useEffect} from 'react';
import { styles, width } from '../style/style';



export default function Main_restaurantlist(id, name, fee, url) {

 // return 
  return (
    <View style={styles.restaurantList} key={id}>

      <Text style={[styles.highlightText, styles.restaurantName]}>{name}</Text>

      <Text style={[styles.normalText, styles.restaurantFee]}>{`fee: ${fee}won each`}</Text>

      <Text style={[styles.normalText, styles.restaurantMembers]}>{`members: `}</Text>
      
    </View>
  );  // return
}

