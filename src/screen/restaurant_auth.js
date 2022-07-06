import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable} from 'react-native';
import {useState, useEffect} from 'react';
import  {DataStore} from '@aws-amplify/datastore';
import {Restaurant, Place, Member} from '../models';
import { styles, colorPack, height } from '../style/style';
import MapView, { Marker } from 'react-native-maps';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard'

export default function Restaurant_page_auth({route, navigation}){
    
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

    const[account, setAccount] = useState(restaurant.account);
    const[fee, setFee] = useState(restaurant.fee);

    useEffect(() => {
        getMembers(); // get member from database
        // console.log('user', user)
        // console.log('member', member)
        // console.log('restaurant', restaurant)
        // console.log('place', place)
    }, [isRegistered, modalVisible]);
    
    const getMembers = async () => {
        const members = await DataStore.query(Member, member=>member.restaurantID('eq', restaurant.id));
        console.log('members', members)
        const _membersList = []
        members.forEach(async (member, index) => {
            const _m = Members(user, member, restaurant, index)
            
            _membersList.push(_m)            
        })
        setMembersList(_membersList)

        setMember(members)
    }

    const sendMoney = async () => {
        // Clipboard.setString(restaurant.account);
        // alert('보내실 주소가 복사되었습니다.\n카카오페이로 이동합니다.');
        // Linking.openURL(restaurant.account)
        
        const menu = member[0].menu.toString();
        // const menuList = menu.join(',')
        console.log(`${member.price + (restaurant.fee/restaurant.num_members)}`)

        console.log('돈 보내야 하는 사람들', member)
        Linking.openURL(`sms:${member[0].phone_number}&body=Pseudo Tesla 배달앱에서 알려드립니다.\n${restaurant.name}으로 주문하신 메뉴(${member[0].menu.toString()})를 주문하기 위해 아래 링크로 ${member[0].price + (restaurant.fee/restaurant.num_members)} 원을 송금해주세요.\n${restaurant.account}`)
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

            const CURRENT_ITEM = await DataStore.query(Restaurant, restaurant.id);
            await DataStore.save(Restaurant.copyOf(CURRENT_ITEM, updated => {
            // Update the values on {item} variable to update DataStore entry
            updated.num_members = updated.num_members +1;
            setRestaurant({...restaurant, num_members: updated.num_members});
            }));
            console.log('새로운 멤버가 추가되었습니다.', restaurant)
            
            alert('추가되었습니다.\n이제 메뉴를 추가해주세요')
            setModalVisible(true);
            refreshRestaurantList(id=place.id);
        }
        else{
            alert('이미 추가되었으므로\n메뉴 추가 페이지로 넘어갑니다.')
            console.log(restaurant)
            setModalVisible(true);
        }
    }

    const deleteRestaurant = async () => {
        if(user.username === restaurant.makerID){
        // 소유자일때 가능
            try {
                const modelToDelete = await DataStore.query(Restaurant, restaurant.id);
                DataStore.delete(modelToDelete);

                const CURRENT_ITEM = await DataStore.query(Place, place.id);
                await DataStore.save(Place.copyOf(CURRENT_ITEM, updated => {
                // Update the values on {item} variable to update DataStore entry
                updated.num_restaurants = updated.num_restaurants - 1;
                }));

                navigation.goBack();
                refreshRestaurantList(id=place.id);
            } catch (error) {
                console.log(error)
            }
        }
        else{
            alert('자신이 만든 모집이 아니라서 삭제할 수 없습니다.')
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

        if(restaurant.account === account||restaurant.fee === fee){
            const CURRENT_RESTAURANT = await DataStore.query(Restaurant, restaurant.id);
            await DataStore.save(Restaurant.copyOf(CURRENT_RESTAURANT, updated => {
                // Update the values on {item} variable to update DataStore entry
                updated.account = account;
                updated.fee = fee;
            }));
        }

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
            style={[styles.textInputBox_restaurant_menu, styles.highlightText,{borderWidth:0, marginBottom:0}]}
            editable={false}
            placeholder={'송금 코드'}
            placeholderTextColor={colorPack.text_dark}
            ></TextInput>

            <TextInput 
            style={[styles.textInputBox_restaurant_price, styles.normalText,{borderWidth:0, marginBottom:0}]}
            editable={false}
            placeholder={'배달료'}
            placeholderTextColor={colorPack.text_dark}
            ></TextInput>

          </View>


          <View style={{
            flexDirection:'row',
            alignItems:'center',
          }}>

            <TextInput 
            style={[styles.textInputBox_restaurant_menu, styles.normalText, {textAlign:'left'}]}
            placeholder={restaurant.account}
            placeholderTextColor={colorPack.deactivated}
            onChangeText={(text) => {
                if(text){
                    setAccount(text)
                }
                else{
                    setAccount(restaurant.account)
                }
            }}
            ></TextInput>

            <TextInput 
            style={[styles.textInputBox_restaurant_price, styles.normalText,]}
            placeholder={String(restaurant.fee)}
            placeholderTextColor={colorPack.deactivated}
            keyboardType='numeric'
            onChangeText={(text)=>{
                if(text){
                    setFee(parseInt(text))
                }
                else{
                    setFee(restaurant.fee)
                }            
            }}

            ></TextInput>

            </View>



          <View style={{
            flexDirection:'row',
          }}>

            <TextInput 
            style={[styles.textInputBox_restaurant_menu, styles.highlightText,{borderWidth:0, marginBottom:0}]}
            editable={false}
            placeholder={'주문할 전체 메뉴'}
            placeholderTextColor={colorPack.text_dark}
            ></TextInput>

            <TextInput 
            style={[styles.textInputBox_restaurant_price, styles.normalText,{borderWidth:0, marginBottom:0}]}
            editable={false}
            placeholder={'메뉴 가격(원)'}
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
                    alert('메뉴 또는 가격이 입력되지 않았습니다.')
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
            </View>


            <View style={styles.header}>
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
                    <Text style={styles.highlightText}>
                        {'배민\n바로가기'}
                    </Text>
                </TouchableOpacity>

                
                <TouchableOpacity style={styles.restaurantButton_2}
                    onPress={() => makeNewMember()}
                >
                    <Text style={styles.highlightText}>
                        {'주문또는\n정보수정'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.restaurantButton_1}
                onPress={()=>sendMoney()}
                >
                    <Text style={styles.highlightText}>
                        {'모집종료\n송금요청'}
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.restaurantButton_2}
                onPressOut={() => deleteRestaurant()}
                >
                    <Text style={styles.highlightText}>
                        {'모집취소'}
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
                <TouchableOpacity
                onPress={
                    ()=>{
                        Linking.openURL(`sms:${member.phone_number}&body=Pseudo Tesla 배달앱에서 알려드립니다.\n${restaurant.name}으로 주문하신 메뉴(${member.menu.toString()})를 주문하기 위해 아래 링크로 ${member.price + (restaurant.fee/restaurant.num_members)} 원을 송금해주세요.\n${restaurant.account}`)                  
                    }
                }
                
                >              
                <Text style={[styles.highlightText, styles.restaurantFee]}
                ellipsizeMode='tail'
                numberOfLines={1}
                >{member.username===user.username?'나의 주문':member.email.split('@')[0]}
                </Text>
                <Text style={[styles.normalText, styles.restaurantFee]}
                ellipsizeMode='tail'
                numberOfLines={1}
                >{'클릭해서 문자전송'}
                </Text>
                </TouchableOpacity>
    
                <TouchableOpacity 
                onPress={()=>{
                    alert(`${member.menu}`)
                }}
                >
                <Text style={[styles.normalText,styles.restaurantName]}>{`${member.menu[0]} 등 ${member.menu.length}개`}</Text>
                </TouchableOpacity>
        
                <Text style={[styles.normalText, styles.restaurantMembers]}>{Math.ceil(member.price + (restaurant.fee/restaurant.num_members))+'원'}</Text>
    
            </TouchableOpacity>

        )
    }