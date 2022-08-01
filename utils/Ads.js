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
        ? "ca-app-pub-1145139773627965/8701930912"
        : "sample ios ads ID"; // 샘플 광고 ID

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
