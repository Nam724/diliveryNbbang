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
} from "react-native";
import { useState, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Restaurant, Member } from "../models";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sendSMSAsync } from "expo-sms";
export default function Restaurant_page_guest({
    route,
    navigation,
}) {
    // console.log('Restaurant_page_guest', route);

    const user = route.params.user; //{username: 'test', email: ''}
    const [restaurant, setRestaurant] = useState(
        route.params.restaurant
    ); //{makerID: 'test', name: '', fee: 0, num_members: 0, menu: [], isFinishRecruiting: false}
    const place = route.params.place; //{name: '', latitude: 0, longitude: 0}
    const [member, setMember] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [menuList, setMenuList] =
        useState("메뉴를 먼저 추가해주세요");
    const [menuPrice, setMenuPrice] = useState(0);
    const [isRegistered, setIsRegistered] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getMembers(); // get member from database
        // console.log('user', user)
        // console.log('member', member)
        // console.log('restaurant', restaurant)
        // console.log('place', place)
    }, [isRegistered, modalVisible]);

    const getMembers = async () => {
        setRefreshing(true);

        const members = await DataStore.query(
            Member,
            (member) =>
                member.restaurantID("eq", restaurant.id)
        );
        // console.log('members', members)
        const _membersList = [];
        members.forEach(async (m, index) => {
            const _m = Members(user, m, restaurant, index);

            _membersList.push(_m);
            if (m.username == user.username) {
                setIsRegistered(true);
                // console.log('등록됨!')
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
    const sendSMStoAuthor = async () => {
        const makerPhoneNumber = member.filter(
            (member) =>
                member.username == restaurant.makerID
        )[0].phone_number;

        // console.log(makerPhoneNumber)
        sendSMSAsync(
            makerPhoneNumber,
            `배달앤빵 주문자: ${
                user.email.split("@")[0]
            } 주문한 음식점: ${restaurant.name}\n`
        );
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
        setIsRegistered(_isRegistered.length > 0);

        await DataStore.save(
            new Member({
                username: user.username,
                email: user.email,
                phone_number: user.phone_number,
                menu: [""],
                fee: Number(0),
                restaurantID: restaurant.id,
                price: Number(0),
            })
        );

        const CURRENT_ITEM = await DataStore.query(
            Restaurant,
            restaurant.id
        );
        const updatedItem = await DataStore.save(
            Restaurant.copyOf(CURRENT_ITEM, (updated) => {
                // Update the values on {item} variable to update DataStore entry
                updated.num_members =
                    updated.num_members + 1;
            })
        );
        // console.log('새로운 멤버가 추가되었습니다.', updatedItem)
        setRestaurant(updatedItem);
        getMembers();
        // refreshRestaurantList(id=place.id);

        // Alert.alert('배달앤빵','이미 등록되었습니다.',[{text:'메뉴추가', onPress:()=>{setModalVisible(true)}},{text:'닫기', onPress:()=>{}}])
    };

    const deleteMember = async () => {
        if (user.username !== restaurant.makerID) {
            // 소유자이면 자기를 멤버에서 빼는 것 불가
            try {
                const _member = await DataStore.delete(
                    Member,
                    (member) =>
                        member
                            .username("eq", user.username)
                            .restaurantID(
                                "eq",
                                restaurant.id
                            )
                ); // delete member

                // console.log('memberLength', _member.length)
                if (_member.length > 0) {
                    // 현재 등록이 되어 있는 상태라면
                    const CURRENT_ITEM =
                        await DataStore.query(
                            Restaurant,
                            restaurant.id
                        );
                    // console.log('CURRENT_ITEM', CURRENT_ITEM)
                    await DataStore.save(
                        Restaurant.copyOf(
                            CURRENT_ITEM,
                            (updated) => {
                                // Update the values on {item} variable to update DataStore entry
                                updated.num_members -= 1;
                            }
                        )
                    );
                    navigation.goBack();
                    // refreshRestaurantList(id=restaurant.placeID);
                    setIsRegistered(false);
                } else {
                    Alert.alert(
                        "배달앤빵",
                        "등록되지 않은 음식점입니다.",
                        [{ text: "닫기" }]
                    );
                }
            } catch (error) {
                // console.log(error)
                if (
                    error.code ===
                    "ConcurrentModificationException"
                ) {
                    Alert.alert(
                        "배달앤빵",
                        "자신이 속한 가게가 아닙니다.",
                        [{ text: "닫기" }]
                    );
                } else if (
                    error.code === "NotFoundException"
                ) {
                    Alert.alert(
                        "배달앤빵",
                        "자신이 속한 가게가 아닙니다.",
                        [{ text: "닫기" }]
                    );
                } else {
                    // console.log('에러가 뭔지 모르겠어요')
                    alert("에러가 뭔지 모르겠어요");
                }
            }
        } else {
            Alert.alert(
                "배달앤빵",
                "자신이 만든 모집은 삭제할 수 없습니다.",
                [{ text: "확인" }]
            );
        }
    };

    const addMenu = async () => {
        // 기존에 등록되어 있을 때 메뉴 수정 및 추가
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
        }
    };

    const [membersList, setMembersList] = useState([]);

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
                        <Text style={styles.highlightText}>
                            {restaurant.name}
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
                            {"새롭게 주문하기"}
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
                                        { borderWidth: 0 },
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
                                        { borderWidth: 0 },
                                    ]}
                                    editable={false}
                                    placeholder={"가격(원)"}
                                    numberOfLines={2}
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
                                            : menuList
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
                    {restaurant.name}
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
                            onPress={makeNewMember}
                            disabled={isRegistered}
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
                                        name="account-plus-outline"
                                        size={iconSize}
                                        color={
                                            isRegistered
                                                ? colorPack.deactivated
                                                : colorPack.text_dark
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
                                    {"참여하기"}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                styles.restaurantButton_2
                            }
                            onPress={() => {
                                setModalVisible(true);
                            }}
                            disabled={!isRegistered}
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
                                        name="application-edit-outline"
                                        size={iconSize}
                                        color={
                                            !isRegistered
                                                ? colorPack.deactivated
                                                : colorPack.text_dark
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
                                    {"주문하기"}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                styles.restaurantButton_1
                            }
                            onPress={sendSMStoAuthor}
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
                                    {"호스트 연락"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={
                                styles.restaurantButton_2
                            }
                            onPress={() => deleteMember()}
                            disabled={!isRegistered}
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
                                        name="account-cancel-outline"
                                        size={iconSize}
                                        color={
                                            !isRegistered
                                                ? colorPack.deactivated
                                                : colorPack.text_dark
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
                                    {"주문취소"}
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
    //    console.log('Members', user, member, restaurant, index)

    const backgroundColor_odd = colorPack.highlight_dark;
    const backgroundColor_even = colorPack.highlight_light;
    var myBackgroundColor;
    if (Number(index) % 2 == 0) {
        myBackgroundColor = backgroundColor_even;
    } else {
        myBackgroundColor = backgroundColor_odd;
    }
    return (
        <TouchableOpacity
            style={[
                styles.restaurantList,
                { backgroundColor: myBackgroundColor },
            ]}
            key={member.id}
            disabled={true}
        >
            <View>
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
                {member.username === user.username ? (
                    <Text
                        style={[
                            styles.normalText_small,
                            styles.restaurantFee,
                        ]}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                    >
                        {"나의 주문"}
                    </Text>
                ) : (
                    <View></View>
                )}
            </View>
            <TouchableOpacity
                onPress={() => {
                    // console.log(member.menu);
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
