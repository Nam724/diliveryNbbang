import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
    setTestDeviceIDAsync,
} from "expo-ads-admob";
import { Platform, View } from "react-native";
import { styles } from "../src/style/style";

const adBannerUnitId =
    Platform.OS === "android"
        ? "ca-app-pub-3940256099942544/6300978111" // sample android ad unit id
        : "ca-app-pub-3940256099942544/2934735716"; // 샘플 광고 ID

export function RestaurantBannerAds() {
    return Platform.OS === "android" ? (
        <View style={styles.adsContainer}>
            <AdMobBanner
                bannerSize="banner"
                adUnitID={adBannerUnitId} // Test ID, Replace with your-admob-unit-id
                servePersonalizedAds // true or false
                onDidFailToReceiveAdWithError={(err) => {
                    console.log(err);
                }}
            />
        </View>
    ) : (
        <View></View>
    );
}
