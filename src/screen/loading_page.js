import { colorPack, styles, width } from '../style/style';
import {View, ActivityIndicator, Text} from 'react-native';



export default function Loading_page(){
  
  return ( 
      <View style={[styles.container, {flex:1, justifyContent:'center'}]}>
      <Text style={styles.highlightText}>
        {'정보를 업데이트 하는 중이예요.'}
      </Text>
        <ActivityIndicator size="large" animating='true' color={colorPack.highlight_dark} />
      </View>
  );
}