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
    container:{
        width: width,
        height: height,
        backgroundColor:colorPack.representative,
        flexDirection: 'column',
        paddingVertical: height * 0.05,
    },
    header:{
        height: 0.04 * height,
        width: width,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

// CONTAINER STYLES
    map:{
        height: height * 0.505,
        width: width,
    },
    restaurantList: {
        height: height * 810/2000,
    },
    locationInfoContainer:{
        height: height * 106/2000,
        paddingLeft: width * 30/1000,
        paddingRight: width * 70/1000,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',    
    },
  });