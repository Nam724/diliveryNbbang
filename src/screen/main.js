import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable} from 'react-native';
import {useState, useEffect} from 'react';
import { styles, width } from '../style/style';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import uuid from 'react-native-uuid';
import DialogInput from 'react-native-dialog-input';
import Main_restaurantlist from './main_restaurantlist';
import  {DataStore} from '@aws-amplify/datastore';
import {Restaurant, Place} from '../models';
import { createPlace } from '../graphql/mutations';
import { API } from 'aws-amplify';
import { graphqlOperation } from 'aws-amplify';

export default function Main() {

// MAP
// get location
  const [location, setLocation] = useState(
    {latitude: 35.572676, longitude: 129.188191, latitudeDelta: 0.003, longitudeDelta: 0.003}
  ); // coordinate = {latitude: 37.4219525, longitude: -122.0837251}

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
        getMarkers();
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

  const returnMarker = (data) => {// data should contain id, name, latitude, longitude
    console.log('makeMarker')
    let coordinate = {longitude: data.longitude, latitude: data.latitude};
    let title = data.name;
    let key = data.id;
    let createdAt = data.createdAt;
    
    return (
      <Marker
        coordinate={coordinate}
        title={title}
        description={`created at ${createdAt}`}
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

//MARKER
  // current markers
  const [markers, setMarkers] = useState([]); // use makeMarker(data)

  async function getMarkers() {
    const models = await DataStore.query(Place);
    let _markerlist = []
    models.forEach(model => {_markerlist.push(returnMarker(model))});
    setMarkers(_markerlist);
    console.log(_markerlist);
  }

  // get log pressed location and add marker
  const [newmarkerCoordinate, setNewmarkerCoordinate] = useState(null);

  // make new marker
  async function makeNewMarker(coordinate, title){
    const key = 'markers%' + uuid.v4()
    setSelectedMarker(
      {
        coordinate: coordinate,
        title: title,
        key: key,
      }
    );
    setMarkers([...markers, returnMarker({ "latitude": coordinate.latitude, "longitude": coordinate.longitude, "name": title, "id": key, "createdAt": new Date() })]);
    await DataStore.save(
      new Place({
      "latitude": coordinate.latitude,
      "longitude": coordinate.longitude,
      "name": title,
      "Restaurants_in_a_place": []
      })
    );
    console.log('saved');
  }

// selected marker info
  const [selectedMarker, setSelectedMarker] = useState({
    coordinate: {}, // {logitude: 0, latitude: 0}
    title: 'restaurant',
    key: 'markers%',
  });

 // get marker name dialog
  const [dialogVisible_marker, setDialogVisible_marker] = useState(false); 




// RESTAURANT LIST
const [restaurantList, setRestaurantList] = useState([
  Main_restaurantlist('1231', 'restaurant1', '10', '10'),
  Main_restaurantlist('2423', 'restaurant2', '20', '20'),
  Main_restaurantlist('53534', 'restaurant3', '30', '30'),
]);

// get restaurant list
const [dialogVisible_restaurant, setDialogVisible_restaurant] = useState(false);

// const [newRestaurant, setNewRestaurant] = useState({});
const [newRestaurant_name, setNewRestaurant_name] = useState(null);
const [newRestaurant_fee, setNewRestaurant_fee] = useState(null);
const [newRestaurant_url, setNewRestaurant_url] = useState(null);

// make new restaurant
async function saveNewRestaurant(name, fee, url, placeID){
    
  console.log({
    "name": name,
    "fee": fee,
    "url": url,
    "placeID": placeID,
  })
  // amplify
  await DataStore.save(
    new Restaurant({
		"name": name,
		"fee": fee,
		"url": url,
		"placeID": placeID,
	}));
}


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
            maxLength: 30,
        }}
        hintInput={'name of place'}
        initValueTextInput={""}
        submitText={'submit'}
        cancelText={'cancel'}
        submitInput={(title) => {
          makeNewMarker(newmarkerCoordinate, title);
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
            <Text style={[styles.normalText,{textAlign:'center'}]}>{'배달의 민족 url'}</Text>
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
                { let name = newRestaurant_name;
                  let fee = parseInt(newRestaurant_fee);
                  let url = newRestaurant_url;
                  let placeID = selectedMarker.key;
                  setDialogVisible_restaurant(false);
                  setNewRestaurant_name(null);
                  setNewRestaurant_fee(null);
                  setNewRestaurant_url(null);
                  saveNewRestaurant(name, fee, url, placeID);
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
                {selectedMarker.key=='markers%'?'select pin':'add restaurants here'}
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

