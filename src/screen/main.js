import { API, graphqlOperation } from "aws-amplify";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    RefreshControl,
    SafeAreaView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
    colorPack,
    styles,
    width,
    height,
    mapStyle,
    iconSize,
} from "../style/style";
import MapView, {
    PROVIDER_GOOGLE,
    Marker,
} from "react-native-maps";
// import DialogInput from 'react-native-dialog-input';
import {
    Main_restaurantList,
    Main_restaurantList_sample,
} from "./main_restaurantList";
import { DataStore } from "@aws-amplify/datastore";
import { Restaurant, Place, Member } from "../models";
import * as Linking from "expo-linking";
import { useFocusEffect } from "@react-navigation/native";
import DialogInput from "react-native-dialog-input";
import Loading_page from "./loading_page";
import * as Location from "expo-location";
import * as Clipboard from "expo-clipboard";
import {
    MaterialIcons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { RestaurantBannerAds } from "../../utils/Ads";
import {
    onCreatePlace,
    onCreateRestaurant,
    onDeleteRestaurant,
    onUpdateRestaurant,
} from "../graphql/subscriptions";

export default function Main_page({ route, navigation }) {
    const autoLogin = route.params.autoLogin;
    let user = JSON.parse(route.params.user).attributes;
    user.username = user.sub;
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [errorMsg, setErrorMsg] = useState(null);
    // const mapRef = createRef();

    useEffect(() => {
        realTime_Markers();
        realTime_Restaurant();
        getLocation();
        // userOrderList("get");
        // console.log("user 입니다: ", user);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            // console.log("selectedMarker", selectedMarker);
            refreshRestaurantList(
                selectedMarker.key === "markers%"
                    ? "default"
                    : selectedMarker.key
            );
        }, [])
    );

    // get location
    const getLocation = async () => {
        setIsLoading(true);

        let { status_location_permission } =
            await Location.requestForegroundPermissionsAsync();
        // console.log(
        //     "위치 정보 access " + status_location_permission
        // );
        //   나중에 풀어야 함!
        // if (status_location_permission !== 'granted') {
        //   alert('Permission to access location was denied');
        //   // return;
        // }
        let _location =
            await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
                enableHighAccuracy: true,
                timeout: 10000,
            });
        setLocation({
            latitude: _location.coords.latitude,
            longitude: _location.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
        });
        setIsLoading(false);
    };

    // const getUser = async () =>{
    //     const user = await AsyncStorage.getItem('@user');
    //     return JSON.parse(user);
    // }

    // refresh
    const [refreshing, setRefreshing] = useState(false);
    const [myOrderList, setMyOrderList] = useState([]); // 내 주문 리스트

    const refreshRestaurantList = async (id) => {
        // alert('refreshRestaurantList');
        setRefreshing(true);

        // console.log('refreshRestaurantList',id==='refresh');
        // console.log(selectedMarker)
        await getMarkers();
        if (id === "refresh") {
            await userOrderList("get");
            // console.log("refreshRestaurantList_refresh");
            await loadRestaurant(selectedMarker.key);
        } else if (id === "userOrder") {
            // console.log("refreshRestaurantList_userOrder");
            setSelectedMarker({
                coordinate: {}, // {longitude: 0, latitude: 0}
                title: "나의 주문",
                key: "userOrder",
            });
            userOrderList("set");
        } else if (id === "default") {
            // console.log("refreshRestaurantList_default");
            await userOrderList("get");
            if (myOrderList.length > 0) {
                setSelectedMarker({
                    coordinate: {}, // {longitude: 0, latitude: 0}
                    title: "나의 주문",
                    key: "userOrder",
                });
                userOrderList("set");
            } else {
                setRestaurantList(restaurantList_sample);
                setSelectedMarker({
                    coordinate: {}, // {longitude: 0, latitude: 0}
                    title: "",
                    key: "markers%",
                });
            }
        } else {
            // 특정 키값 새로고침
            await userOrderList("get");
            // console.log("refreshRestaurantList_with id");
            await loadRestaurant(id);
        }
        // alert('refreshRestaurantList is finished');
        setRefreshing(false);

        // setIsLoading(false);
    };

    let text = "Waiting..";
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }
    // console.log(location)

    const deletePlace = (placeID) => {
        DataStore.delete(Place, placeID);
    };

    const returnMarker = (data) => {
        // data should contain id, name, latitude, longitude
        // console.log('makeMarker')
        let coordinate = {
            longitude: data.longitude,
            latitude: data.latitude,
        };
        let title = data.name;
        let key = data.id;
        let num_restaurants = data.num_restaurants;

        return (
            <Marker
                coordinate={coordinate}
                title={title}
                description={`${num_restaurants}개의 음식점`}
                key={key}
                onPress={async () => {
                    // console.log(title, key);
                    await refreshRestaurantList(key);
                    setSelectedMarker({
                        coordinate: coordinate,
                        title: title,
                        key: key,
                    });
                }}
                icon={
                    Platform.OS === "ios"
                        ? require("../../assets/marker_icon_ios.png")
                        : require("../../assets/marker_icon_android.png")
                }
                style={{
                    width: width * 0.01,
                    height: width * 0.012,
                }}
            ></Marker>
        );
    };

    //MARKER
    // current markers
    const [markers, setMarkers] = useState([]); // use makeMarker(data)

    async function getMarkers() {
        let _markerList = [];
        // console.log('location', location);
        try {
            const models = await DataStore.query(Place);
            console.log("markers: ", models);
            models.forEach((model, index) => {
                _markerList.push(returnMarker(model));

                if (index == models.length - 1) {
                    setMarkers(_markerList);
                }
            });
        } catch (error) {
            return error;
        }
    }

    const realTime_Markers = async () => {
        API.graphql(
            graphqlOperation(onCreatePlace)
        ).subscribe({
            next: ({ value: { data } }) => {
                // console.log(
                //     "realTime_getMarkers",
                //     data.onCreatePlace
                // );
                let newMarker = returnMarker(
                    data.onCreatePlace
                );
                // console.log("newMarker", newMarker);
                const newMarkers = [...markers, newMarker];
                // console.log("newMarkers", newMarkers);
                setMarkers(newMarkers);
            },
        });
    };

    const realTime_Restaurant = async () => {
        API.graphql(
            // 음식점 추가될 때마다 새로고침
            graphqlOperation(onCreateRestaurant)
        ).subscribe({
            next: ({ value: { data } }) => {
                console.log("realTime_Restaurant", data);
                let newRestaurant = data.onCreateRestaurant;
                if (
                    newRestaurant.placeID ===
                    selectedMarker.key
                ) {
                    refreshRestaurantList("refresh");
                }
            },
        });

        API.graphql(
            // 음식점 업데이트 될 때 새로고침
            graphqlOperation(onUpdateRestaurant)
        ).subscribe({
            next: ({ value: { data } }) => {
                console.log("realTime_Restaurant", data);
                let newRestaurant = data.onUpdateRestaurant;
                // console.log(
                //     newRestaurant.placeID ===
                //         selectedMarker.key
                // );
                if (
                    newRestaurant.placeID ===
                    selectedMarker.key
                ) {
                    refreshRestaurantList("refresh");
                }
            },
        });

        API.graphql(
            //  음식점 삭제될 때 새로고침
            graphqlOperation(onDeleteRestaurant)
        ).subscribe({
            next: ({ value: { data } }) => {
                console.log("realTime_Restaurant", data);
                let newRestaurant = data.onDeleteRestaurant;
                if (
                    newRestaurant.placeID ===
                    selectedMarker.key
                ) {
                    refreshRestaurantList("refresh");
                }
            },
        });
    };

    // get log pressed location and add marker
    const [newMarkerCoordinate, setNewMarkerCoordinate] =
        useState(null);

    // make new marker
    async function makeNewMarker(coordinate, title) {
        if (coordinate && title) {
            await DataStore.save(
                new Place({
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                    name: title,
                    Restaurants_in_a_place: [],
                    makerID: user.username,
                    num_restaurants: 0,
                })
            );

            refreshRestaurantList({ coordinate, title });
            // console.log('saved');
        } else {
            Alert.alert(
                "배달앤빵",
                "모든 항목을 입력해주세요"
            );
        }
    }

    // selected marker info
    const [selectedMarker, setSelectedMarker] = useState({
        coordinate: {}, // {longitude: 0, latitude: 0}
        title: "",
        key: "markers%",
    });

    // get marker name dialog
    const [dialogVisible_marker, setDialogVisible_marker] =
        useState(false);

    // RESTAURANT LIST
    const restaurantList_sample = [
        // RestaurantBannerAds(), // 광고 배너

        Main_restaurantList_sample(
            "placeholder1",
            "장소 추가",
            "지도 길게 누르기",
            "0"
        ),
        Main_restaurantList_sample(
            "placeholder2",
            "장소 선택",
            "핀 누르기",
            "1"
        ),
    ];

    const [restaurantList, setRestaurantList] = useState(
        restaurantList_sample
    );

    // get restaurant list
    const [
        dialogVisible_restaurant,
        setDialogVisible_restaurant,
    ] = useState(false);

    // const [newRestaurant, setNewRestaurant] = useState({});
    const [newRestaurant_name, setNewRestaurant_name] =
        useState(null);
    const [newRestaurant_fee, setNewRestaurant_fee] =
        useState(0);
    const [newRestaurant_url, setNewRestaurant_url] =
        useState(null);
    const [
        newRestaurant_account,
        setNewRestaurant_account,
    ] = useState(user.address);

    // make new restaurant
    async function saveNewRestaurant(placeID) {
        if (newRestaurant_name && newRestaurant_fee) {
            ({
                name: newRestaurant_name,
                fee: newRestaurant_fee,
                url: newRestaurant_url,
                placeID: placeID,
            });
            // amplify
            const restaurant = await DataStore.save(
                new Restaurant({
                    name: newRestaurant_name,
                    fee:
                        newRestaurant_fee == null
                            ? 0
                            : parseInt(newRestaurant_fee),
                    url: newRestaurant_url,
                    placeID: placeID,
                    makerID: user.username,
                    num_members: 1,
                    account: newRestaurant_account,
                    isFinishRecruiting: false,
                })
            );
            setNewRestaurant_name(null);
            setNewRestaurant_fee(null);
            setNewRestaurant_url(null);
            /* Models in DataStore are immutable. To update a record you must use the copyOf function
    to apply updates to the item’s fields rather than mutating the instance directly */
            const CURRENT_ITEM = await DataStore.query(
                Place,
                placeID
            );
            const place = await DataStore.save(
                Place.copyOf(CURRENT_ITEM, (updated) => {
                    // Update the values on {item} variable to update DataStore entry
                    updated.num_restaurants =
                        updated.num_restaurants + 1;
                })
            );

            // 자기 자신을 음식점에 추가
            await DataStore.save(
                new Member({
                    username: user.username,
                    email: user.email,
                    phone_number: user.phone_number,
                    menu: [""],
                    restaurantID: restaurant.id,
                    price: Number(0),
                })
            );

            navigation.navigate("Restaurant", {
                user: user,
                restaurant: restaurant,
                place: place,
            });
            setDialogVisible_restaurant(false);
        } else {
            Alert.alert(
                "배달앤빵",
                "모든 항목을 입력해주세요"
            );
        }
    }

    // load restaurant
    async function loadRestaurant(placeID) {
        // console.log(placeID)
        const place = await DataStore.query(Place, placeID);

        const _restaurant = await DataStore.query(
            Restaurant,
            (q) => q.placeID("eq", placeID)
        );
        // console.log(_restaurant);

        let _restaurantList = [];

        _restaurant
            .sort((a, b) => {
                const price1 = a.fee / a.num_members;
                const price2 = b.fee / b.num_members;
                return price1 - price2;
            })
            .forEach(async (r, index) => {
                // console.log("userOrderList", userOrderList);
                _restaurantList.push(
                    Main_restaurantList(
                        user,
                        r,
                        index,
                        navigation,
                        place,
                        myOrderList.includes(r.id)
                    )
                );
            });
        setRestaurantList(_restaurantList);
    }

    const userOrderList = async (type) => {
        const members = await DataStore.query(Member, (q) =>
            q.username("eq", user.username)
        );
        // console.log(members);
        var _orderList = [];
        let _myOrderList = []; // 유저 주문 목록, 음식점 id 값의 리스트
        // console.log("members", members.length === 0);
        if (members.length > 0) {
            // 내가 주문한 리스트가 있을 때
            // console.log('members', members)
            members.forEach(async (member, index) => {
                let rest = await DataStore.query(
                    Restaurant,
                    member.restaurantID
                );
                let place = await DataStore.query(
                    Place,
                    rest.placeID
                );

                //console.log('rest', rest);
                //console.log('place', place);

                _orderList.push(
                    Main_restaurantList(
                        user,
                        rest,
                        index,
                        navigation,
                        place,
                        true
                    )
                );

                _myOrderList.push(rest.id);

                if (index == members.length - 1) {
                    setMyOrderList(_myOrderList);
                    if (type === "set") {
                        setSelectedMarker({
                            coordinate: {}, // {longitude: 0, latitude: 0}
                            title: "나의 주문",
                            key: "userOrder",
                        });
                        setRestaurantList(_orderList);
                        // console.log("set");
                    }
                }
            });

            //console.log('orderList', _orderList);
        } else {
            // 주문한 리스트가 없을 때
            setMyOrderList([]);
            setRestaurantList([]);
        }
    };

    const readClipboard = async (text = "") => {
        let clipboardText = "";
        if (Platform.OS === "android") {
            clipboardText =
                await Clipboard.getStringAsync();
        } else if (Platform.OS === "ios") {
            // const _clipboardTextUrl =
            //     await Clipboard.getUrlAsync();
            // const _clipboardTextName =
            //     await Clipboard.getStringAsync();
            // console.log(
            //     "_clipboardTextName",
            //     _clipboardTextName
            // );
            // console.log(
            //     "_clipboardTextUrl",
            //     _clipboardTextUrl
            // );
            clipboardText = text;
        } else {
            clipboardText = "";
        }
        // console.log("clipboardText", clipboardText);

        const UrlFormat =
            /^\'(.*)\' 어때요\? 배달의민족 앱에서 확인해보세요.  https:\/\/baemin.me\/(.*){1,}$/g;

        const restaurantTitleFormat = /\'.*\'/g;
        const restaurantUrlFormat =
            /https:\/\/baemin.me\/(.*){1,}/g;

        const restaurantTitle = clipboardText.match(
            restaurantTitleFormat
        );
        const restaurantUrl = clipboardText.match(
            restaurantUrlFormat
        );

        //console.log(clipboardText, restaurantTitle, restaurantUrl);
        if (restaurantTitle && restaurantUrl) {
            //클립보드에서 가져온 문자열에 http 가 포함되어있으면 링크로 인식해 저장
            setNewRestaurant_url(restaurantUrl[0]);
            setNewRestaurant_name(
                restaurantTitle[0].substring(
                    1,
                    restaurantTitle[0].length - 1
                )
            );
        } else {
            setNewRestaurant_url("");
            setNewRestaurant_name("");
            if (clipboardText.match(UrlFormat)) {
                Alert.alert(
                    "배달앤빵",
                    `현재 복사된 링크는 배달의민족 주소가 아닙니다!`,
                    [{ text: "확인" }]
                );
            } else {
                Alert.alert(
                    "배달앤빵",
                    "배달의민족 주소가 아님니다.\n배달의 민족으로 이동하시겠습니까?",
                    [
                        {
                            text: "확인",
                            onPress: () => {
                                Linking.openURL(
                                    "https://baeminkr.onelink.me/XgL8/baemincom"
                                );
                            },
                        },
                        { text: "취소" },
                    ]
                );
            }
        }
    };

    // return
    return isLoading ? (
        <Loading_page />
    ) : (
        <View style={styles.container}>
            <DialogInput
                isDialogVisible={dialogVisible_marker}
                title={"이곳에 핀 추가하기"}
                message={"이 장소의 이름을 입력하세요"}
                dialogStyle={{
                    borderRadius: (width * 50) / 1000,
                    backgroundColor: colorPack.text_light,
                    padding: (width * 20) / 1000,
                }}
                textInputProps={{
                    autoCorrect: false,
                    autoCapitalize: false,
                    maxLength: 10,
                }}
                submitText={"저장"}
                cancelText={"닫기"}
                submitInput={(title) => {
                    if (title) {
                        makeNewMarker(
                            newMarkerCoordinate,
                            title
                        );
                        setDialogVisible_marker(false);
                    } else {
                        setDialogVisible_marker(false);
                    }
                }}
                closeDialog={() => {
                    setDialogVisible_marker(false);
                }}
            />

            <Modal
                animationType="fade"
                transparent={false}
                visible={dialogVisible_restaurant}
                onRequestClose={() => {
                    setDialogVisible_restaurant(false);
                    setNewRestaurant_fee(null);
                    setNewRestaurant_name(null);
                    setNewRestaurant_url(null);
                }}
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    style={styles.restaurantInfoModal}
                >
                    <View
                        style={[
                            styles.header,
                            {
                                flexDirection: "row",
                                justifyContent:
                                    "space-between",
                                opacity: 0.5,
                            },
                        ]}
                    >
                        <View
                            style={{
                                width: width * 0.25,
                                justifyContent: "center",
                                alignItems: "flex-start",
                                paddingLeft: width * 0.05,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate(
                                        "Setting",
                                        { user: user }
                                    );
                                }}
                                disabled={true}
                            >
                                <MaterialIcons
                                    name="account-circle"
                                    size={iconSize}
                                    color={
                                        colorPack.text_light
                                    }
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={{
                                width: width * 0.5,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onPress={async () => {
                                await getMarkers();
                                setSelectedMarker({
                                    coordinate: {}, // {longitude: 0, latitude: 0}
                                    title: "",
                                    key: "markers%",
                                });
                                setRestaurantList(
                                    restaurantList_sample
                                );
                            }}
                            disabled={true}
                        >
                            <Image
                                source={require("../../assets/logo.png")}
                                style={{
                                    width: width * 0.1,
                                    height: width * 0.1,
                                }}
                            />
                        </TouchableOpacity>

                        <View
                            style={{
                                width: width * 0.25,
                                justifyContent: "center",
                                alignItems: "flex-end",
                                paddingRight: width * 0.05,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    userOrderList("set");
                                }}
                                disabled={true}
                            >
                                <MaterialCommunityIcons
                                    name="clipboard-edit-outline"
                                    size={iconSize}
                                    color={
                                        colorPack.text_light
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.header}>
                        <Text
                            style={[styles.highlightText]}
                        >{`음식점을 \"${selectedMarker.title}\"에 추가합니다.`}</Text>
                    </View>

                    <ScrollView>
                        <View
                            style={[
                                styles.mapContainer,
                                {
                                    height:
                                        (500 * height) /
                                        2000,
                                },
                            ]}
                        >
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                customMapStyle={mapStyle}
                                style={[
                                    styles.map,
                                    {
                                        height:
                                            (500 * height) /
                                            2000,
                                    },
                                ]}
                                initialRegion={location}
                                showsMyLocationButton={true}
                                showsUserLocation={true}
                                loadingEnabled={true}
                                zoomEnabled={true}
                                rotateEnabled={true}
                                onLongPress={(e) => {
                                    setNewMarkerCoordinate(
                                        e.nativeEvent
                                            .coordinate
                                    );
                                    setDialogVisible_marker(
                                        true
                                    );
                                }}
                            >
                                {markers.filter(
                                    (marker) =>
                                        marker.key ===
                                        selectedMarker.key
                                )}
                            </MapView>
                        </View>

                        <View
                            style={
                                styles.restaurantInfoContainerModal
                            }
                        >
                            <View
                                style={
                                    styles.buttonContainerModal
                                }
                            >
                                <TouchableOpacity
                                    onPress={async () => {
                                        newRestaurant_url
                                            ? Linking.openURL(
                                                  newRestaurant_url
                                              )
                                            : Linking.openURL(
                                                  "https://baeminkr.onelink.me/XgL8/baemincom"
                                              );
                                    }}
                                    style={
                                        styles.modalButton
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.normalText,
                                        ]}
                                    >
                                        {"배달의 민족 열기"}
                                    </Text>
                                </TouchableOpacity>
                                {Platform === "android" ? (
                                    <TouchableOpacity
                                        style={
                                            styles.modalButton
                                        }
                                        onPress={
                                            readClipboard
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.normalText
                                            }
                                        >
                                            {
                                                "배민 링크 붙여넣기"
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View />
                                )}
                            </View>

                            <View
                                style={[
                                    styles.getRestaurantInfoModal,
                                    {
                                        height:
                                            (height * 215) /
                                            2000,
                                    },
                                ]}
                            >
                                <TextInput
                                    style={[
                                        styles.textInputBox,
                                        {
                                            marginBottom:
                                                height *
                                                0.005,
                                        },
                                    ]}
                                    value={
                                        newRestaurant_name
                                    }
                                    onChangeText={(
                                        text
                                    ) => {
                                        const UrlFormat =
                                            /^\'(.*)\' 어때요\? 배달의민족 앱에서 확인해보세요.  https:\/\/baemin.me\/(.*){1,}$/g;

                                        if (
                                            text.match(
                                                UrlFormat
                                            )
                                        ) {
                                            if (
                                                Platform.OS ===
                                                "android"
                                            ) {
                                                setNewRestaurant_name(
                                                    text
                                                );
                                            } else if (
                                                Platform.OS ===
                                                "ios"
                                            ) {
                                                readClipboard(
                                                    text
                                                );
                                            }
                                        } else {
                                            setNewRestaurant_name(
                                                text
                                            );
                                        }
                                    }}
                                    placeholder={
                                        Platform.OS ===
                                        "ios"
                                            ? "음식점 이름"
                                            : "자동으로 입력됩니다."
                                    }
                                    placeholderTextColor={
                                        colorPack.deactivated
                                    }
                                />
                                <Text
                                    style={
                                        styles.deactivatedText
                                    }
                                >
                                    {
                                        "배민 공유 링크를 붙여넣으면 더욱 빠른 주문이 가능합니다."
                                    }
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.getRestaurantInfoModal
                                }
                            >
                                <Text
                                    style={[
                                        styles.normalText,
                                    ]}
                                >
                                    {"배달료(원)"}
                                </Text>
                                <TextInput
                                    style={
                                        styles.textInputBox
                                    }
                                    onChangeText={(text) =>
                                        setNewRestaurant_fee(
                                            text
                                        )
                                    }
                                    keyboardType="numeric"
                                    placeholder="배달료"
                                    placeholderTextColor={
                                        colorPack.deactivated
                                    }
                                />
                            </View>

                            <View
                                style={
                                    styles.getRestaurantInfoModal
                                }
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        Alert.alert(
                                            "배달앤빵",
                                            "카카오톡 프로필 상단 우측의 QR코드 버튼을 누른 뒤 QR코드 밑에 있는 링크 아이콘을 클릭하세요."
                                        );
                                    }}
                                    disabled={
                                        newRestaurant_account !=
                                        null
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.normalText,
                                            {
                                                textAlign:
                                                    "center",
                                            },
                                        ]}
                                    >
                                        {
                                            "입금받을 본인 계좌"
                                        }
                                    </Text>
                                </TouchableOpacity>
                                <TextInput
                                    style={
                                        styles.textInputBox
                                    }
                                    onChangeText={(text) =>
                                        setNewRestaurant_account(
                                            text
                                        )
                                    }
                                    placeholder={
                                        user.address
                                    }
                                    placeholderTextColor={
                                        colorPack.text_light
                                    }
                                    disabled={
                                        user.address ===
                                        null
                                    }
                                    onKeyPress={(e) => {
                                        if (
                                            e.nativeEvent
                                                .key ===
                                            "return"
                                        ) {
                                            let placeID =
                                                selectedMarker.key;
                                            setDialogVisible_restaurant(
                                                false
                                            );
                                            saveNewRestaurant(
                                                placeID
                                            );
                                        }
                                    }}
                                />
                            </View>

                            <View
                                style={
                                    styles.buttonContainerModal
                                }
                            >
                                <TouchableOpacity
                                    style={
                                        styles.modalButton
                                    }
                                    onPress={() => {
                                        setDialogVisible_restaurant(
                                            false
                                        );
                                        setNewRestaurant_fee(
                                            null
                                        );
                                        setNewRestaurant_name(
                                            null
                                        );
                                        setNewRestaurant_url(
                                            null
                                        );
                                    }}
                                >
                                    <Text
                                        style={
                                            styles.highlightText
                                        }
                                    >
                                        {"취소"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={
                                        styles.modalButton
                                    }
                                    onPress={() => {
                                        let placeID =
                                            selectedMarker.key;
                                        saveNewRestaurant(
                                            placeID
                                        );
                                    }}
                                >
                                    <Text
                                        style={
                                            styles.highlightText
                                        }
                                    >
                                        {"추가하기"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>

            <View
                style={[
                    styles.header,
                    {
                        flexDirection: "row",
                        justifyContent: "space-between",
                    },
                ]}
            >
                <View
                    style={{
                        width: width * 0.25,
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingLeft: width * 0.05,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Setting", {
                                user: user,
                            });
                        }}
                    >
                        <View
                            style={{ alignItems: "center" }}
                        >
                            <MaterialCommunityIcons
                                name="account-outline"
                                size={iconSize}
                                color={colorPack.text_light}
                            />
                            <Text
                                style={
                                    styles.normalText_small
                                }
                            >
                                {"내 정보"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={{
                        width: width * 0.5,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={async () => {
                        await getMarkers();
                        setSelectedMarker({
                            coordinate: {}, // {longitude: 0, latitude: 0}
                            title: "",
                            key: "markers%",
                        });
                        setRestaurantList(
                            restaurantList_sample
                        );
                    }}
                >
                    <Image
                        source={require("../../assets/logo.png")}
                        style={{
                            width: width * 0.1,
                            height: width * 0.1,
                        }}
                    />
                </TouchableOpacity>

                <View
                    style={{
                        width: width * 0.25,
                        justifyContent: "center",
                        alignItems: "flex-end",
                        paddingRight: width * 0.05,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            userOrderList("set");
                        }}
                    >
                        <View
                            style={{ alignItems: "center" }}
                        >
                            <MaterialCommunityIcons
                                name="clipboard-edit-outline"
                                size={iconSize}
                                color={colorPack.text_light}
                            />
                            <Text
                                style={
                                    styles.normalText_small
                                }
                            >
                                {"내 주문"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.mapContainer}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    customMapStyle={mapStyle}
                    style={styles.map}
                    initialRegion={location}
                    showsMyLocationButton={true}
                    showsUserLocation={true}
                    loadingEnabled={true}
                    zoomEnabled={true}
                    rotateEnabled={true}
                    onLongPress={(e) => {
                        setNewMarkerCoordinate(
                            e.nativeEvent.coordinate
                        );
                        setDialogVisible_marker(true);
                    }}
                >
                    {markers}
                </MapView>
            </View>

            <View style={styles.restaurantContainer}>
                <View style={styles.locationInfoContainer}>
                    <View
                        style={{
                            alignItems: "flex-start",
                            justifyContent: "center",
                            flex: 1,
                        }}
                    >
                        <View
                            style={{ alignItems: "center" }}
                        >
                            {selectedMarker.key ===
                            "userOrder" ? (
                                selectedMarker.title ===
                                "내 주문 없음" ? (
                                    <MaterialCommunityIcons
                                        name="clipboard-off-outline"
                                        size={iconSize}
                                        color={
                                            colorPack.text_dark
                                        }
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name="clipboard-edit-outline"
                                        size={iconSize}
                                        color={
                                            colorPack.text_dark
                                        }
                                    />
                                )
                            ) : (
                                <MaterialIcons
                                    name="place"
                                    size={iconSize}
                                    color={
                                        selectedMarker.key ===
                                        "markers%"
                                            ? colorPack.representative
                                            : colorPack.text_dark
                                    }
                                />
                            )}
                            <Text
                                style={[
                                    styles.highlightText,
                                    {
                                        fontSize:
                                            width * 0.02,
                                    },
                                ]}
                            >
                                {selectedMarker.title}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={[
                                styles.highlightText,
                                {
                                    fontSize:
                                        (height * 30) /
                                        2000,
                                },
                            ]}
                        >
                            {`"호스트"`}
                        </Text>
                        <Text
                            style={[
                                styles.highlightText,
                                {
                                    fontSize:
                                        (height * 30) /
                                        2000,
                                },
                            ]}
                        >
                            {`게스트`}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={[
                                styles.normalText,
                                {
                                    fontSize:
                                        (height * 30) /
                                        2000,
                                },
                            ]}
                        >
                            {`모집중`}
                        </Text>
                        <Text
                            style={[
                                styles.deactivatedText,
                                {
                                    fontSize:
                                        (height * 30) /
                                        2000,
                                },
                            ]}
                        >
                            {`모집끝`}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={
                                styles.locationInfoButton
                            }
                            onPressOut={() => {
                                {
                                    setDialogVisible_restaurant(
                                        true
                                    );
                                }
                            }}
                            disabled={
                                selectedMarker.key ===
                                    "markers%" ||
                                selectedMarker.key ===
                                    "userOrder"
                            }
                        >
                            {selectedMarker.key !==
                            "userOrder" ? (
                                <MaterialIcons
                                    name="add-location"
                                    size={iconSize}
                                    color={
                                        colorPack.text_light
                                    }
                                />
                            ) : (
                                <View />
                            )}

                            <Text
                                style={[
                                    styles.normalText,
                                    {
                                        fontSize:
                                            width * 0.02,
                                    },
                                ]}
                            >
                                {selectedMarker.key ===
                                "markers%"
                                    ? "장소"
                                    : selectedMarker.key ===
                                      "userOrder"
                                    ? ""
                                    : "이곳에 배달 추가"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <SafeAreaView>
                    <RestaurantBannerAds />
                    <ScrollView
                        style={
                            styles.restaurantListContainer
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => {
                                    if (
                                        selectedMarker.key ==
                                        "userOrder"
                                    ) {
                                        refreshRestaurantList(
                                            "userOrder"
                                        );
                                    } else if (
                                        selectedMarker.key ==
                                        "markers%"
                                    ) {
                                        setRestaurantList(
                                            restaurantList_sample
                                        );
                                    } else {
                                        refreshRestaurantList(
                                            "refresh"
                                        );
                                    }

                                    // console.log('refresh')
                                }}
                            />
                        }
                    >
                        {restaurantList}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>
    );
} // return}
