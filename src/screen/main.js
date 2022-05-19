import {View, Text, TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';
import { styles, width } from '../style/style';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import uuid from 'react-native-uuid';
import DialogInput from 'react-native-dialog-input';


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
  } 
  else if (location) {
    text = JSON.stringify(location);
  }
  console.log(location)

// get log pressed location and add marker
  const [markers, setMarkers] = useState([]);
  const [newmarkerCoordinate, setNewmarkerCoordinate] = useState(null);
  const makeNewMarker = (coordinate, title) => {
    setDialogVisible(true)
    const key = 'markers%' + uuid.v4()
    return (
      <Marker
        coordinate={coordinate}
        title={title}
        description={"want some food in here?"}
        key={key}
        onPress={() => {
          setSelectedMarker(
            {
              coordinate: coordinate,
              title: title,
              key: key,
            }
          );
        }}
      />
    );
  }

// selected marker info
  const [selectedMarker, setSelectedMarker] = useState({
    coordinate: '',
    title: 'restaurant',
    key: 'markers%',
  });

 // get marker name dialog
  const [dialogVisible, setDialogVisible] = useState(false); 

 // return 
  return (
    <View style={styles.container}>

      <DialogInput
        isDialogVisible={dialogVisible}
        title={"Enter a title for this place"}
        dialogStyle={{backgroundColor: 'white', borderRadius: 20}}
        textInputProps={{
          autoCorrect: false,
            autoCapitalize: false,
            maxLength: 10,
        }}
        hintInput={'name of place'}
        initValueTextInput={""}
        submitText={'submit'}
        cancelText={'cancel'}
        submitInput={(title) => {
          setMarkers([...markers, makeNewMarker(newmarkerCoordinate, title)]);
          setDialogVisible(false);
        }}
        closeDialog={() => {
          setDialogVisible(false);
        }}
      />



      <View style={styles.header}>
          <Text style={styles.titleText}>MY APPLICATION</Text>
      </View>


      
      <View style={styles.map} >
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

          onLongPress={(e) => {
            setNewmarkerCoordinate(e.nativeEvent.coordinate);
            setDialogVisible(true);
          }}
          >
          {markers}
          </MapView>
        )}
      </View>




      <View style={styles.restaurantList}>
          <View style={styles.locationInfoContainer}>
              <Text style={styles.normalText}>
                {selectedMarker.title}
              </Text>
              <TouchableOpacity
                style={styles.locationInfoButton}
              >
                <Text style={styles.normalText}>
                add foods here
                </Text>
              </TouchableOpacity>
          </View>
      </View>
    </View>
  );  // return
}
