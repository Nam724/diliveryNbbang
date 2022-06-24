import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable} from 'react-native';
import { colorPack, styles, width } from '../style/style';


<<<<<<< HEAD:src/screen/main_restaurantList.js
function Main_restaurantList(user, restaurant, num, navigation, place, setRestaurantList, restaurantList, refreshRestaurantList) {
=======
function Main_restaurantlist(id, name, fee, url, num, navigation, place, setRestaurantList, restaurantList, refreshRestaurantList) {
>>>>>>> 음식점 추가하고 삭제할때마다 새로고침됨:src/screen/main_restaurantlist.js
  const backgroundColor_odd = colorPack.highlight_dark
  const backgroundColor_even = colorPack.highlight_light
  var myBackgroundColor
  if(Number(num) %2 == 0){
    myBackgroundColor = backgroundColor_even
  }
  else{
    myBackgroundColor = backgroundColor_odd
  }


  // console.log(restaurantList)

 // return 
  return (
<<<<<<< HEAD:src/screen/main_restaurantList.js
    <View style={[styles.restaurantList,{backgroundColor:myBackgroundColor}]} 
    key={restaurant.id}   
    >
    <TouchableOpacity
    onPress=  {() => {  
      navigation.navigate('Restaurant', {user:user, restaurant:restaurant, place:place,setRestaurantList:setRestaurantList, restaurantList:restaurantList, refreshRestaurantList:refreshRestaurantList})
=======
    <View style={[styles.restaurantList,{backgroundColor:myBackgroundColor}]} >
    <TouchableOpacity key={id}
    onPress=  {() => {  
      navigation.navigate('Restaurant', {id: id, name: name, fee: fee, url: url, place: place, setRestaurantList:setRestaurantList, restaurantList:restaurantList, refreshRestaurantList:refreshRestaurantList})
>>>>>>> 음식점 추가하고 삭제할때마다 새로고침됨:src/screen/main_restaurantlist.js
      // console.log('pressed')
    }}
    >

      <Text style={[styles.highlightText, styles.restaurantName]} numberOfLines={1} ellipsizeMode='tail' 
      >{restaurant.name}</Text>

      </TouchableOpacity>
<<<<<<< HEAD:src/screen/main_restaurantList.js
      <Text style={[styles.normalText, styles.restaurantFee,]} ellipsizeMode='tail' numberOfLines={1}>{restaurant.num_members==0?`배달료 총${restaurant.fee}원`:`배달료: 각${restaurant.fee/restaurant.num_members}원`}</Text>
=======
      <Text style={[styles.normalText, styles.restaurantFee,]} ellipsizeMode='tail' numberOfLines={1}>{`배달료: 각${fee}원`}</Text>
>>>>>>> 음식점 추가하고 삭제할때마다 새로고침됨:src/screen/main_restaurantlist.js

      <Text style={[styles.normalText, styles.restaurantMembers]} ellipsizeMode='tail' numberOfLines={1}>{`${restaurant.num_members}명`}</Text>

    </View>
  );  // return
}

function Main_restaurantList_sample(id, name, fee, num) {
  const backgroundColor_odd = colorPack.highlight_dark
  const backgroundColor_even = colorPack.highlight_light
  var myBackgroundColor
  if(Number(num) %2 == 0){
    myBackgroundColor = backgroundColor_even
  }
  else{
    myBackgroundColor = backgroundColor_odd
  }
 // return 
  return (
    <TouchableOpacity style={[styles.restaurantList,{backgroundColor:myBackgroundColor}]} key={id}
    disabled={true}
    >

      <Text style={[styles.highlightText, styles.restaurantName]}>{name}</Text>

      <Text style={[styles.normalText, styles.restaurantFee]}>{`${fee}`}</Text>

      <Text style={[styles.normalText, styles.restaurantMembers]}>{``}</Text>
      
    </TouchableOpacity>
  );  // return
}

export {Main_restaurantList, Main_restaurantList_sample}