import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable} from 'react-native';
import {useState, useEffect} from 'react';
import  {DataStore} from '@aws-amplify/datastore';
import {Restaurant, Place} from '../models';
import { styles, colorPack } from '../style/style';
import MapView, { Marker } from 'react-native-maps';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard'
import Restaurant_page_auth from './restaurant_auth';
import Restaurant_page_guest from './restaurant_guest';

export default function Restaurant_page({route, navigation}){
    console.log('makerID', route.params.restaurant.makerID)
    console.log('username', route.params.user.username)
    if(route.params.restaurant.makerID === route.params.user.username){
        return (
            <Restaurant_page_auth route={route} navigation={navigation}/>
            );
    }
    else{
        return (
            <Restaurant_page_guest route={route} navigation={navigation}/>
            );
    }
    
<<<<<<< HEAD
}
=======
    const [restaurant, setRestaurant] = useState(route.params);
    // console.log(restaurant)
    const [place, setPlace] = useState(restaurant.place);
    const setRestaurantList = route.params.setRestaurantList;
    const refreshRestaurantList = route.params.refreshRestaurantList;
    var restaurantList = route.params.restaurantList;
    console.log('restaurantlist',restaurantList)

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {restaurant.name}
                </Text>
            </View>


            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {`배달료: ${restaurant.fee}원 / ${restaurant.members}명 = ${restaurant.fee/restaurant.members}원`}
                </Text>
            </View>


            <View style={styles.restaurantButtonContainer}>
                <TouchableOpacity style={styles.restaurantButton_1}

                >
                    <Text style={styles.highlightText}>
                        {'배민\n바로가기'}
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.restaurantButton_2}

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
                onPressOut={() => deleteRestaurant(restaurant.id, navigation, restaurantList, refreshRestaurantList)}
                >
                    <Text style={styles.highlightText}>
                        {'모집\n삭제'}
                    </Text>
                </TouchableOpacity>

            </View>


            <View style={styles.map} >
            {place.placeCoordinate && (
              <MapView
              provider='google'
              style={styles.map}
              initialRegion={{longitude: place.placeCoordinate.longitude, latitude: place.placeCoordinate.latitude, latitudeDelta: 0.003, longitudeDelta: 0.003}}
              showsMyLocationButton={false}
              showsUserLocation={true}
              loadingEnabled={true}
              zoomEnabled={true}
              rotateEnabled={true}
              >
                <Marker
                    coordinate={place.placeCoordinate}
                    title={place.placeName}
                    description={`${place.placeName}`}
                    key={place.placeID}
                />
              </MapView>
            )}
          </View>
    
        </View>

    );
}

async function deleteRestaurant(key, navigation, restaurantList, refreshRestaurantList){
    const modelToDelete = await DataStore.query(Restaurant, key);
    DataStore.delete(modelToDelete);
    navigation.navigate('Main');
    restaurantList = restaurantList.filter(restaurant => restaurant.key !== key);
    console.log(restaurantList)
    refreshRestaurantList()
}
>>>>>>> 음식점 추가하고 삭제할때마다 새로고침됨
