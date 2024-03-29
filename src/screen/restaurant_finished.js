import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Member } from "../models";
import {
    styles,
    colorPack,
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
import { sendSMSAsync } from "expo-sms";
import { SafeAreaView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export default function Restaurant_page_finished({
    route,
    navigation,
}) {
    const [member, setMember] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const user = route.params.user; //{username: 'test', email: ''}
    const restaurant = route.params.restaurant; //{makerID: 'test', name: '', fee: 0, num_members: 0, menu: [], isFinishRecruiting: false}
    const place = route.params.place; //{name: '', latitude: 0, longitude: 0}

    useEffect(() => {
        getMembers(); // get member from database
        // console.log('user', user)
        // console.log('member', member)
        // console.log('restaurant', restaurant)
        // console.log('place', place)
    }, []);

    const getMembers = async () => {
        const members = await DataStore.query(
            Member,
            (member) =>
                member.restaurantID("eq", restaurant.id)
        );

        const _membersList = [];
        members.forEach(async (m, index) => {
            const _m = Members(user, m, restaurant, index);

            _membersList.push(_m);
            if (m.username == user.username) {
                setIsRegistered(true);
                // console.log('등록됨!')
            }
            // console.log(m)
        });
        setMembersList(_membersList);

        setMember(members);
        // console.log('isRegistered', isRegistered);
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
    const [membersList, setMembersList] = useState([]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {`배달 모집 완료! ${restaurant.name}`}
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
                                        name="message"
                                        size={iconSize}
                                        color={
                                            isRegistered
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
                                    {"채팅하기"}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                styles.restaurantButton_1
                            }
                            disabled={true}
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
                                            colorPack.deactivated
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
                            disabled={true}
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
                                            colorPack.deactivated
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
                            onPress={() => {
                                Alert.alert(
                                    "배달앤빵",
                                    "이미 모집이 끝났기 때문에 주문을 취소할 수 없습니다.\n주문을 취소하려면 호스트에게 연락해 배달을 모집중으로 바꾼 뒤 주문을 취소하십시오.",
                                    [
                                        { text: "취소" },
                                        {
                                            text: "호스트에게 연락",
                                            onPress: () => {
                                                sendSMStoAuthor();
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
                                        name="account-cancel-outline"
                                        size={iconSize}
                                        color={
                                            colorPack.deactivated
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
            <Text
                style={[
                    styles.highlightText,
                    styles.restaurantFee,
                ]}
                ellipsizeMode="tail"
                numberOfLines={1}
            >
                {member.username === user.username
                    ? "나의 주문"
                    : member.email.split("@")[0]}
            </Text>

            <TouchableOpacity
                onPress={() => {
                    Alert.alert(
                        `${
                            member.email.split("@")[0]
                        }님이 주문하신 메뉴`,
                        `${member.menu}\n음식값: ${
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
                >{`${member.menu[0]} 등 ${member.menu.length}개`}</Text>
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
