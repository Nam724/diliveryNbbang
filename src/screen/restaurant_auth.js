import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable} from 'react-native';
import {useState, useEffect} from 'react';
import  {DataStore} from '@aws-amplify/datastore';
import {Restaurant, Place} from '../models';
import { styles, colorPack } from '../style/style';
import MapView, { Marker } from 'react-native-maps';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard'

export default function Restaurant_page_auth({route, navigation}){
    
    const [restaurant, setRestaurant] = useState(route.params.restaurant);
    // console.log(restaurant)
    const [place, setPlace] = useState(route.params.place);
    const setRestaurantList = route.params.setRestaurantList;
    const refreshRestaurantList = route.params.refreshRestaurantList;
    var restaurantList = route.params.restaurantList;
    console.log('place', place)
    console.log('restaurant', restaurant)

    const quitRecruiting = async () => {
        Clipboard.setString(restaurant.account);
        alert('보내실 주소가 복사되었습니다.\n카카오페이로 이동합니다.');
        Linking.openURL(restaurant.account)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {restaurant.name}
                </Text>
            </View>


            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {`배달료: ${restaurant.fee}원 / ${place.num_members}명 = ${restaurant.fee/place.num_members}원`}
                </Text>
            </View>


            <View style={styles.restaurantButtonContainer}>
                <TouchableOpacity style={styles.restaurantButton_1}
                onPress={() => {
                    Linking.openURL(restaurant.url);
                }}
                >
                    <Text style={styles.highlightText}>
                        {'배민\n바로가기'}
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.restaurantButton_2}
                onPress={()=>quitRecruiting()}
                >
                    <Text style={styles.highlightText}>
                        {'모집 종료 후\송금 받기'}
                    </Text>
                </TouchableOpacity>

                
                <TouchableOpacity style={styles.restaurantButton_1}

                >
                    <Text style={styles.highlightText}>
                        {'정보\수정'}
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.restaurantButton_2}
                onPressOut={() => deleteRestaurant(place, restaurant.id, navigation, restaurantList, refreshRestaurantList)}
                >
                    <Text style={styles.highlightText}>
                        {'모집\n삭제'}
                    </Text>
                </TouchableOpacity>

            </View>


            <View style={styles.map} >
              <MapView
              provider='google'
              style={styles.map}
              initialRegion={{longitude: place.longitude, latitude: place.latitude, latitudeDelta: 0.003, longitudeDelta: 0.003}}
              showsMyLocationButton={false}
              showsUserLocation={true}
              loadingEnabled={true}
              zoomEnabled={true}
              rotateEnabled={true}
              >
                <Marker
                    coordinate={{longitude: place.longitude, latitude: place.latitude}}
                    title={place.name}
                    description={`${place.num_restaurants}개의 레스토랑`}
                    key={place.id}
                />
              </MapView>
            
          </View>
    
        </View>

    );
}

async function deleteRestaurant(place, restaurantID, navigation, restaurantList, refreshRestaurantList){
    const modelToDelete = await DataStore.query(Restaurant, restaurantID);
    DataStore.delete(modelToDelete);

    const CURRENT_ITEM = place;
    await DataStore.save(Place.copyOf(CURRENT_ITEM, updated => {
      // Update the values on {item} variable to update DataStore entry
      updated.num_restaurants = updated.num_restaurants -1;
    }));
    navigation.navigate('Main');
    restaurantList = restaurantList.filter(restaurant => restaurant.key !== restaurantID);
    console.log(restaurantList)
    refreshRestaurantList()
}
