import {View, Text} from 'react-native';
import {useState, useEffect} from 'react';

import { styles, width } from '../style/style';

import * as Location from 'expo-location';
import WebView from 'react-native-webview';
import MapView from 'react-native-maps';

export default function Main() {
    // get location
    const [location, setLocation] = useState(null); // {latitude: 37.4219525, longitude: -122.0837251}
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          let _locationdict = {
            'latitude': location.coords.latitude,
            'longitude': location.coords.longitude,
          }
          setLocation(_locationdict);
        })();
      }, []); 

      let text = 'Waiting..';
      if (errorMsg) {
        text = errorMsg;
      } else if (location) {
        text = JSON.stringify(location);
      }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.titleText}>MY APPLICATION</Text>
        </View>
        <View>
            <MapView
                style={styles.map}
                initialRegion={{ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421, }}
            />
        </View>
        
    </View>
    );  // return
}