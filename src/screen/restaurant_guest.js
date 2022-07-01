import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable} from 'react-native';
import {useState, useEffect} from 'react';
import  {DataStore} from '@aws-amplify/datastore';
import {Restaurant, Place, Member,} from '../models';
import { styles, colorPack } from '../style/style';
import MapView, { Marker } from 'react-native-maps';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard'

export default function Restaurant_page_guest({route, navigation}){
    
    const user = route.params.user;//{username: 'test', email: ''}
    const [restaurant, setRestaurant] = useState(route.params.restaurant);
    const [place, setPlace] = useState(route.params.place);
    const setRestaurantList = route.params.setRestaurantList;
    const refreshRestaurantList = route.params.refreshRestaurantList;
    var restaurantList = route.params.restaurantList;
    console.log('place', place)
    console.log('restaurant', restaurant)

    const sendMoney = async () => {
        Clipboard.setString(restaurant.account);
        alert('보내실 주소가 복사되었습니다.\n카카오페이로 이동합니다.');
        Linking.openURL(restaurant.account)
    }

    const makeNewMember = async () => {
        const isRegistered = await DataStore.query(Member, member => member.username("eq", user.username).restaurantID("eq", restaurant.id))
        console.log(isRegistered)
        if(isRegistered.length == []){
            await DataStore.save(
                new Member({
                    "username": user.username,
                    "email": user.email,
                    "menu_fee_array": [],
                    "restaurantID": restaurant.id,
                })
            );

            const CURRENT_ITEM = restaurant;
            await DataStore.save(Restaurant.copyOf(CURRENT_ITEM, updated => {
            // Update the values on {item} variable to update DataStore entry
            updated.num_members = updated.num_members +1;
            }));
            setRestaurant({...restaurant, num_members: restaurant.num_members + 1})
        }
        else{
            alert('이미 가입하셨습니다.')
        }
        
    }

    const deleteMember = async () => {
        if(user.id !== restaurant.makerID){
        // 소유자이면 자기를 멤버에서 빼는 것 불가
            try {
                await DataStore.delete(Member, member => member.username("eq", user.username).restaurantID("eq", restaurant.id));

                const CURRENT_ITEM = await DataStore.query(Restaurant, restaurant.id);
                await DataStore.save(Restaurant.copyOf(CURRENT_ITEM, updated => {
                // Update the values on {item} variable to update DataStore entry
                updated.num_members = updated.num_members -1;
                }));
                navigation.navigate('Main');
                setRestaurant({...restaurant, num_members: restaurant.num_members - 1})
                refreshRestaurantList(id=restaurant.placeID);
            } catch (error) {
                console.log(error)
                if(error.code === 'ConcurrentModificationException'){
                    alert('자신이 속한 가게가 아닙니다.')
                }
                else if(error.code === 'NotFoundException'){
                    alert('자신이 속한 가게가 아닙니다.')
                }
                else{
                    console.log('에러가 뭔지 모르겠어요')
                }
            }
        }
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
                    {restaurant.num_members==0?`배달료 총 ${restaurant.fee}원`:`배달료: ${restaurant.fee}원 / ${restaurant.num_members}명 = ${restaurant.fee/restaurant.num_members}원`}
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
                onPress={()=>sendMoney()}
                >
                    <Text style={styles.highlightText}>
                        {'송금하러\n가기'}
                    </Text>
                </TouchableOpacity>

                
                <TouchableOpacity style={styles.restaurantButton_1}
                    onPress={() => makeNewMember()}
                >
                    <Text style={styles.highlightText}>
                        {'주문하기'}
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.restaurantButton_2}
                onPressOut={() => deleteMember()}
                >
                    <Text style={styles.highlightText}>
                        {'주문취소'}
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
