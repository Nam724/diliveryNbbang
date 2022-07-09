import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable, Alert} from 'react-native';
import {useState, useEffect} from 'react';
import  {DataStore} from '@aws-amplify/datastore';
import {Restaurant, Place, Member,} from '../models';
import { styles, colorPack, width, height, map_darkStyle } from '../style/style';
import MapView, { Marker } from 'react-native-maps';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard'


export default function Restaurant_page_guest({route, navigation}){
    
    console.log('Restaurant_page_guest', route);

    const user = route.params.user;//{username: 'test', email: ''}
    const [restaurant, setRestaurant] = useState(route.params.restaurant);
    const [place, setPlace] = useState(route.params.place);
    const setRestaurantList = route.params.setRestaurantList;
    const refreshRestaurantList = route.params.refreshRestaurantList;
    var restaurantList = route.params.restaurantList;
    

    const [member, setMember] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [menuList, setMenuList] = useState(null);
    const [menuPrice, setMenuPrice] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    
    useEffect(() => {
        getMembers(); // get member from database
        // console.log('user', user)
        // console.log('member', member)
        // console.log('restaurant', restaurant)
        // console.log('place', place)
    }, [isRegistered, modalVisible]);
    
    const getMembers = async () => {
        const members = await DataStore.query(Member, member=>member.restaurantID('eq', restaurant.id));
        // console.log('members', members)
        const _membersList = []
        members.forEach(async (member, index) => {
            const _m = Members(user, member, restaurant, index)
            _membersList.push(_m)            
        })
        setMembersList(_membersList)

        if(members.filter(member=>member.username===user.username).length>0){
            setIsRegistered(true)
        }
    }

    const makeNewMember = async () => {
        const _isRegistered = await DataStore.query(Member, member => member.username("eq", user.username).restaurantID("eq", restaurant.id))
        // console.log(_isRegistered)
        if(_isRegistered.length == []){
            await DataStore.save(
                new Member({
                    "username": user.username,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "menu": ['메뉴 없음'], 
                    "fee":0,
                    "restaurantID": restaurant.id,
                })
            );

            const CURRENT_ITEM = restaurant;
            await DataStore.save(Restaurant.copyOf(CURRENT_ITEM, updated => {
            // Update the values on {item} variable to update DataStore entry
            updated.num_members = updated.num_members +1;
            }));
            setRestaurant({...restaurant, num_members: restaurant.num_members + 1})
            refreshRestaurantList(id=place.id);
            // Alert.alert('배달앤빵','메뉴를 추가해주세요.',[{text:'메뉴추가', onPress:()=>{setModalVisible(true)}},{text:'닫기', onPress:()=>{}}])
            setModalVisible(true);
        }
        else{
            Alert.alert('배달앤빵','이미 등록되었습니다.',[{text:'메뉴추가', onPress:()=>{setModalVisible(true)}},{text:'닫기', onPress:()=>{}}])
        }
    }

    const deleteMember = async () => {
        if(user.username !== restaurant.makerID){
        // 소유자이면 자기를 멤버에서 빼는 것 불가
            try {
                const _member = await DataStore.delete(Member, member => member.username("eq", user.username).restaurantID("eq", restaurant.id));
                
                console.log('memberLength', _member.length)
                if(_member.length>0){

                    const CURRENT_ITEM = await DataStore.query(Restaurant, restaurant.id);
                    await DataStore.save(Restaurant.copyOf(CURRENT_ITEM, updated => {
                    // Update the values on {item} variable to update DataStore entry
                    updated.num_members = _member.length -1;
                    }));
                    navigation.goBack();
                    setRestaurant({...restaurant, num_members: restaurant.num_members - 1})
                    refreshRestaurantList(id=restaurant.placeID);
                    setIsRegistered(false);
                }
                else{
                    Alert.alert('배달앤빵','등록되지 않은 음식점입니다.',[{text:'닫기'}])
                }
            } catch (error) {
                console.log(error)
                if(error.code === 'ConcurrentModificationException'){
                    Alert.alert('배달앤빵','자신이 속한 가게가 아닙니다.',[{text:'닫기'}])
                }
                else if(error.code === 'NotFoundException'){
                    Alert.alert('배달앤빵','자신이 속한 가게가 아닙니다.',[{text:'닫기'}])
                }
                else{
                    console.log('에러가 뭔지 모르겠어요')
                }
            }
        }
        else{
            Alert.alert('배달앤빵','자신이 만든 모집은 삭제할 수 없습니다.',[{text:'확인'}])
        }
    }

    const addMenu = async () => {
        console.log('addMenu')

        const _menuList = menuList.split('\n');
        console.log('_menuList', _menuList)
        console.log('menuPrice', menuPrice)

        const CURRENT_Member = await DataStore.query(Member, member => member.username("eq", user.username).restaurantID("eq", restaurant.id));
        console.log('current member', CURRENT_Member[0])
        try {await DataStore.save(Member.copyOf(CURRENT_Member[0], updated => {
            // Update the values on {item} variable to update DataStore entry
            updated.menu = _menuList;
            updated.price = menuPrice;
        }));

        setModalVisible(false)}
        catch (error) {
            console.log(error)
        }
    }

    const [membersList, setMembersList] = useState(
        [
            
        ]
    );

    return (
        <View style={styles.container}>

        <Modal animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        >
            <Pressable style={{
            flex:1,
            backgroundColor:'transparent',
            }}
            onPress={()=>
                {setModalVisible(false);}
            }
            />
  
          <View style={styles.restaurantPageModal}>
          

          <View style={{
            flexDirection:'row',
          }}>

            <TextInput 
            style={[styles.textInputBox_restaurant_menu, styles.highlightText,{borderWidth:0}]}
            editable={false}
            placeholder={'주문 메뉴'}
            placeholderTextColor={colorPack.text_dark}
            ></TextInput>

            <TextInput 
            style={[styles.textInputBox_restaurant_price, styles.normalText,{borderWidth:0}]}
            editable={false}
            placeholder={'가격(원)'}
            placeholderTextColor={colorPack.text_dark}
            ></TextInput>

          </View>

          <View style={{
            flexDirection:'row',
            alignItems:'center',
          }}>

            <TextInput 
            style={[styles.textInputBox_restaurant_menu, styles.normalText, {textAlign:'left'}]}
            multiline={true}

            placeholder={'주문할 메뉴를 입력해주세요.\n이때 한 줄에 \n하나의 메뉴를 입력해 주세요.\n해당 내용을 통해 방장이\n자동으로 주문할 수 있습니다.'}
            placeholderTextColor={colorPack.deactivated}
            onChangeText={(text) => {setMenuList(text)}}
            ></TextInput>

            <TextInput 
            style={[styles.textInputBox_restaurant_price, styles.normalText,]}
            placeholder={'배달비제외'}
            placeholderTextColor={colorPack.deactivated}
            keyboardType='numeric'
            onChangeText={(text)=>{setMenuPrice(parseInt(text))}}

            ></TextInput>

        </View>


          <View style={{flexDirection:'row', marginVertical:height*100/2000}}>
          
          <TouchableOpacity
          style = {styles.modalButton}
          onPress={()=>
            
            {setModalVisible(false);}}

          >
          <Text style={styles.highlightText}>
          {'닫기'}
          </Text>
            </TouchableOpacity>

            <TouchableOpacity
          style = {styles.modalButton}
          onPress={()=>{
                if(menuList && menuPrice){
                    
                    addMenu();
                }
                else{
                    Alert.alert('배달앤빵','메뉴 또는 가격이 입력되지 않았습니다.',[{text: '확인'}])
                }
            }}
            >
          <Text style={styles.highlightText}>
          {'메뉴 추가 완료'}
          </Text>
            </TouchableOpacity>

          </View>
          
          
          </View>

            
        </Modal>




            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {restaurant.name}
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
                >
                    <Text style={styles.normalText}>
                        {'배민\n바로가기'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.restaurantButton_2}
                    onPress={() => makeNewMember()}
                >
                    <Text style={styles.normalText}>
                        {'주문하기'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.restaurantButton_1}
                
                disabled={true}
                >
                    <Text style={styles.normalText}>
                        {'모집종료 후\n입금가능'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.restaurantButton_2}
                onPressOut={() => deleteMember()}
                >
                    <Text style={styles.normalText}>
                        {'주문취소'}
                    </Text>
                </TouchableOpacity>

            </View>


            <View style={styles.mapContainer} >
              <MapView
              provider='google'
              customMapStyle={map_darkStyle}
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
                Alert.alert(`${member.email.split('@')[0]}님이 주문하신 메뉴`,`${member.menu}`, [{text:'닫기'}])
            }}
            >
            <Text style={[styles.normalText,styles.restaurantName]}>{`${member.menu[0]} 등 ${member.menu.length}개`}</Text>
            </TouchableOpacity>


            <Text style={[styles.normalText, styles.restaurantMembers]}>{Math.ceil(member.price + (restaurant.fee/restaurant.num_members))+'원'}</Text>

        </TouchableOpacity>
    )
}