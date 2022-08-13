import Main_page from "./src/screen/main";
import SignUp_page from "./src/screen/signup";
import SignIn_page from "./src/screen/signin";
import Restaurant_page from "./src/screen/restaurant";
import { Amplify } from "aws-amplify";
import * as Notifications from "expo-notifications";
import awsconfig from "./src/aws-exports";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { colorPack } from "./src/style/style";
import Setting_page from "./src/screen/setting";
import Loading_page_onlyPicture from "./src/screen/loading_page_onlyPicture";
import Chat_page from "./src/screen/chat";
import { useEffect, useRef, useState } from "react";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

Amplify.configure(awsconfig);

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
        registerForPushNotificationsAsync().then(
            (token) => {
                setExpoPushToken(token);
            }
        );
        notificationListener.current =
            Notifications.addNotificationReceivedListener(
                (notification) => {
                    setNotification(notification);
                    alert(notification);
                    console.log(notification);
                }
            );
        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log(response);
                }
            );

        return () => {
            // Notifications.removeNotificationSubscription(
            //     notificationListener.current
            // );
            // Notifications.removeNotificationSubscription(
            //     responseListener.current
            // );
        };
    }, []);

    let [fontLoaded] = useFonts({
        happy_sans_bold: require("./assets/font/Happiness-Sans-Bold.ttf"),
        happy_sans_regular: require("./assets/font/Happiness-Sans-Regular.ttf"),
        happy_sans_title: require("./assets/font/Happiness-Sans-Title.ttf"),
    });

    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

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

async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } =
                await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            alert(
                "Failed to get push token for push notification!"
            );
            return;
        }
        token = (
            await Notifications.getDevicePushTokenAsync()
        ).data;
        console.log(token);
    } else {
        alert(
            "Must use physical device for Push Notifications"
        );
    }

    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync(
            "default",
            {
                name: "default",
                importance:
                    Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            }
        );
    }
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    console.log("token:", token); // b50a3c4f34b7c8e4349a2e03c5333805233b03be21ed99c4512f5747dac89a91
    alert(token);

    return token;
}
