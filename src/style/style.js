import { StyleSheet, Text, View } from 'react-native';
import { Dimensions } from 'react-native';

const height = Dimensions.get('screen').height; // 2000
export const width = Dimensions.get('screen').width; // 1000
const colorPack = {
    representative: '#AF0000',
    highlight_light: '#AF5800',
    highlight_dark: '#8f4800',
    text: '#efebdf',
    text_title: '#00e496',
    text_light: '#dcfc95',
    deactivated: '#707070',
}


export const styles = StyleSheet.create({
// TEXT STYLES
    titleText:{
        // fontFamily:'Arial',
        fontSize:width*0.04, // 40
        color: colorPack.text_title,
    },
    normalText:{
        // fontFamily:'Arial',
        fontSize:width*0.03, // 30
        color: colorPack.text,
    },
    highlightText:{
        // fontFamily:'Arial',
        fontSize:width*0.04, // 40
        color: colorPack.text_light,
    },
// CONTAINER STYLES
    container:{
        width: width,
        height: height,
        backgroundColor:colorPack.representative,
        flexDirection: 'column',
        paddingVertical: height * 100/2000,
    },
    header:{
        height: height * 80/2000,
        width: width,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    map:{
        height: height * 1000/2000,
        width: width,
    },
    restaurantContainer: {
        height: height * 710/2000,
        backgroundColor: colorPack.deactivated,
    },
    locationInfoContainer:{
        height: height * 106/2000,
        paddingLeft: width * 30/1000,
        paddingRight: width * 70/1000,
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
        paddingHorizontal: width * 30/1000,
    },

  });