import { colorPack, styles, width } from '../style/style';
import {View, ActivityIndicator, Text, Image} from 'react-native-web';
import {useState, useEffect} from 'react';
import * as Location from 'expo-location';



export default function Loading_page({route, navigation}){


  return ( 
      <View style={[styles.container, {justifyContent:'center'}]}>


      <View style={{alignContent:'center', justifyContent:'center'}}>
        <Image source={require('../../assets/icon.png')} style={{width:width*0.8, height:width*0.8, marginLeft:width*0.1}} />
      </View>

      <View style={styles.header}>
      <Text style={styles.highlightText}>
          {'배달 앤빵 정보를 불러오는 중입니다.'}
      </Text>
    </View>


      <ActivityIndicator size="large" animating={true} color={colorPack.text_light} />




      </View>
  );
}