import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colorPack, height, styles } from "../style/style";
import { Auth } from "aws-amplify";
import * as MailComposer from "expo-mail-composer";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

export default function Setting_page({
    route,
    navigation,
}) {
    const user = route.params.user;
    const setUser = (user) => {
        AsyncStorage.setItem("@user", JSON.stringify(user));
    };

    const logOut = () => {
        Alert.alert("배달앤빵", "로그아웃을 할까요?", [
            {
                text: "로그아웃",
                onPress: async () => {
                    await AsyncStorage.setItem(
                        "@autoLogin",
                        "false"
                    );
                    setUser({});
                    await Auth.signOut();
                    navigation.replace("SignIn", {
                        autoLogin: false,
                    });
                },
            },
            {
                text: "취소",
                onPress: () => {
                    // console.log('Cancel Pressed');
                },
            },
        ]);
    };

    async function deleteUser() {
        Alert.alert(
            "배달앤빵",
            "계정을 삭제하고 배달앤빵에서 탈퇴하시겠습니까?",
            [
                {
                    text: "취소",
                    onPress: () => {
                        // console.log('Cancel Pressed');
                    },
                },
                {
                    text: "삭제",
                    onPress: async () => {
                        try {
                            const result =
                                await Auth.deleteUser();
                            console.log(result);
                            navigation.replace("SignIn", {
                                autoLogin: false,
                            });
                        } catch (error) {
                            console.log(
                                "Error deleting user",
                                error
                            );
                        }
                    },
                },
            ]
        );
    }

    const changePassword = () => {
        Auth.currentAuthenticatedUser()
            .then((user) => {
                return Auth.changePassword(
                    user,
                    "oldPassword",
                    "newPassword"
                );
            })
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
    };

    const [
        isSendMsgToSupportVisible,
        setIsSendMsgToSupportVisible,
    ] = useState(false);

    const [sendMsgToSupportText, setSendMsgToSupportText] =
        useState("");

    const sendMsgToSupport = () => {
        console.log("sendMsgToSupport");
        const text = sendMsgToSupportText;

        MailComposer.composeAsync(
            {
                subject: "배달앤빵 이용지원",
                recipients: ["guardprec@gmail.com"],
                body: `배달앤빵 이용자의 의견입니다.\n\n${text}\n\nfrom: ${user.email}`,
            },
            (error) => {
                console.log(error);
            }
        );
        setIsSendMsgToSupportVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    설정
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior="padding"
                style={{
                    justifyContent: "space-evenly",
                    alignContent: "center",
                }}
            >
                <ScrollView>
                    <View>
                        <View
                            style={{
                                height: isSendMsgToSupportVisible
                                    ? height * 0.4
                                    : height * 0.2,
                                marginTop: height * 0.05,
                            }}
                        >
                            <TouchableOpacity
                                style={
                                    styles.goToSignUpInButton
                                }
                                onPress={() => {
                                    const _isVisible =
                                        isSendMsgToSupportVisible;
                                    setIsSendMsgToSupportVisible(
                                        !_isVisible
                                    );
                                }}
                            >
                                <Text
                                    style={
                                        styles.normalText
                                    }
                                >
                                    {
                                        "개발자에게 의견 보내기"
                                    }
                                </Text>
                            </TouchableOpacity>
                            {isSendMsgToSupportVisible && (
                                <View>
                                    <TextInput
                                        style={[
                                            styles.textInputBox,
                                            styles.normalText,
                                            {
                                                height:
                                                    (height *
                                                        400) /
                                                    2000,
                                            },
                                        ]}
                                        multiline={true}
                                        onChangeText={(
                                            text
                                        ) => {
                                            setSendMsgToSupportText(
                                                text
                                            );
                                        }}
                                        placeholder="의견을 입력하세요"
                                        placeholderTextColor={
                                            colorPack.deactivated
                                        }
                                    ></TextInput>
                                    <TouchableOpacity
                                        onPress={
                                            sendMsgToSupport
                                        }
                                        style={
                                            styles.goToSignUpInButton
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.normalText
                                            }
                                        >
                                            {"보내기"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View
                            style={{ height: height * 0.2 }}
                        >
                            <TouchableOpacity
                                onPress={logOut}
                                style={
                                    styles.goToSignUpInButton
                                }
                            >
                                <Text
                                    style={
                                        styles.normalText
                                    }
                                >
                                    {"로그아웃"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{ height: height * 0.2 }}
                        >
                            <TouchableOpacity
                                onPress={deleteUser}
                                style={
                                    styles.goToSignUpInButton
                                }
                            >
                                <Text
                                    style={
                                        styles.normalText
                                    }
                                >
                                    {"계정 삭제"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
