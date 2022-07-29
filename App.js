import Main_page from "./src/screen/main";
import SignUp_page from "./src/screen/signup";
import SignIn_page from "./src/screen/signin";
import Restaurant_page from "./src/screen/restaurant";
import { Amplify } from "aws-amplify";
import awsconfig from "./src/aws-exports";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { colorPack } from "./src/style/style";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./src/setting/reducer";

let store = createStore(reducer);

Amplify.configure(awsconfig);

const Stack = createStackNavigator();

export default function App() {
    let [fontLoaded] = useFonts({
        happy_sans_bold: require("./assets/font/Happiness-Sans-Bold.ttf"),
        happy_sans_regular: require("./assets/font/Happiness-Sans-Regular.ttf"),
        happy_sans_title: require("./assets/font/Happiness-Sans-Title.ttf"),
    });

    return (
        <Provider store={store}>
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
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
