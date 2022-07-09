import { StyleSheet, Text, View } from 'react-native';
import { Dimensions } from 'react-native';
import Constants from 'expo-constants';
export const height = Dimensions.get('screen').height-Constants.statusBarHeight; // 2000
export const width = Dimensions.get('screen').width; // 1000
export const colorPack = {
    representative: '#17263C',
    highlight_light: '#38414E',
    highlight_dark: '#242F3E',
    text_dark: '#D99066',
    text_light: '#E4EAF2',
    deactivated: '#8B9198',
}


export const styles = StyleSheet.create({
// TEXT STYLES
    normalText:{
        fontFamily:'happy_sans_bold',
        fontSize:width*0.04, // 30
        color: colorPack.text_light,
        textAlign:'center',
    },
    highlightText:{
        fontFamily:'happy_sans_title',
        fontSize:width*0.05, // 40
        color: colorPack.text_dark,
        textAlign:'center',
        fontWeight:'bold',
    },
    deactivatedText:{
        fontFamily:'happy_sans_regular',
        fontSize:width*0.04, // 30
        color: colorPack.deactivated,
        textAlign:'center',
    },
// CONTAINER STYLES
    container:{
        width: width,
        height: Dimensions.get('screen').height,
        backgroundColor:colorPack.representative,
        flexDirection: 'column',
        paddingTop: height * 100/2000,
    },
    header:{
        height: height * 150/2000,
        width: width,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapContainer:{
        height: height * 990/2000,
        width: width,
        marginBottom: height * 10/2000,
    },
    map:{
        height: height * 990/2000,
        width: width,
    },
    restaurantContainer: {
        height: height * 710/2000,
        width:width,

    },
    locationInfoContainer:{
        height: height * 106/2000,
        paddingLeft: width * 30/1000,
        paddingRight: width * 30/1000,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
    },
    restaurantListContainer:{
        height: height * 604/2000,
    },
    restaurantList:{
        height: height * 150/2000,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: width*15/1000,
        paddingHorizontal: width*30/1000,
        borderColor: colorPack.representative,
        borderWidth: 3, 
        borderRadius: width*50/1000,
    },
    restaurantName:{
        width: width * 450/1000,
        textAlign: 'left',
    },
    restaurantFee:{
        width: width * 300/1000,
        textAlign: 'left',
    },
    restaurantMembers:{

    },


// modal
    restaurantInfoModal:{
      flex:1,
      position: 'absolute',
      marginTop: height * 150/2000,
    },
    restaurantInfoContainerModal:{
        backgroundColor: colorPack.representative,
        alignItems:'center',
        flexDirection:'column',
        justifyContent:'space-between',
        paddingBottom: height * 100/2000,
    },

    buttonContainerModal:{
        height: height * 60/2000,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'stretch',
    },

    modalButton:{
        width: width * 400/1000,
        height: height * 100/2000,
        backgroundColor: colorPack.highlight_light,
        borderRadius: height * 50/2000,
        justifyContent:'center',
        marginHorizontal:width*20/1000,
        alignItems:'center',
    },

    getRestaurantInfoModal:{
        height: height * 250/2000,
        width:width,
        alignItems:'center',
    },

    // restaurantPage

    restaurantButtonContainer:{
        flexDirection:'row',
    },
    restaurantButton_1:{
        height: height * 200/2000,
        width: width * 0.25,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: colorPack.highlight_dark,

    },
    restaurantButton_2:{
        height: height * 200/2000,
        width: width * 0.25,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: colorPack.highlight_light,

    },

    // sign in page
    goToSignUpInButton:{
        width: width * 700/1000,
        height: height * 100/2000,
        backgroundColor: colorPack.highlight_light,
        borderRadius: height * 50/2000,
        justifyContent:'center',
        marginHorizontal: width * 150/1000,
    },
    textInputBox:{
        width: width * 700/1000,
        height: height * 100/2000,
        borderRadius: height * 30/2000,
        borderColor: colorPack.highlight_light,
        borderWidth: width* 10/2000,
        marginVertical: height * 35/2000,
        marginHorizontal: width * 150/1000,
        textAlign:'center',
        textAlignVertical:'center',
        color: colorPack.text_light,
        paddingHorizontal: width * 20/1000,
    },
    textInputBox_restaurant_menu:{
        width: width * 600/1000,
        
        borderRadius: height * 30/2000,
        borderColor: colorPack.highlight_light,
        borderWidth: width* 10/2000,
        marginVertical: height * 35/2000,
        marginHorizontal: width * 50/1000,
        textAlign:'center',
        textAlignVertical:'center',
        lineHeight: height * 50/2000,
        padding:width*20/1000
    },
    textInputBox_restaurant_price:{
        width: width * 250/1000,
        height: height * 100/2000,
        borderRadius: height * 30/2000,
        borderColor: colorPack.highlight_light,
        borderWidth: width* 10/2000,
        marginVertical: height * 35/2000,
        marginHorizontal: width * 50/1000,
        textAlign:'center',
        textAlignVertical:'center',
        padding:width*20/1000
    },


});

export const map_darkStyle =[
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#242f3e"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#746855"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#242f3e"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#263c3f"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#6b9a76"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#38414e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#212a37"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9ca5b3"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#746855"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#1f2835"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#f3d19c"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#2f3948"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#17263c"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#515c6d"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#17263c"
            }
          ]
        }
]
