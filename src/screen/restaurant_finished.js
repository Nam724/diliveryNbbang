import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {useState, useEffect} from 'react';
import  {DataStore} from '@aws-amplify/datastore';
import { Member,} from '../models';
import { styles, colorPack, map_darkStyle } from '../style/style';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard'
import { sendSMSAsync } from 'expo-sms';

const API_KEY_android = Config.google_map_API_KEY_android;
const API_KEY_ios = Config.google_map_API_KEY_ios;
export default function Restaurant_page_finished({route, navigation}){
    

    const [member, setMember] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const user = route.params.user;//{username: 'test', email: ''}
    const restaurant = route.params.restaurant;//{makerID: 'test', name: '', fee: 0, num_members: 0, menu: [], isFinishRecruiting: false}
    const place = route.params.place;//{name: '', latitude: 0, longitude: 0}


    useEffect(() => {
        getMembers(); // get member from database
        // console.log('user', user)
        // console.log('member', member)
        // console.log('restaurant', restaurant)
        // console.log('place', place)
    }, []);
    
    const getMembers = async () => {
        const members = await DataStore.query(Member, member=>member.restaurantID('eq', restaurant.id));

        const _membersList = []
        members.forEach(async (m, index) => {
            const _m = Members(user, m, restaurant, index)

            _membersList.push(_m)
            if(m.username==user.username){
                setIsRegistered(true)
                // console.log('등록됨!')
            }
            // console.log(m)
        })
        setMembersList(_membersList)

        setMember(members)
        // console.log('isRegistered', isRegistered);
    }
    const sendMoney = async() => {
        Clipboard.setString(`${estaurant.account}`);

        const reg = /^(https:\/\/qr.kakaopay.com\/)(.*)+$/;
        
        if (reg.test(restaurant.account)===true){
            Alert.alert('배달앤빵','보내실 주소가 복사되었습니다.', [{text: '카카오페이로 이동', onPress: () => {
                Linking.openURL(`${restaurant.account}`);
            }}, {text: '닫기'}]);
        }
        else{
            Alert.alert('배달앤빵','보내실 주소가 복사되었습니다.', [{text: '닫기'}]);
        }
    }

    const sendSMStoAuthor = async() => {
        
        
        const makerPhoneNumber = member.filter(member => member.username == restaurant.makerID)[0].phone_number;

        // console.log(makerPhoneNumber)
        sendSMSAsync(makerPhoneNumber, `배달앤빵 주문자: ${user.email.split('@')[0]} 주문한 음식점: ${restaurant.name}\n`)
        
    }
    const [membersList, setMembersList] = useState(
        [
            
        ]
    );

    return (
        <View style={styles.container}>

        
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {`배달 모집 완료! ${restaurant.name}`}
                </Text>
                <Text style={styles.highlightText}>
                    {restaurant.num_members==0?`배달료 총 ${restaurant.fee}원`:`배달료: ${restaurant.fee}원 / ${restaurant.num_members}명 = ${Math.ceil(restaurant.fee/restaurant.num_members)}원`}
                </Text>
            </View>



            <View style={styles.restaurantButtonContainer}>
                <TouchableOpacity style={styles.restaurantButton_1}
                onPress={() => {
                    Linking.openURL(restaurant.url);
                }}
                disabled={!isRegistered}
                >
                    <Text style={(isRegistered)?styles.normalText:styles.deactivated}>
                        {'배민\n바로가기'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.restaurantButton_2}
                    onPress={() => {
                        Alert.alert('배달앤빵','준비중입니다.', [{text: '닫기'}]);
                    }}
                >
                    <Text style={(isRegistered)?styles.normalText:styles.deactivated}>
                        {'나의주문\n메뉴보기'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.restaurantButton_1}
                onPress={()=>sendMoney()}
                disabled={!isRegistered}
                >
                    <Text style={(isRegistered)?styles.normalText:styles.deactivated}>
                        {'송금하러\n가기'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.restaurantButton_2}
                    onPress={() => {
                        sendSMStoAuthor()}}
                        disabled={!isRegistered}
                >
                    <Text style={(isRegistered)?styles.normalText:styles.deactivated}>
                        {'주문자에게\n문자보내기'}
                    </Text>
                </TouchableOpacity>

            </View>


            <View style={styles.mapContainer} >
              <MapView
              provider={PROVIDER_GOOGLE}
              key={Platform.OS === 'android' ? API_KEY_android : API_KEY_ios}              customMapStyle={map_darkStyle}
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
            
            <ScrollView style={styles.restaurantListContainer}>
            {membersList}
            </ScrollView>
        </View>

    );
}


function Members(user, member, restaurant, index){

//    console.log('Members', user, member, restaurant, index)

    const backgroundColor_odd = colorPack.highlight_dark
    const backgroundColor_even = colorPack.highlight_light
    var myBackgroundColor
    if(Number(index) %2 == 0){
        myBackgroundColor = backgroundColor_even
    }
    else{
        myBackgroundColor = backgroundColor_odd
    }
    return(
        
        <TouchableOpacity style={[styles.restaurantList,{backgroundColor:myBackgroundColor}]} key={member.id}
        disabled={true}
        >

            <Text style={[styles.highlightText, styles.restaurantFee]}
            ellipsizeMode='tail'
            numberOfLines={1}
            >{member.username===user.username?'나의 주문':member.email.split('@')[0]}
            </Text>

            <TouchableOpacity 
            onPress={()=>{
                Alert.alert(`${member.email.split('@')[0]}님이 주문하신 메뉴`,`${member.menu}\n음식값: ${member.price}원, 배달료: ${restaurant.fee/restaurant.num_members}원`, [{text:'닫기'}])
            }}
            >
            <Text style={[styles.normalText,styles.restaurantName]}>{`${member.menu[0]} 등 ${member.menu.length}개`}</Text>
            </TouchableOpacity>


            <Text style={[styles.normalText, styles.restaurantMembers]}>{Math.ceil(member.price + (restaurant.fee/restaurant.num_members))+'원'}</Text>

        </TouchableOpacity>
    )
}