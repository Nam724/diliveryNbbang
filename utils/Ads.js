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
        : "ca-app-pub-3940256099942544/2934735716"; // 샘플 광고 ID

const isAdsEnabled =
    Platform.OS === "android" || Platform.OS === "ios";

export function RestaurantBannerAds() {
    return isAdsEnabled ? (
        <View style={styles.adsContainer}>
            <AdMobBanner
                bannerSize="banner"
                adUnitID={adBannerUnitId} // Test ID, Replace with your-admob-unit-id
                servePersonalizedAds={true} // true or false
                onDidFailToReceiveAdWithError={(err) => {
                    console.log(err);
                }}
            />
        </View>
    ) : (
        <View></View>
    );
}
