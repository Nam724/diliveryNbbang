import Main_page from "./src/screen/main";
import SignUp_page from "./src/screen/signup";
import SignIn_page from "./src/screen/signin";
import Restaurant_page from "./src/screen/restaurant";
import { Amplify } from "aws-amplify";
import PushNotification from "@aws-amplify/pushnotification/lib/PushNotification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

import awsconfig from "./src/aws-exports";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { colorPack } from "./src/style/style";
import Setting_page from "./src/screen/setting";
import Loading_page_onlyPicture from "./src/screen/loading_page_onlyPicture";
import Chat_page from "./src/screen/chat";
import { useEffect } from "react";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";

Amplify.configure({
    awsconfig,
    PushNotification: {
        requestIOSPermissions: true,
    },
});

const Stack = createStackNavigator();

export default function App() {
    useEffect(() => {
        (async () => {
            const { status } =
                await requestTrackingPermissionsAsync();
            if (status === "granted") {
                console.log(
                    "Yay! I have user permission to track data"
                );
            }
        })();
    }, []);
    let [fontLoaded] = useFonts({
        happy_sans_bold: require("./assets/font/Happiness-Sans-Bold.ttf"),
        happy_sans_regular: require("./assets/font/Happiness-Sans-Regular.ttf"),
        happy_sans_title: require("./assets/font/Happiness-Sans-Title.ttf"),
    });
    if (fontLoaded) {
        // console.log(fontLoaded);
        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={"SignIn"}
                >
                    <Stack.Screen
                        name="SignIn"
                        component={SignIn_page}
                        options={{
                            headerTransparent: true,
                            headerTitle: "",
                            headerTintColor:
                                colorPack.text_light,
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="SignUp"
                        component={SignUp_page}
                        options={{
                            headerTransparent: true,
                            headerTitle: "",
                            headerTintColor:
                                colorPack.text_light,
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="Main"
                        component={Main_page}
                        options={{
                            headerTransparent: true,
                            headerTitle: "",
                            headerTintColor:
                                colorPack.text_light,
                            headerBackTitleVisible: false,
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="Setting"
                        component={Setting_page}
                        options={{
                            headerTransparent: true,
                            headerTitle: "",
                            headerTintColor:
                                colorPack.text_light,
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="Restaurant"
                        component={Restaurant_page}
                        options={{
                            headerTransparent: true,
                            headerTitle: "",
                            headerTintColor:
                                colorPack.text_light,
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="Chat"
                        component={Chat_page}
                        options={{
                            headerTransparent: true,
                            headerTitle: "",
                            headerTintColor:
                                colorPack.text_light,
                            headerBackTitleVisible: false,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    } else {
        // console.log(fontLoaded);
        return <Loading_page_onlyPicture />;
    }
}
