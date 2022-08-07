import { Platform, View } from "react-native";
import { styles } from "../src/style/style";

const isAdsEnabled =
    Platform.OS === "android" || Platform.OS === "ios";

export function RestaurantBannerAds() {
    return isAdsEnabled ? (
        <View style={styles.adsContainer}></View>
    ) : (
        <View></View>
    );
}
