import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
} from "react-native";
import { useState, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import {
    styles,
    colorPack,
    mapStyle,
    width,
    iconSize,
    height,
} from "../style/style";
import { Chat, Ros } from "../models";

import { SafeAreaView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RestaurantFinishedBannerAds } from "../../utils/Ads";
import { color, set } from "react-native-reanimated";
import { API, graphqlOperation } from "aws-amplify";
import * as subscriptions from "../graphql/subscriptions";
export default function ScoutMini_page({
    route,
    navigation,
}) {
    const [member, setMember] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    // const user = route.params.user; //{username: 'test', email: ''}
    useEffect(() => {
        // setInterval(() => {
        //     setScout_mini_pos({
        //         pos_x: 5,
        //         pos_y: 10,
        //     });
        //     console.log("scout_mini_pos: ", scout_mini_pos);
        // }, 1000);
        getPos();
    }, []);
    const scout_mini = [
        Main_restaurantList_ScoutMini(
            "632fc8e2-90cf-480c-9574-276a4dc348c6",
            "GoalPoint1",
            1,
            "1"
        ),
        Main_restaurantList_ScoutMini(
            "53160c3a-ea6b-4d91-a800-a34112866437",
            "GoalPoint2",
            2,
            "2"
        ),
        Main_restaurantList_ScoutMini(
            "b06d6812-afbf-4a7a-afa6-c4784b94c1ab",
            "GoalPoint3",
            3,
            "1"
        ),
    ];
    const [scout_mini_pos, setScout_mini_pos] = useState({
        pos_x: 5,
        pos_y: 10,
    });

    const getPos = async () => {
        const _pos = await DataStore.query(
            Chat,
            "83236c00-e0e1-46ee-8563-7bceada246a3"
        );
        // console.log("_messages", _pos);

        const observePos = DataStore.observe(
            Chat,
            "83236c00-e0e1-46ee-8563-7bceada246a3"
        ).subscribe((msg) => {
            // console.log("msg: ", msg);
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {"스카우트 미니 1"}
                </Text>
                <Text style={styles.highlightText}>
                    {"배달 대기중"}
                </Text>
            </View>
            <View style={styles.map}>
                <Image
                    source={require("../../assets/scoutMiniMap.png")}
                    style={styles.map}
                />
                <Image
                    source={require("../../assets/startPoint.png")}
                    style={{
                        position: "absolute",
                        top: (height * 200) / 2000,
                        left: (width * 200) / 2000,
                        height: 30,
                        width: 30,
                    }}
                />

                <Image
                    source={require("../../assets/goalPoint1.png")}
                    style={{
                        position: "absolute",
                        top: (height * 600) / 2000,
                        left: (width * 1000) / 2000,
                        height: 30,
                        width: 30,
                    }}
                />
                <Image
                    source={require("../../assets/goalPoint2.png")}
                    style={{
                        position: "absolute",
                        top: (height * 520) / 2000,
                        left: (width * 1600) / 2000,
                        height: 30,
                        width: 30,
                    }}
                />
                <Image
                    source={require("../../assets/goalPoint3.png")}
                    style={{
                        position: "absolute",
                        top: (height * 430) / 2000,
                        left: (width * 600) / 2000,
                        height: 30,
                        width: 30,
                    }}
                />
                <Image
                    source={require("../../assets/scoutMini_red.png")}
                    style={{
                        position: "absolute",
                        left:
                            (width * scout_mini_pos.pos_x) /
                            2000,
                        top:
                            (height *
                                scout_mini_pos.pos_y) /
                            2000,
                        height: 30,
                        width: 35,
                    }}
                />
            </View>
            <SafeAreaView>
                <RestaurantFinishedBannerAds />
                <ScrollView
                    style={styles.restaurantListContainer}
                >
                    {scout_mini}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

/**
 *
 * @param {String} id 객체 아이디 값
 * @param {String} title
 * @param {Int} posNum
 * @param {Int} colorNum 짝수/홀수에 따라 색상 다르게
 * @returns
 */
function Main_restaurantList_ScoutMini(
    id,
    title,
    posNum,
    colorNum
) {
    const backgroundColor_odd = colorPack.highlight_dark;
    const backgroundColor_even = colorPack.highlight_light;
    var myBackgroundColor;
    if (Number(colorNum) % 2 == 0) {
        myBackgroundColor = backgroundColor_even;
    } else {
        myBackgroundColor = backgroundColor_odd;
    }
    const [CURRENT_ROS, setCURRENT_ROS] = useState(null);
    useEffect(() => {
        getCurrentRos();
        observeStatus();
        // console.log(CURRENT_ROS);
    }, []);

    const [subTitle, setSubTitle] = useState("배달 대기중");

    //* 현재 로스를 가져온다.
    const getCurrentRos = async () => {
        let _CURRENT_ROS = "";

        _CURRENT_ROS = await DataStore.query(Ros, id);

        if (_CURRENT_ROS.started === true) {
            setSubTitle("배달 중");
        } else if (_CURRENT_ROS.arrived === true) {
            setSubTitle("배달 완료");
        } else {
            setSubTitle("배달 대기중");
        }
        setCURRENT_ROS(_CURRENT_ROS);
        // console.log("current_ros: ", _CURRENT_ROS);
    };

    const observeStatus = () => {
        // console.log("observeStatus of " + id);
        // let observeRos = DataStore.observeQuery(Ros, (r) =>
        //     r.id("eq", id)
        // ).subscribe((snapshot) => {
        //     const { items, isSync } = snapshot;
        //     console.log("items", items[0]);
        // });
        // let observeRos = DataStore.observe(
        //     Ros,
        //     id
        // ).subscribe((msg) => {
        //     console.log("msg: ", msg);
        // });
        console.log("observeStatus of " + id);
        // const observeRos = API.graphql({
        //     query: subscriptions.onUpdateRos,
        //     variables: {
        //         eq: id,
        //     },
        // }).subscribe({
        //     next: ({ value: { data } }) => {
        //         let newRos = data;
        //         console.log("realTime_Ros: ", newRos);
        //     },
        // });
    };
    /**
     *
     * @param {*Int} posNum, 1 또는 2 또는 3
     */
    const deliver_start = async () => {
        if (CURRENT_ROS.started === false) {
            alert("배달시작");
            const response = await DataStore.save(
                Ros.copyOf(CURRENT_ROS, (updated) => {
                    updated.started = true;
                })
            );
            setCURRENT_ROS(response);
            setSubTitle("배달 중");
        } else {
            alert("이미 시작된 배달입니다.");
        }
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
                {title}
            </Text>
            <Text
                style={[
                    styles.deactivatedText,
                    styles.restaurantFee,
                ]}
            >
                {subTitle}
            </Text>
        </TouchableOpacity>
    ); // return
}
