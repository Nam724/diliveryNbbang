import { DataStore } from "aws-amplify";
import { View, Text, TouchableOpacity } from "react-native";
import { Ros } from "../models";
import {
    colorPack,
    styles,
    width,
    iconSize,
} from "../style/style";

function Main_restaurantList(
    user,
    restaurant,
    num,
    navigation,
    place,
    isRegistered // boolean
) {
    const backgroundColor_odd = colorPack.highlight_dark;
    const backgroundColor_even = colorPack.highlight_light;
    var myBackgroundColor;

    // console.log("isRegistered: " + isRegistered);
    // console.log(
    //     "isFinishRecruiting" + restaurant.isFinishRecruiting
    // );

    // console.log('Main_restaurantList', user, restaurant)
    if (Number(num) % 2 == 0) {
        myBackgroundColor = backgroundColor_even;
    } else {
        myBackgroundColor = backgroundColor_odd;
    }

    // console.log(restaurantList)

    // return
    return restaurant.isFinishRecruiting ? (
        <View
            style={[
                styles.restaurantList,
                { backgroundColor: myBackgroundColor },
            ]}
            key={restaurant.id}
        >
            <TouchableOpacity
                onPress={() => {
                    // console.log(JSON.stringify(user))
                    navigation.navigate("Restaurant", {
                        user: user,
                        restaurant: restaurant,
                        place: place,
                    });
                    // console.log('pressed')
                }}
            >
                <Text
                    style={[
                        styles.deactivatedText,
                        styles.restaurantName,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {user.username == restaurant.makerID
                        ? `"${restaurant.name}"`
                        : restaurant.name}
                </Text>
            </TouchableOpacity>
            <Text
                style={[
                    styles.normalText,
                    styles.restaurantFee,
                ]}
                ellipsizeMode="tail"
                numberOfLines={1}
            >
                {""}
            </Text>

            <Text
                style={[
                    styles.normalText,
                    styles.restaurantMembers,
                ]}
                ellipsizeMode="tail"
                numberOfLines={1}
            >{`모집종료`}</Text>
        </View>
    ) : (
        <View
            style={[
                styles.restaurantList,
                { backgroundColor: myBackgroundColor },
            ]}
            key={restaurant.id}
        >
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("Restaurant", {
                        user: user,
                        restaurant: restaurant,
                        place: place,
                    });
                    // console.log('pressed')
                }}
            >
                <Text
                    style={[
                        isRegistered
                            ? styles.highlightText
                            : styles.normalText,
                        styles.restaurantName,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {user.username == restaurant.makerID
                        ? `"${restaurant.name}"`
                        : restaurant.name}
                </Text>
            </TouchableOpacity>
            <Text
                style={[
                    styles.normalText,
                    styles.restaurantFee,
                ]}
                ellipsizeMode="tail"
                numberOfLines={1}
            >
                {restaurant.num_members == 0
                    ? `총 ${restaurant.fee}원`
                    : `각 ${
                          restaurant.fee /
                          restaurant.num_members
                      }원`}
            </Text>

            <Text
                style={[
                    styles.normalText,
                    styles.restaurantMembers,
                ]}
                ellipsizeMode="tail"
                numberOfLines={1}
            >{`${restaurant.num_members}명`}</Text>
        </View>
    ); // return
}

function Main_restaurantList_sample(id, name, fee, num) {
    const myBackgroundColor = colorPack.highlight_dark;
    // return
    return (
        <TouchableOpacity
            style={[
                styles.restaurantList,
                { backgroundColor: myBackgroundColor },
            ]}
            key={id}
            disabled={true}
        >
            <Text
                style={[
                    styles.normalText,
                    styles.restaurantName,
                ]}
            >
                {name}
            </Text>

            <Text
                style={[
                    styles.deactivatedText,
                    styles.restaurantFee,
                ]}
            >{`${fee}`}</Text>
        </TouchableOpacity>
    ); // return
}

function Main_restaurantList_ScoutMini(id, name, fee, num) {
    const backgroundColor_odd = colorPack.highlight_dark;
    const backgroundColor_even = colorPack.highlight_light;
    var myBackgroundColor;
    if (Number(num) % 2 == 0) {
        myBackgroundColor = backgroundColor_even;
    } else {
        myBackgroundColor = backgroundColor_odd;
    }

    const deliver_start = async () => {
        alert("배달시작");
        await DataStore.save(
            new Ros({
                posNum: 1,
                started: false,
                arrived: false,
            })
        );
    };

    // return
    return (
        <TouchableOpacity
            style={[
                styles.restaurantList,
                { backgroundColor: myBackgroundColor },
            ]}
            key={id}
            onPress={deliver_start}
        >
            <Text
                style={[
                    styles.normalText,
                    styles.restaurantName,
                ]}
            >
                {name}
            </Text>
            <Text
                style={[
                    styles.deactivatedText,
                    styles.restaurantFee,
                ]}
            >{`${fee}`}</Text>
        </TouchableOpacity>
    ); // return
}

export {
    Main_restaurantList,
    Main_restaurantList_sample,
    Main_restaurantList_ScoutMini,
};
