import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable} from 'react-native';
import {useState, useEffect} from 'react';
import { styles, width } from '../style/style';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import uuid from 'react-native-uuid';
import DialogInput from 'react-native-dialog-input';


export default function Main() {

// MAP
// get location
  const [location, setLocation] = useState(
    {latitude: 35.572676, longitude: 129.188191, latitudeDelta: 0.003, longitudeDelta: 0.003}
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
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      })();
  }, []); 

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } 
  else if (location) {
    text = JSON.stringify(location);
  }
  // console.log(location)

//MARKER
  // get log pressed location and add marker
  const [markers, setMarkers] = useState([]);
  const [newmarkerCoordinate, setNewmarkerCoordinate] = useState(null);
  const makeNewMarker = (coordinate, title) => {
    setDialogVisible_marker(true)
    const key = 'markers%' + uuid.v4()
    setSelectedMarker(
      {
        coordinate: coordinate,
        title: title,
        key: key,
      }
    );
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
  const [dialogVisible_marker, setDialogVisible_marker] = useState(false); 

// RESTAURANT LIST
const [restaurantList, setRestaurantList] = useState([]);

// get restaurant list
const [dialogVisible_restaurant, setDialogVisible_restaurant] = useState(false);

const [newRestaurant, setNewRestaurant] = useState({});
const [newRestaurant_name, setNewRestaurant_name] = useState(null);
const [newRestaurant_fee, setNewRestaurant_fee] = useState(null);
const [newRestaurant_url, setNewRestaurant_url] = useState(null);


 // return 
  return (
    <View style={styles.container}>

      <DialogInput
        isDialogVisible={dialogVisible_marker}
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
          setDialogVisible_marker(false);
        }}
        closeDialog={() => {
          setDialogVisible_marker(false);
        }}
      />





      <Modal animationType='fade'
      transparent={true}
      visible={dialogVisible_restaurant}
      onRequestClose={() => {
        setDialogVisible_restaurant(false);
      }}
      >
      <Pressable style={{
        flex:1,
        backgroundColor:'transparent',
      }}
      onPress={()=>setDialogVisible_restaurant(false)}
      />

        <View style={styles.restaurantInfoContainerModal}>

          <Text style={[styles.titleText,{marginTop:20}]}>{`Make new restaurant in ${selectedMarker.title}!`}</Text>

          
          <View style={styles.getRestaurantInfoModal}>
            <Text style={[styles.normalText,{textAlign:'center'}]}>{'restaurant name'}</Text>
            <TextInput style={styles.inputText}
            onChangeText={(text) =>
              setNewRestaurant_name(text)
            }
            />
          </View>

          <View style={styles.getRestaurantInfoModal}>
            <Text style={[styles.normalText,{textAlign:'center'}]}>{'delivery Fee(won)'}</Text>
            <TextInput style={styles.inputText}
            onChangeText={(text) => setNewRestaurant_fee(text)}
            keyboardType='numeric'
            />
          </View>

          <View style={styles.getRestaurantInfoModal}>
            <Text style={[styles.normalText,{textAlign:'center'}]}>{'url'}</Text>
            <TextInput style={styles.inputText}
            onChangeText={(text) => setNewRestaurant_url(text)}
            />
          </View>

          <View style={styles.buttonContainerModal}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => 
                { setDialogVisible_restaurant(false);
                  setNewRestaurant_fee(null);
                  setNewRestaurant_name(null);
                  setNewRestaurant_url(null);
                }}>
              <Text style={styles.highlightText}>{'Close'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => 
                {
                  setDialogVisible_restaurant(false);
                  let _newRestaurant = {
                    name: newRestaurant_name,
                    fee: newRestaurant_fee,
                    url: newRestaurant_url,
                  }
                  setNewRestaurant_fee(null);
                  setNewRestaurant_name(null);
                  setNewRestaurant_url(null);
                  setNewRestaurant(_newRestaurant);
                  // console.log(_newRestaurant)
                }}>
              <Text style={styles.highlightText}>{'Submit'}</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </Modal>





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
            setDialogVisible_marker(true);
          }}
          >
          {markers}
          </MapView>
        )}
      </View>


      <View style={styles.restaurantContainer}>


          <View style={styles.locationInfoContainer}>
              <Text style={styles.highlightText}>
                {selectedMarker.title}
              </Text>
              <TouchableOpacity
                style={styles.locationInfoButton}
                onPressOut={() => {
                  {
                    if(selectedMarker.key!=='markers%'){
                      setDialogVisible_restaurant(true);
                    }
                  }
                  // console.log('add foods here!');
                }}
              >
                <Text style={styles.normalText}>
                {selectedMarker.key=='markers%'?'select pin':'add foods here'}
                </Text>
              </TouchableOpacity>
          </View>
            
          <ScrollView style={styles.restaurantListContainer}>
            {restaurantList}
          </ScrollView>



      </View>
    </View>
  );  // return
}

