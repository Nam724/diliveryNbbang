import { styles, width } from '../style/style';
import {View, Text} from 'react-native';



export default function Loading_page(){
    return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.titleText}>
      loading...
      </Text>
      </View>
    </View>
    )
    
}