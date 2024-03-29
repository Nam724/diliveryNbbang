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
    Image,
} from "react-native";
import { useState, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Restaurant, Place, Member } from "../models";
import {
    styles,
    colorPack,
    height,
    mapStyle,
    width,
    iconSize,
} from "../style/style";
import MapView, {
    Marker,
    PROVIDER_GOOGLE,
} from "react-native-maps";
import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";
import * as SMS from "expo-sms";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Restaurant_page_auth({
    route,
    navigation,
}) {
    // console.log(route.params.user)
    const user = route.params.user; //{username: 'test', email: ''}
    const [restaurant, setRestaurant] = useState(
        route.params.restaurant
    ); //{makerID: 'test', name: '', fee: 0, num_members: 0, menu: [], isFinishRecruiting: false}
    const place = route.params.place; //{name: '', latitude: 0, longitude: 0}

    const [isFinishRecruiting, setIsFinishRecruiting] =
        useState(restaurant.isFinishRecruiting);

    const [member, setMember] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [menuList, setMenuList] = useState(null);
    const [menuPrice, setMenuPrice] = useState(null);
    const [isRegistered, setIsRegistered] = useState(true);

    const [account, setAccount] = useState(
        restaurant.account
    );
    const [fee, setFee] = useState(restaurant.fee);

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getMembers(); // get member from database
        //console.log('user', user)
        //console.log('member', member)
        //console.log('restaurant', restaurant)
        //console.log('place', place)
    }, [isRegistered, modalVisible]);

    const getMembers = async () => {
        setRefreshing(true);
        const members = await DataStore.query(
            Member,
            (member) =>
                member.restaurantID("eq", restaurant.id)
        );
        //console.log('members', members)
        const _membersList = [];
        members.forEach(async (m, index) => {
            const _m = Members(user, m, restaurant, index);

            _membersList.push(_m);
            if (m.username == user.username) {
                setIsRegistered(true);
                //console.log('등록됨!')
                setMenuList(m.menu.join(", "));
                setMenuPrice(m.price);
            }
        });
        setRestaurant({
            ...restaurant,
            num_members: members.length,
        });
        setMembersList(_membersList);

        setMember(members);
        setRefreshing(false);
    };

    const sendMSG = async () => {
        // Clipboard.setString(restaurant.account);
        // alert('보내실 주소가 복사되었습니다.\n카카오페이로 이동합니다.');
        // Linking.openURL(restaurant.account)
        //console.log('sendMoney')
        //console.log(`${member.price + (restaurant.fee/restaurant.num_members)}`)

        var numberSMS = []; // ['+821012345678', '+821012345678']

        var stringSMS = "";
        member.forEach((m) => {
            numberSMS.push(m.phone_number);

            stringSMS += `${
                m.email.split("@")[0]
            }님이 주문하신 메뉴:${m.menu}, 입금하실 금액: ${
                m.price +
                restaurant.fee / restaurant.num_members
            }원\n`;
        });
        //console.log('numberSMS',numberSMS)

        // SMS 발송 가능한 지 여부
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            // do your SMS stuff here
            const { result } = await SMS.sendSMSAsync(
                numberSMS,
                `배달앤빵에서 알려드립니다.(이 메세지는 방장이 보낸 메세지입니다.)\n${place.name}에 배달 될 음식점 "${restaurant.name}" 주문 정산 내용입니다.\n\n${stringSMS}\n입금하실 곳: ${restaurant.account}`
            );
            if (result == "sent") {
                Alert.alert(
                    "배달앤빵",
                    "메세지 전송이 완료되었습니다.",
                    [{ text: "확인" }]
                );
            } else {
                // console.log('메세지 전송 실패')
            }
        } else {
            // misfortune... there's no SMS available on this device
        }
    };
    const finishRecruiting = async () => {
        const CURRENT_ITEM = await DataStore.query(
            Restaurant,
            restaurant.id
        );
        try {
            await DataStore.save(
                Restaurant.copyOf(
                    CURRENT_ITEM,
                    (updated) => {
                        updated.isFinishRecruiting = true;
                    }
                )
            );
            setIsFinishRecruiting(true);
            // alert('모집 종료 했습니다.\n이제 멤버들이 주문할 수 있도록 문자를 전송해주세요.')
        } catch (e) {
            // console.log(e)
            alert(e);
        }
    };

    const makeNewMember = async () => {
        const _isRegistered = await DataStore.query(
            Member,
            (member) =>
                member
                    .username("eq", user.username)
                    .restaurantID("eq", restaurant.id)
        );
        // console.log(_isRegistered)
        if (_isRegistered.length == []) {
            await DataStore.save(
                new Member({
                    username: user.username,
                    email: user.email,
                    phone_number: user.phone_number,
                    menu: [""],
                    fee: Number(0),
                    restaurantID: restaurant.id,
                })
            );

            const CURRENT_ITEM = await DataStore.query(
                Restaurant,
                restaurant.id
            );
            const updatedItem = await DataStore.save(
                Restaurant.copyOf(
                    CURRENT_ITEM,
                    (updated) => {
                        // Update the values on {item} variable to update DataStore entry
                        updated.num_members =
                            updated.num_members + 1;
                    }
                )
            );
            // console.log('새로운 멤버가 추가되었습니다.', updatedItem)
            setRestaurant(updatedItem);

            // Alert.alert('배달앤빵','이제 메뉴를 추가해주세요', [{text: '확인'}])
            setModalVisible(true);
            // refreshRestaurantList(id=place.id);
        } else {
            // alert('이미 추가되었으므로\n메뉴 추가 페이지로 넘어갑니다.'
            setModalVisible(true);
        }
    };

    const deleteRestaurant = async () => {
        if (user.username === restaurant.makerID) {
            // 소유자일때 가능
            try {
                const modelToDelete = await DataStore.query(
                    Restaurant,
                    restaurant.id
                );
                DataStore.delete(modelToDelete);

                const CURRENT_ITEM = await DataStore.query(
                    Place,
                    place.id
                );
                await DataStore.save(
                    Place.copyOf(
                        CURRENT_ITEM,
                        (updated) => {
                            // Update the values on {item} variable to update DataStore entry
                            updated.num_restaurants =
                                updated.num_restaurants - 1;
                        }
                    )
                );

                navigation.goBack();
                // refreshRestaurantList(id=place.id);
            } catch (error) {
                // console.log(error)
                alert(error);
            }
        } else {
            Alert.alert(
                "배달앤빵",
                "자신이 만든 모집이 아니라서 삭제할 수 없습니다.",
                [{ text: "확인" }]
            );
        }
    };

    const addMenu = async () => {
        // console.log('addMenu')

        const _menuList = menuList.split("\n");
        // console.log('_menuList', _menuList)
        // console.log('menuPrice', menuPrice)

        const CURRENT_Member = await DataStore.query(
            Member,
            (member) =>
                member
                    .username("eq", user.username)
                    .restaurantID("eq", restaurant.id)
        );
        // console.log('current member', CURRENT_Member[0])
        if (
            restaurant.account !== account ||
            restaurant.fee !== fee
        ) {
            const CURRENT_RESTAURANT =
                await DataStore.query(
                    Restaurant,
                    restaurant.id
                );
            await DataStore.save(
                Restaurant.copyOf(
                    CURRENT_RESTAURANT,
                    (updated) => {
                        // Update the values on {item} variable to update DataStore entry
                        updated.account = account;
                        updated.fee = fee;
                    }
                )
            );
            setAccount(account);
            setFee(fee);
        }
        try {
            await DataStore.save(
                Member.copyOf(
                    CURRENT_Member[0],
                    (updated) => {
                        // Update the values on {item} variable to update DataStore entry
                        updated.menu = _menuList;
                        updated.price = menuPrice;
                    }
                )
            );
            setModalVisible(false);
        } catch (error) {
            // console.log(error)
            setModalVisible(false);
        }
    };

    const [membersList, setMembersList] = useState([]);

    const showAllMenu = () => {
        // console.log(member)
        const _allMenuList = [];
        member.forEach((member) => {
            member.menu.forEach((menu) => {
                _allMenuList.push(menu);
            });
        });
        // console.log(_allMenuList)
        Clipboard.setString(_allMenuList.join("\n"));
        Alert.alert(
            "배달앤빵",
            `전체 메뉴가 복사되었습니다.\n${_allMenuList.join(
                "\n"
            )}`,
            [{ text: "확인" }]
        );
    };

    const restartRecruiting = async () => {
        const CURRENT_ITEM = await DataStore.query(
            Restaurant,
            restaurant.id
        );
        try {
            await DataStore.save(
                Restaurant.copyOf(
                    CURRENT_ITEM,
                    (updated) => {
                        updated.isFinishRecruiting = false;
                    }
                )
            );
            setIsFinishRecruiting(false);
            // Alert.alert("배달앤빵", "모집을 시작합니다.", [
            //     { text: "확인" },
            // ]);
        } catch (e) {
            // console.log(e)
            alert(e);
        }
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    style={styles.restaurantInfoModal}
                >
                    <View
                        style={[
                            styles.header,
                            { opacity: 0.5 },
                        ]}
                    >
                        <Text
                            style={[styles.highlightText]}
                        >
                            {isFinishRecruiting
                                ? `배달 모집 완료! ${restaurant.name}`
                                : restaurant.name}
                        </Text>
                        <Text style={styles.highlightText}>
                            {restaurant.num_members == 0
                                ? `배달료 총 ${restaurant.fee}원`
                                : `배달료: ${
                                      restaurant.fee
                                  }원 / ${
                                      restaurant.num_members
                                  }명 = ${Math.ceil(
                                      restaurant.fee /
                                          restaurant.num_members
                                  )}원`}
                        </Text>
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.highlightText}>
                            {
                                "모집 정보 수정\n새롭게 주문하기"
                            }
                        </Text>
                    </View>
                    <ScrollView>
                        <View
                            style={
                                styles.restaurantPageContainerModal
                            }
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <TextInput
                                    style={[
                                        styles.textInputBox_restaurant_menu,
                                        styles.highlightText,
                                        {
                                            borderWidth: 0,
                                            marginBottom: 0,
                                        },
                                    ]}
                                    editable={false}
                                    placeholder={
                                        "송금 코드"
                                    }
                                    placeholderTextColor={
                                        colorPack.text_dark
                                    }
                                ></TextInput>

                                <TextInput
                                    style={[
                                        styles.textInputBox_restaurant_price,
                                        styles.normalText,
                                        {
                                            borderWidth: 0,
                                            marginBottom: 0,
                                        },
                                    ]}
                                    editable={false}
                                    placeholder={
                                        "배달료(원)"
                                    }
                                    placeholderTextColor={
                                        colorPack.text_dark
                                    }
                                ></TextInput>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <TextInput
                                    style={[
                                        styles.textInputBox_restaurant_menu,
                                        styles.normalText,
                                    ]}
                                    defaultValue={account}
                                    onChangeText={(
                                        text
                                    ) => {
                                        setAccount(text);
                                    }}
                                ></TextInput>

                                <TextInput
                                    style={[
                                        styles.textInputBox_restaurant_price,
                                        styles.normalText,
                                    ]}
                                    defaultValue={`${fee}`}
                                    placeholderTextColor={
                                        colorPack.deactivated
                                    }
                                    keyboardType="numeric"
                                    onChangeText={(
                                        text
                                    ) => {
                                        if (text) {
                                            setFee(
                                                parseInt(
                                                    text
                                                )
                                            );
                                        }
                                    }}
                                ></TextInput>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <TextInput
                                    style={[
                                        styles.textInputBox_restaurant_menu,
                                        styles.highlightText,
                                        {
                                            borderWidth: 0,
                                            marginBottom: 0,
                                        },
                                    ]}
                                    editable={false}
                                    placeholder={
                                        "주문 메뉴"
                                    }
                                    placeholderTextColor={
                                        colorPack.text_dark
                                    }
                                ></TextInput>

                                <TextInput
                                    style={[
                                        styles.textInputBox_restaurant_price,
                                        styles.normalText,
                                        {
                                            borderWidth: 0,
                                            marginBottom: 0,
                                        },
                                    ]}
                                    editable={false}
                                    numberOfLines={2}
                                    placeholder={"가격(원)"}
                                    placeholderTextColor={
                                        colorPack.text_dark
                                    }
                                ></TextInput>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <TextInput
                                    style={[
                                        styles.textInputBox_restaurant_menu,
                                        styles.normalText,
                                        {
                                            textAlign:
                                                "left",
                                        },
                                    ]}
                                    multiline={true}
                                    placeholder={
                                        "주문할 메뉴를 입력해주세요.\n이때 한 줄에 \n하나의 메뉴를 입력해 주세요.\n해당 내용을 통해 방장이\n자동으로 주문할 수 있습니다."
                                    }
                                    placeholderTextColor={
                                        colorPack.deactivated
                                    }
                                    onChangeText={(
                                        text
                                    ) => {
                                        setMenuList(text);
                                    }}
                                    defaultValue={
                                        menuList ===
                                        "메뉴를 추가해주세요"
                                            ? ""
                                            : `${menuList}`
                                    }
                                ></TextInput>

                                <TextInput
                                    style={[
                                        styles.textInputBox_restaurant_price,
                                        styles.normalText,
                                    ]}
                                    placeholder={
                                        "배달료 제외"
                                    }
                                    placeholderTextColor={
                                        colorPack.deactivated
                                    }
                                    keyboardType="numeric"
                                    onChangeText={(
                                        text
                                    ) => {
                                        setMenuPrice(
                                            parseInt(
                                                text === ""
                                                    ? "0"
                                                    : parseInt(
                                                          text
                                                      )
                                            )
                                        );
                                    }}
                                    defaultValue={
                                        !menuPrice
                                            ? ""
                                            : `${menuPrice}`
                                    }
                                ></TextInput>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    marginVertical:
                                        (height * 100) /
                                        2000,
                                }}
                            >
                                <TouchableOpacity
                                    style={
                                        styles.modalButton
                                    }
                                    onPress={() => {
                                        setModalVisible(
                                            false
                                        );
                                    }}
                                >
                                    <Text
                                        style={
                                            styles.highlightText
                                        }
                                    >
                                        {"닫기"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={
                                        styles.modalButton
                                    }
                                    onPress={() => {
                                        if (
                                            menuList &&
                                            menuPrice
                                        ) {
                                            addMenu();
                                        } else {
                                            Alert.alert(
                                                "배달앤빵",
                                                "메뉴 또는 가격이 입력되지 않았습니다.",
                                                [
                                                    {
                                                        text: "확인",
                                                    },
                                                ]
                                            );
                                        }
                                    }}
                                >
                                    <Text
                                        style={
                                            styles.highlightText
                                        }
                                    >
                                        {"메뉴 추가 완료"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>

            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {isFinishRecruiting
                        ? `배달 모집 완료! ${restaurant.name}`
                        : restaurant.name}
                </Text>
                <Text style={styles.highlightText}>
                    {restaurant.num_members == 0
                        ? `배달료 총 ${restaurant.fee}원`
                        : `배달료: ${restaurant.fee}원 / ${
                              restaurant.num_members
                          }명 = ${Math.ceil(
                              restaurant.fee /
                                  restaurant.num_members
                          )}원`}
                </Text>
            </View>
            <SafeAreaView>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <View
                        style={
                            styles.restaurantButtonContainer
                        }
                    >
                        <TouchableOpacity
                            style={
                                styles.restaurantButton_1
                            }
                            onPress={() => {
                                if (restaurant.url) {
                                    Linking.openURL(
                                        restaurant.url
                                    );
                                } else {
                                    Linking.openURL(
                                        "https://baeminkr.onelink.me/XgL8/baemincom"
                                    );
                                }
                            }}
                        >
                            <View
                                styles={
                                    styles.restaurantButtonIconContainer
                                }
                            >
                                <View
                                    style={{
                                        alignItems:
                                            "center",
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="motorbike"
                                        size={iconSize}
                                        color={
                                            colorPack.text_dark
                                        }
                                        style={
                                            styles.restaurantButtonIcon
                                        }
                                    />
                                </View>
                                <Text
                                    style={
                                        styles.normalText_small
                                    }
                                >
                                    {"배달의 민족"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={
                                styles.restaurantButton_2
                            }
                            onPress={() => {
                                navigation.navigate(
                                    "Chat",
                                    {
                                        restaurant:
                                            restaurant,
                                        user: user,
                                    }
                                );
                            }}
                        >
                            <View
                                styles={
                                    styles.restaurantButtonIconContainer
                                }
                            >
                                <View
                                    style={{
                                        alignItems:
                                            "center",
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="message"
                                        size={iconSize}
                                        color={
                                            colorPack.text_dark
                                        }
                                        style={
                                            styles.restaurantButtonIcon
                                        }
                                    />
                                </View>
                                <Text
                                    style={
                                        styles.normalText_small
                                    }
                                >
                                    {"채팅하기"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={
                                styles.restaurantButton_1
                            }
                            onPress={() => {
                                if (!isFinishRecruiting) {
                                    makeNewMember();
                                } else {
                                    showAllMenu();
                                }
                            }}
                        >
                            <View
                                styles={
                                    styles.restaurantButtonIconContainer
                                }
                            >
                                <View
                                    style={{
                                        alignItems:
                                            "center",
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name={
                                            !isFinishRecruiting
                                                ? "application-edit-outline"
                                                : "content-copy"
                                        }
                                        size={iconSize}
                                        color={
                                            colorPack.text_dark
                                        }
                                        style={
                                            styles.restaurantButtonIcon
                                        }
                                    />
                                </View>
                                <Text
                                    style={
                                        styles.normalText_small
                                    }
                                >
                                    {!isFinishRecruiting
                                        ? "주문정보수정"
                                        : "전체주문복사"}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                styles.restaurantButton_2
                            }
                            onPress={() => {
                                sendMSG();
                            }}
                        >
                            <View
                                styles={
                                    styles.restaurantButtonIconContainer
                                }
                            >
                                <View
                                    style={{
                                        alignItems:
                                            "center",
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="cellphone-message"
                                        size={iconSize}
                                        color={
                                            colorPack.text_dark
                                        }
                                        style={
                                            styles.restaurantButtonIcon
                                        }
                                    />
                                </View>
                                <Text
                                    style={
                                        styles.normalText_small
                                    }
                                >
                                    {"단체문자전송"}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                styles.restaurantButton_1
                            }
                            onPress={() => {
                                if (!isFinishRecruiting) {
                                    finishRecruiting();
                                } else {
                                    restartRecruiting();
                                }
                            }}
                        >
                            <View
                                styles={
                                    styles.restaurantButtonIconContainer
                                }
                            >
                                <View
                                    style={{
                                        alignItems:
                                            "center",
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name={
                                            isFinishRecruiting
                                                ? "lock-outline"
                                                : "lock-open-outline"
                                        }
                                        size={iconSize}
                                        color={
                                            !isFinishRecruiting
                                                ? colorPack.text_dark
                                                : colorPack.deactivated
                                        }
                                        style={
                                            styles.restaurantButtonIcon
                                        }
                                    />
                                </View>
                                <Text
                                    style={
                                        styles.normalText_small
                                    }
                                >
                                    {"모집상태변경"}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                styles.restaurantButton_2
                            }
                            onPress={() => {
                                Alert.alert(
                                    "배달앤빵",
                                    "이 모집을 삭제하시겠습니까?",
                                    [
                                        { text: "취소" },
                                        {
                                            text: "삭제",
                                            onPress: () => {
                                                deleteRestaurant();
                                            },
                                        },
                                    ]
                                );
                            }}
                        >
                            <View
                                styles={
                                    styles.restaurantButtonIconContainer
                                }
                            >
                                <View
                                    style={{
                                        alignItems:
                                            "center",
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="delete"
                                        size={iconSize}
                                        color={
                                            colorPack.text_dark
                                        }
                                        style={
                                            styles.restaurantButtonIcon
                                        }
                                    />
                                </View>
                                <Text
                                    style={
                                        styles.normalText_small
                                    }
                                >
                                    {"삭제"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>

            <View style={styles.map}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    customMapStyle={mapStyle}
                    style={styles.map}
                    initialRegion={{
                        longitude: place.longitude,
                        latitude: place.latitude,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003,
                    }}
                    showsMyLocationButton={false}
                    showsUserLocation={true}
                    loadingEnabled={true}
                    zoomEnabled={true}
                    rotateEnabled={true}
                >
                    <Marker
                        coordinate={{
                            longitude: place.longitude,
                            latitude: place.latitude,
                        }}
                        title={place.name}
                        description={`${place.num_restaurants}개의 레스토랑`}
                        key={place.id}
                        icon={
                            Platform.OS === "ios"
                                ? require("../../assets/marker_icon_ios.png")
                                : require("../../assets/marker_icon_android.png")
                        }
                        style={{
                            width: width * 0.01,
                            height: width * 0.012,
                        }}
                    />
                </MapView>
            </View>
            <SafeAreaView>
                <ScrollView
                    style={styles.restaurantListContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                getMembers();
                            }}
                        />
                    }
                >
                    {membersList}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function Members(user, member, restaurant, index) {
    // console.log('Members', user, member, restaurant, index)

    const backgroundColor_odd = colorPack.highlight_dark;
    const backgroundColor_even = colorPack.highlight_light;
    var myBackgroundColor;
    if (Number(index) % 2 == 0) {
        myBackgroundColor = backgroundColor_even;
    } else {
        myBackgroundColor = backgroundColor_odd;
    }

    const sendSMS = async () => {
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            // do your SMS stuff here
            const { result } = await SMS.sendSMSAsync(
                member.phone_number,
                `배달앤빵에서 알려드립니다.\n${
                    restaurant.name
                }으로 주문하신 메뉴(${member.menu.toString()})를 주문하기 위해 아래 링크로 ${
                    member.price +
                    restaurant.fee / restaurant.num_members
                } 원을 송금해주세요.\n입금하실 곳: ${
                    restaurant.account
                }`
            );
            if (result == "sent") {
                Alert.alert(
                    "배달앤빵",
                    "메세지 전송이 완료되었습니다.",
                    [{ text: "확인" }]
                );
            } else {
                // console.log('SMS 전송 실패')
                alert("메세지 전송에 실패하였습니다.");
            }
        } else {
            // misfortune... there's no SMS available on this device
        }
    };
    return (
        <TouchableOpacity
            style={[
                styles.restaurantList,
                { backgroundColor: myBackgroundColor },
            ]}
            key={member.id}
            disabled={true}
        >
            <TouchableOpacity
                onPress={() => {
                    sendSMS();
                }}
                disabled={member.username === user.username}
            >
                <Text
                    style={[
                        styles.highlightText,
                        styles.restaurantFee,
                    ]}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    {member.email.split("@")[0]}
                </Text>
                <Text
                    style={[
                        styles.normalText_small,
                        styles.restaurantFee,
                    ]}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    {member.username === user.username
                        ? "나의 주문"
                        : "개별 문자전송"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    // console.log(member.menu[0] === "");
                    Alert.alert(
                        `${
                            member.email.split("@")[0]
                        }님이 주문하신 메뉴`,
                        `${
                            member.menu[0] === ""
                                ? "메뉴를 입력해주세요"
                                : member.menu
                        }\n음식값: ${
                            member.price
                        }원, 배달료: ${
                            restaurant.fee /
                            restaurant.num_members
                        }원`,
                        [{ text: "닫기" }]
                    );
                }}
            >
                <Text
                    style={[
                        styles.normalText,
                        styles.restaurantName,
                    ]}
                >
                    {member.menu[0] === ""
                        ? "메뉴를 입력해 주세요"
                        : `${member.menu[0]} 등 ${member.menu.length}개`}
                </Text>
            </TouchableOpacity>

            <Text
                style={[
                    styles.normalText,
                    styles.restaurantMembers,
                ]}
            >
                {Math.ceil(
                    member.price +
                        restaurant.fee /
                            restaurant.num_members
                ) + "원"}
            </Text>
        </TouchableOpacity>
    );
}
