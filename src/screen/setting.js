import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    colorPack,
    height,
    styles,
    width,
    iconSize,
} from "../style/style";
import { Auth } from "aws-amplify";
import * as MailComposer from "expo-mail-composer";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import { Image } from "react-native";
import { SafeAreaView } from "react-native";

// 버전 정보 꼭 바꾸기
const version = "1.0.11";

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
                            // console.log(result);
                            navigation.replace("SignIn", {
                                autoLogin: false,
                            });
                        } catch (error) {
                            // console.log(
                            //     "Error deleting user",
                            //     error
                            // );
                        }
                    },
                },
            ]
        );
    }

    const [
        isPasswordChangeVisible,
        setIsPasswordChangeVisible,
    ] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");

    const changePassword = () => {
        if (newPassword === newPassword2) {
            Auth.currentAuthenticatedUser()
                .then((user) => {
                    return Auth.changePassword(
                        user,
                        oldPassword,
                        newPassword
                    );
                })
                .then((data) => {
                    // console.log(data);
                    Alert.alert(
                        "배달앤빵",
                        "비밀번호 변경이 완료되었습니다. 자동 로그인 정보에 반영하시겠습니까?",
                        [
                            {
                                text: "취소",
                                onPress: () => {},
                            },
                            {
                                text: "반영",
                                onPress: () => {
                                    const loginInfo = {
                                        email: user.email,
                                        password:
                                            newPassword,
                                    };
                                    AsyncStorage.setItem(
                                        "@autoLogin",
                                        "true"
                                    );
                                    AsyncStorage.setItem(
                                        "@loginInfoToken",
                                        JSON.stringify(
                                            loginInfo
                                        )
                                    );
                                    navigation.replace(
                                        "SignIn",
                                        { autoLogin: true }
                                    );
                                },
                            },
                        ]
                    );
                })
                .catch((err) => {
                    console.log(err);
                    if (
                        err ==
                        "Incorrect username or password."
                    ) {
                        Alert.alert(
                            "배달앤빵",
                            "현재 비밀번호가 일치하지 않습니다."
                        );
                        setOldPassword("");
                        setNewPassword("");
                        setNewPassword2("");
                    } else if (
                        err ==
                        "Attempt limit exceeded, please try after some time."
                    ) {
                        Alert.alert(
                            "배달앤빵",
                            "비밀번호 현경 요청 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요."
                        );
                        setOldPassword("");
                        setNewPassword("");
                        setNewPassword2("");
                    }
                });
        }
    };

    const themeToggle = async () => {
        // const theme = await AsyncStorage.getItem("@theme");
        // AsyncStorage.setItem(
        //     "@theme",
        //     theme === "light" ? "dark" : "light"
        // );
        Alert.alert(
            "배달앤빵",
            "아직 지원하지 않는 기능입니다."
        );
    };

    const [
        isSendMsgToSupportVisible,
        setIsSendMsgToSupportVisible,
    ] = useState(false);

    const [sendMsgToSupportText, setSendMsgToSupportText] =
        useState("");

    const sendMsgToSupport = () => {
        // console.log("sendMsgToSupport");
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
                    {"내 정보 및 설정"}
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior="padding"
                style={{
                    justifyContent: "space-around",
                    alignContent: "space-between",
                }}
            >
                <SafeAreaView>
                    <ScrollView>
                        <View
                            style={{
                                paddingBottom:
                                    (height * 150) / 2000,
                            }}
                        >
                            <View style={styles.header}>
                                <Text
                                    style={
                                        styles.normalText
                                    }
                                >
                                    {"내 정보"}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    marginVertical:
                                        height * 0.02,
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={[
                                        styles.normalText,
                                        {
                                            textAlign:
                                                "left",
                                        },
                                    ]}
                                >
                                    {`아이디 : ${
                                        user.email
                                    }\n\n전화번호 : ${
                                        user.phone_number
                                    }\n\n계좌번호 : ${
                                        user.address
                                            ? user.address
                                            : "없음"
                                    }`}
                                </Text>

                                <View
                                    style={{
                                        flex: 1,
                                        marginVertical:
                                            height * 0.02,
                                        borderColor:
                                            isPasswordChangeVisible
                                                ? colorPack.deactivated
                                                : colorPack.representative,
                                        borderWidth: 1,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            const prevIsPasswordChangeVisible =
                                                isPasswordChangeVisible;
                                            setIsPasswordChangeVisible(
                                                !prevIsPasswordChangeVisible
                                            );
                                        }}
                                        style={
                                            styles.goToSignUpInButton
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.normalText
                                            }
                                        >
                                            {isPasswordChangeVisible
                                                ? "비밀번호 변경 창 닫기"
                                                : "비밀번호 변경"}
                                        </Text>
                                    </TouchableOpacity>
                                    {isPasswordChangeVisible ? (
                                        <View>
                                            <View>
                                                <Text
                                                    style={
                                                        styles.normalText
                                                    }
                                                >
                                                    현재
                                                    비밀번호
                                                </Text>
                                                <TextInput
                                                    style={
                                                        styles.textInputBox
                                                    }
                                                    onChangeText={(
                                                        text
                                                    ) => {
                                                        setOldPassword(
                                                            text
                                                        );
                                                    }}
                                                    autoComplete="password"
                                                    keyboardType="default"
                                                    maxLength={
                                                        20
                                                    }
                                                    secureTextEntry={
                                                        true
                                                    }
                                                ></TextInput>
                                                <Text
                                                    style={
                                                        styles.normalText
                                                    }
                                                >
                                                    새로운
                                                    비밀번호
                                                </Text>
                                                <TextInput
                                                    style={[
                                                        styles.textInputBox,
                                                    ]}
                                                    onChangeText={(
                                                        text
                                                    ) => {
                                                        setNewPassword(
                                                            text
                                                        );
                                                    }}
                                                    autoComplete="password"
                                                    keyboardType="default"
                                                    maxLength={
                                                        20
                                                    }
                                                    secureTextEntry={
                                                        true
                                                    }
                                                ></TextInput>
                                                <Text
                                                    style={
                                                        styles.normalText
                                                    }
                                                >
                                                    새로운
                                                    비밀번호를
                                                    다시
                                                    입력해주세요.
                                                </Text>
                                                <TextInput
                                                    style={[
                                                        styles.textInputBox,
                                                        {
                                                            borderColor:
                                                                newPassword !==
                                                                newPassword2
                                                                    ? colorPack.warning
                                                                    : colorPack.highlight_light,
                                                        },
                                                    ]}
                                                    onChangeText={(
                                                        text
                                                    ) => {
                                                        setNewPassword2(
                                                            text
                                                        );
                                                    }}
                                                    autoComplete="password"
                                                    keyboardType="default"
                                                    maxLength={
                                                        20
                                                    }
                                                    secureTextEntry={
                                                        true
                                                    }
                                                ></TextInput>
                                                <TouchableOpacity
                                                    onPress={
                                                        changePassword
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
                                                        비밀번호
                                                        변경하기
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ) : (
                                        <View></View>
                                    )}
                                </View>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    marginVertical:
                                        height * 0.02,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={logOut}
                                    style={
                                        styles.goToSignUpInButton
                                    }
                                >
                                    <Text
                                        style={
                                            styles.highlightText
                                        }
                                    >
                                        {"로그아웃"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    marginVertical:
                                        height * 0.02,
                                    borderColor:
                                        isSendMsgToSupportVisible
                                            ? colorPack.deactivated
                                            : colorPack.representative,
                                    borderWidth: 1,
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
                                        {isSendMsgToSupportVisible
                                            ? "창 닫기"
                                            : "개발자에게 의견 보내기"}
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
                                style={{
                                    flex: 1,
                                    marginVertical:
                                        height * 0.02,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        Linking.openURL(
                                            "https://nam724.github.io/homepage/%EB%B0%B0%EB%8B%AC%EC%95%A4%EB%B9%B5.html"
                                        );
                                    }}
                                    style={
                                        styles.goToSignUpInButton
                                    }
                                >
                                    <Text
                                        style={
                                            styles.normalText
                                        }
                                    >
                                        {"개인정보처리방침"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    marginVertical:
                                        height * 0.02,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={deleteUser}
                                    style={
                                        styles.goToSignUpInButton
                                    }
                                >
                                    <Text
                                        style={
                                            styles.normalText_small
                                        }
                                    >
                                        {"계정 삭제"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.header}>
                                <Text
                                    style={
                                        styles.normalText
                                    }
                                >
                                    {"앱 설정"}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    marginVertical:
                                        height * 0.02,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={themeToggle}
                                    style={
                                        styles.goToSignUpInButton
                                    }
                                >
                                    <Text
                                        style={
                                            styles.highlightText
                                        }
                                    >
                                        {"테마 변경"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.header}>
                                <Text
                                    style={
                                        styles.normalText
                                    }
                                >
                                    {"앱 정보"}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    paddingVertical:
                                        height * 0.02,
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    source={require("../../assets/배달앤빵.png")}
                                    style={{
                                        width: width * 0.3,
                                        height: width * 0.3,
                                    }}
                                ></Image>
                                <Text
                                    style={
                                        styles.normalText
                                    }
                                >
                                    {`버전: ${version}\n제작자: 남상현  \n제작자 이메일: guardprec@gmail.com\nthank you for using this app!`}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </View>
    );
}
