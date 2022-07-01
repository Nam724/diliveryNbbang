import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable, AsyncStorage} from 'react-native';
import {useState, useEffect} from 'react';
import { colorPack, styles, width } from '../style/style';


export default function Order({route, navigation}){
    const [modalVisible, setModalVisible] = useState(false);
    return(
    <Modal animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
        
        }}
        >
        <Pressable style={{
        flex:1,
        backgroundColor:'transparent',
        }}
        onPress={()=>
        {setDialogVisible_restaurant(false);
        setNewRestaurant_fee(null);
        setNewRestaurant_name(null);
        setNewRestaurant_url(null);}
        }
        />

        <View style={styles.restaurantInfoContainerModal}>

            <Text style={[styles.highlightText,{marginTop:20}]}>{`음식점을 \"${selectedMarker.title}\"에 추가합니다.`}</Text>

            <View style={styles.getRestaurantInfoModal}>
            <TouchableOpacity
            onPress={() => {
                Linking.openURL('https://www.baemin.com/shopDetail?shopDetail_shopNo=13364428&bm_rfr=SHARE&shopDetail_campaignId=-1&shopDetail_categoryTypeCode=1');
            }}
            disabled={newRestaurant_url != null}
            >
            <Text style={[styles.normalText,{textAlign:'center'}]}>{newRestaurant_url?'이제 링크를 붙여넣어 주세요':'배달의 민족으로 이동하기'}</Text>
            </TouchableOpacity>
            
            <TextInput
            style={styles.textInputBox}
            placeholder={'배달의 민족 URL을 복사 후 여기에 붙여 넣어주세요'}
            placeholderTextColor={colorPack.deactivated}
            value={newRestaurant_url}
            onChangeText={(text) => readClipboard(setNewRestaurant_name, setNewRestaurant_url, text)}
            >            
            </TextInput>
            </View>

            <View style={styles.getRestaurantInfoModal}>
            <Text style={[styles.normalText,{textAlign:'center'}]}>{'음식점 이름'}</Text>
            <TextInput style={styles.textInputBox}
            value={newRestaurant_name}
            onChangeText={(text) =>
                setNewRestaurant_name(text)
            }
            placeholder='URL을 붙여넣으면 자동으로 입력됩니다.'
            placeholderTextColor={colorPack.deactivated}
            showSoftInputOnFocus={false}
            editable={false}
            />
            </View>

            <View style={styles.getRestaurantInfoModal}>
            <Text style={[styles.normalText,{textAlign:'center'}]}>{'배달료(원)'}</Text>
            <TextInput style={styles.textInputBox}
            onChangeText={(text) => setNewRestaurant_fee(text)}
            keyboardType='numeric'
            placeholder='0'
            placeholderTextColor={colorPack.deactivated}            
            />
            </View>
            

            <View style={styles.getRestaurantInfoModal}>
            <TouchableOpacity
            onPress={() => {
                alert('카카오톡 프로필 상단 우측의 QR코드 버튼을 누른 뒤 QR코드 밑에 있는 링크 아이콘을 클릭하세요.');
            }}
            disabled={newRestaurant_account != null}>

            <Text style={[styles.normalText,{textAlign:'center'}]}>{newRestaurant_account?'입금받을 본인 계좌':' 카카오페이 송금주소를 복사하는 방법 보기.'}</Text>
            </TouchableOpacity>
            <TextInput style={styles.textInputBox}
            onChangeText={(text) => setNewRestaurant_account(text)}
            placeholder='카카오페이 송금주소 링크.'
            placeholderTextColor={colorPack.deactivated}       
            onKeyPress={(e) => {
                if (e.nativeEvent.key === 'return') {
                let name = newRestaurant_name;
                let fee = parseInt(newRestaurant_fee);
                let url = newRestaurant_url;
                let placeID = selectedMarker.key;
                setDialogVisible_restaurant(false);
                saveNewRestaurant(placeID);
                }
            }}
            />

            </View>


            

            <View style={styles.buttonContainerModal}>
            <TouchableOpacity
                style={styles.modalButton}
                onPress={() => 
                { setDialogVisible_restaurant(false);
                    setNewRestaurant_fee(null);
                    setNewRestaurant_name(null);
                    setNewRestaurant_url(null);
                }}>
                <Text style={styles.highlightText}>{'Close'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                style={styles.modalButton}
                onPress={() => 
                { 
                    let placeID = selectedMarker.key;
                    setDialogVisible_restaurant(false);
                    saveNewRestaurant(placeID);
                }}>
                <Text style={styles.highlightText}>{'Submit'}</Text>
            </TouchableOpacity>
            </View>
            
        </View>
        </Modal>

    )
}
