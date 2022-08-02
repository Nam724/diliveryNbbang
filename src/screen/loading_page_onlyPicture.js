import { View, Image } from "react-native";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
export default function Loading_page_onlyPicture({
    route,
    navigation,
}) {
    const width = Dimensions.get("screen").width; // 1000
    return (
        <View
            style={[
                {
                    alignContent: "center",
                    justifyContent: "center",
                    backgroundColor: "#17263C",
                    flex: 1,
                },
            ]}
        >
            <View
                style={{
                    alignContent: "center",
                    justifyContent: "center",
                }}
            >
                <Image
                    source={require("../../assets/icon.png")}
                    style={{
                        width: width * 0.8,
                        height: width * 0.8,
                        marginLeft: width * 0.1,
                    }}
                />
                <ActivityIndicator
                    size="large"
                    animating={true}
                    color={"#E4EAF2"}
                />
            </View>
        </View>
    );
}
