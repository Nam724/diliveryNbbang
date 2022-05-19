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
        alignContent: 'center',
        alignItems: 'center',
    },
    titleText:{
        // fontFamily:'Arial',
        fontSize:width*0.04, // 30
        color: colorPack.text_title,
    },
    normalText:{
        // fontFamily:'Arial',
        fontSize:width*0.03, // 20
        color: colorPack.text,
    },
    highlightText:{
        // fontFamily:'Arial',
        fontSize:width*0.04, // 20
        color: colorPack.text_light,
    },
    map:{
        height: height * 0.505,
        width: width,
    },

  });