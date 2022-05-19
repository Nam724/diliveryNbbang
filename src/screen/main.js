import {View, Text} from 'react-native';
import {useState, useEffect} from 'react';
import { styles, width } from '../style/style';

import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';


export default function Main() {
    // get location
    const [location, setLocation] = useState(
      {latitude: 37.4219525, longitude: -122.0837251, latitudeDelta: 0.0922, longitudeDelta: 0.0421}
    ); // {latitude: 37.4219525, longitude: -122.0837251}
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
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
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
  console.log(location)

  // move maps

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.titleText}>MY APPLICATION</Text>
      </View>

      <View>
        {location && (
          <MapView
          provider='google'
          style={styles.map}
          initialRegion={location}
          showsMyLocationButton={true}
          showsUserLocation={true}
          loadingEnabled={true}
          zoomEnabled={true}
          rotateEnabled={true}
          >
            <Marker
            coordinate={location}
            />
          </MapView>
        )}
      </View>

    </View>
    );  // return
}