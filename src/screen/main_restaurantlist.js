import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable} from 'react-native';
import {useState, useEffect} from 'react';
import { styles, width } from '../style/style';
import uuid from 'react-native-uuid';


export default function Main_restaurantlist(id,name, fee, members) {

 // return 
  return (
    <View style={styles.restaurantList} key={id}>

      <Text style={[styles.highlightText, styles.restaurantName]}>{name}</Text>

      <Text style={[styles.normalText, styles.restaurantFee]}>{`fee: ${fee}won each`}</Text>

      <Text style={[styles.normalText, styles.restaurantMembers]}>{`members: ${members}`}</Text>
      
    </View>
  );  // return
}

