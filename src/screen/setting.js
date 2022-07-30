import { View, Text } from "react-native";

import { styles } from "../style/style";

export default function Setting_page({ navigation }) {
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

    return (
        <View style={styles.container}>
            <Text>SettingScreen</Text>
        </View>
    );
}
