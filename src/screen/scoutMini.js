import {
    colorPack,
    styles,
    width,
    iconSize,
} from "../style/style";
import {
    View,
    ActivityIndicator,
    Text,
    Image,
} from "react-native";

export default function ScoutMini_page({}) {
    return (
        <View
            style={[
                styles.container,
                { justifyContent: "center" },
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
                        width: width * 0.5,
                        height: width * 0.5,
                        marginLeft: width * 0.25,
                    }}
                />
            </View>
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {"정보를 불러오는 중입니다."}
                </Text>
            </View>
            <ActivityIndicator
                size="large"
                animating={true}
                color={colorPack.text_light}
            />
        </View>
    );
}
