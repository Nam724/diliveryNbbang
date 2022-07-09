import { colorPack, styles, width } from '../style/style';
import {View, ActivityIndicator, Text, Image} from 'react-native';



export default function Loading_page(){
  
  return ( 
      <View style={[styles.container, {flex:1, justifyContent:'center'}]}>


      <View style={{alignContent:'center'}}>
        <Image source={require('../../assets/icon.png')} style={{width:width*0.3, height:width*0.3, marginLeft:width*0.35}} />
      </View>


      <ActivityIndicator size="large" animating={true} color={colorPack.text_light} />

      <View style={styles.header}>
        <Text style={styles.highlightText}>
            {'정보를 불러오는 중이예요'}
        </Text>
      </View>


      </View>
  );
}