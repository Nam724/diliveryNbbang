import {
    View,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "../style/style";
import { Auth } from "aws-amplify";

export default function Setting_page({ navigation }) {
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    설정
                </Text>
            </View>
            <View>
                <TouchableOpacity
                    onPress={logOut}
                    style={styles.goToSignUpInButton}
                >
                    <Text style={styles.normalText}>
                        {"로그아웃"}
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity
                    onPress={changePassword}
                    style={styles.goToSignUpInButton}
                >
                    <Text style={styles.normalText}>
                        {"비밀번호 변경"}
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity
                    onPress={deleteUser}
                    style={styles.goToSignUpInButton}
                >
                    <Text style={styles.normalText}>
                        {"계정 삭제"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
