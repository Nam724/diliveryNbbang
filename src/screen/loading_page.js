import { colorPack, styles, width } from '../style/style';
import {View, ActivityIndicator, Text, Image} from 'react-native';
import {useState, useEffect} from 'react';
import * as Location from 'expo-location';



export default function Loading_page({route, navigation}){

    const user = route.params.user;

    const [isLoading, setIsLoading] = useState(true);
    
    useEffect( () => {
        mountFunction();
    }, []); 


    
    const mountFunction = async () => { // 시작할 때 실행되는 함수 (위치 정보 가져오기)
        alert('mountFunction');
        let { status_location_permission } = await Location.requestForegroundPermissionsAsync();
          // console.log(status_location_permission);
          // 나중에 풀어야 함!
        //   if (status_location_permission !== 'granted') {
        //     alert('Permission to access location was denied');
        //     // return; 
        //   }
    
          let _location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});
          const location = {
            latitude: _location.coords.latitude,
            longitude: _location.coords.longitude,
            latitudeDelta: 0.003, longitudeDelta: 0.003
          };
    
          alert('mountFunction is finished'+location)
          navigation.replace('Main', {user: user, location: JSON.stringify(location)});

      }
    

  return ( 
      <View style={[styles.container, {flex:1, justifyContent:'center'}]}>


      <View style={{alignContent:'center'}}>
        <Image source={require('../../assets/icon.png')} style={{width:width*0.3, height:width*0.3, marginLeft:width*0.35}} />
      </View>


      <ActivityIndicator size="large" animating={true} color={colorPack.text_light} />

      <View style={styles.header}>
        <Text style={styles.highlightText}>
            {'정보를 불러오는 중이예요'}
        </Text>
      </View>


      </View>
  );
}