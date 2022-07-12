import { colorPack, styles, width } from '../style/style';
import {View, ActivityIndicator, Text, Image} from 'react-native';
import {useState, useEffect} from 'react';




export default function Loading_page({route, navigation}){


  return ( 
      <View style={[styles.container, {flex:1, justifyContent:'center'}]}>


      <View style={{alignContent:'center', width:width}}>
        <Image source={require('../../assets/icon.png')} style={{width:width*0.5, height:width*0.5,}} />
      </View>

      <View style={styles.header}>
      <Text style={styles.highlightText}>
          {'배달 앤빵'}
      </Text>
    </View>


      <ActivityIndicator size="large" animating={true} color={colorPack.text_light} />




      </View>
  );
}