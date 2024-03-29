import { Auth } from "@aws-amplify/auth";
import { useEffect, useState } from "react";
import {
    TextInput,
    TouchableOpacity,
    View,
    Text,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    styles,
    width,
    height,
    colorPack,
    iconSize,
} from "../style/style";
import Checkbox from "expo-checkbox";
import { useFocusEffect } from "@react-navigation/native";

function emailTest(email) {
    const reg =
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === true) {
        return true;
    } else {
        return false;
    }
}

async function saveLoginInfo(email = "", password = "") {
    const loginInfo = {
        email: email,
        password: password,
    };
    await AsyncStorage.setItem(
        "@loginInfoToken",
        JSON.stringify(loginInfo)
    );
}

export default function SignIn_page({ route, navigation }) {
    // 자동로그인 토글
    const [autoLogin, setAutoLogin] = useState(
        route.autoLogin === "true"
    );

    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        //이거 주석 달면 자동로그인 안됨
        loginFirst();
    }, []);

    const setUser = (user) => {
        AsyncStorage.setItem("@user", JSON.stringify(user));
    };

    const getUser = async () => {
        const user = await AsyncStorage.getItem("@user");
        return JSON.parse(user);
    };

    const loginFirst = async () => {
        let value = null;
        const _autoLogin = await AsyncStorage.getItem(
            "@autoLogin"
        );
        if (_autoLogin === "true") {
            setAutoLogin(true);
            try {
                await AsyncStorage.getItem(
                    "@loginInfoToken"
                ).then((_value) => {
                    value = JSON.parse(_value);
                    setAutoLogin(true);
                    // console.log(value);
                    if (value.email && value.password) {
                        // console.log('value값이 있어서 바로 로그인합니다.', value);
                        setEmail(value.email);
                        setPassword(value.password);
                        signIn(value.email, value.password);
                    } else {
                        // console.log('value값이 없어서 로그인을 진행합니다.');
                    }
                });
            } catch (error) {
                // console.log(err);
                value = null;
                // console.log('value값이 없어서 로그인을 진행합니다.');
            }
        }
    };

    const signIn = async (
        email = email,
        password = password
    ) => {
        try {
            const _user = await Auth.signIn(
                email,
                password
            );
            console.log("user", _user);
            setUser(_user);
            if (autoLogin) {
                saveLoginInfo(email, password);
            } else {
                await AsyncStorage.removeItem(
                    "@loginInfoToken"
                );
            }
            setEmail("");
            setPassword("");
            navigation.replace("Main", {
                user: JSON.stringify(_user),
                autoLogin: autoLogin,
            });
        } catch (error) {
            // console.log('error signing in', error);
            if (error === "UserNotConfirmedException") {
                Alert.alert(
                    "배달앤빵",
                    "허가되지 않은 사용자입니다.",
                    [{ text: "확인", onPress: () => {} }]
                );
                return false;
            } else if (
                error ==
                "UserNotFoundException: User does not exist."
            ) {
                Alert.alert(
                    "배달앤빵",
                    "등록되지 않은 이메일입니다.",
                    [{ text: "확인", onPress: () => {} }]
                );
                return false;
            } else if (
                error ==
                "NotAuthorizedException: Incorrect username or password."
            ) {
                Alert.alert(
                    "배달앤빵",
                    "비밀번호가 일치하지 않습니다.",
                    [
                        {
                            text: "확인",
                            onPress: () => {
                                setPassword("");
                            },
                        },
                    ]
                );
                return false;
            } else if (error == "NetworkError") {
                Alert.alert(
                    "배달앤빵",
                    "네트워크 오류입니다.",
                    [{ text: "확인", onPress: () => {} }]
                );
                return false;
            } else if (
                error ==
                "InvalidParameterException: Custom auth lambda trigger is not configured for the user pool."
            ) {
                Alert.alert(
                    "배달앤빵",
                    "로그인 오류입니다.",
                    [{ text: "확인", onPress: () => {} }]
                );
                return false;
            } else if (
                error ==
                "signing in Error: Pending sign-in attempt already in progress"
            ) {
                Alert.alert(
                    "배달앤빵",
                    "이미 로그인중입니다.",
                    [{ text: "확인", onPress: () => {} }]
                );
                return false;
            } else {
                Alert.alert(
                    "배달앤빵",
                    "다시 시도해주세요.",
                    [{ text: "확인", onPress: () => {} }]
                );
                return false;
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ alignContent: "center" }}>
                <Image
                    source={require("../../assets/icon.png")}
                    style={{
                        width: width * 0.3,
                        height: width * 0.3,
                        marginLeft: width * 0.35,
                    }}
                />
            </View>
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {"배달앤빵"}
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior="padding"
                style={{ flex: 1 }}
            >
                <ScrollView>
                    <View>
                        <View
                            style={{
                                marginTop:
                                    (height * 100) / 2000,
                                height:
                                    (height * 179) / 2000,
                            }}
                        >
                            <Text
                                style={styles.highlightText}
                            >
                                {"이메일"}
                            </Text>
                            <TextInput
                                autoComplete="email"
                                keyboardType="email-address"
                                style={[
                                    styles.textInputBox,
                                    styles.normalText,
                                ]}
                                onChangeText={(email) => {
                                    setEmail(email);
                                    setIsEmailValid(
                                        emailTest(email)
                                    );
                                }}
                                defaultValue={email}
                                accessibilityLabel={
                                    "email_input"
                                }
                            />
                        </View>
                        <View
                            style={{
                                marginTop:
                                    (height * 100) / 2000,
                                height:
                                    (height * 179) / 2000,
                            }}
                        >
                            <Text
                                style={styles.highlightText}
                            >
                                {"비밀번호"}
                            </Text>
                            <TextInput
                                secureTextEntry={true}
                                autoComplete="password"
                                keyboardType="default"
                                style={[
                                    styles.textInputBox,
                                    styles.normalText,
                                ]}
                                maxLength={20}
                                onChangeText={(password) =>
                                    setPassword(password)
                                }
                                defaultValue={password}
                                accessibilityLabel={
                                    "password_input"
                                }
                            />
                        </View>

                        <View
                            style={{
                                marginTop:
                                    (height * 100) / 2000,
                                height:
                                    (height * 50) / 2000,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Checkbox
                                style={
                                    styles.autoLoginCheckBox
                                }
                                value={autoLogin}
                                onValueChange={async (
                                    isChecked
                                ) => {
                                    setAutoLogin(isChecked);
                                    await AsyncStorage.setItem(
                                        "@autoLogin",
                                        JSON.stringify(
                                            isChecked
                                        )
                                    );
                                }}
                                label="자동 로그인"
                                color={
                                    autoLogin
                                        ? colorPack.highlight_dark
                                        : colorPack.deactivated
                                }
                            ></Checkbox>
                            <Text style={styles.normalText}>
                                {"자동 로그인"}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPressOut={() =>
                                signIn(email, password)
                            }
                            style={[
                                styles.goToSignUpInButton,
                                {
                                    marginTop:
                                        (height * 100) /
                                        2000,
                                },
                            ]}
                            disabled={
                                !isEmailValid &&
                                password.length <= 0
                            }
                        >
                            <Text
                                style={styles.highlightText}
                            >
                                {"로그인"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPressOut={() =>
                                navigation.navigate(
                                    "SignUp"
                                )
                            }
                            style={[
                                styles.goToSignUpInButton,
                                {
                                    marginTop:
                                        (height * 100) /
                                        2000,
                                },
                            ]}
                        >
                            <Text
                                style={styles.highlightText}
                            >
                                {"회원가입"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={{ top: (height * 350) / 2000 }}>
                <Text style={styles.deactivatedText}>
                    {
                        "presented by UNIST BTS Pseudo Tesla Team"
                    }
                </Text>
            </View>
        </View>
    );
}
