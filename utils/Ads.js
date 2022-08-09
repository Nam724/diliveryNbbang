import {
    AdMobBanner,
    AdMobInterstitial,
    setTestDeviceIDAsync,
    requestPermissionsAsync,
    getPermissionsAsync,
} from "expo-ads-admob";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { styles } from "../src/style/style";

const adBannerUnitId =
    Platform.OS === "android"
        ? "ca-app-pub-1145139773627965/8701930912"
        : "ca-app-pub-3940256099942544/2934735716"; // 샘플 광고 ID

export function RestaurantBannerAds() {
    useEffect(() => {
        getPermissions();
    }, []); // 안드로이드 또는 아이폰일 경우 광고 사용 권한 요청
    const [isAdsEnabled, setIsAdsEnabled] = useState(
        Platform.OS === "android" || Platform.OS === "ios"
    );
    const getPermissions = async () => {
        let { status } = true;
        await setTestDeviceIDAsync("EMULATOR");

        status = await requestPermissionsAsync();
        status = await getPermissionsAsync();
        await AdMobInterstitial.setAdUnitID(adBannerUnitId); // Test ID, Replace with your-admob-unit-id
        if (status === "granted") {
            await AdMobInterstitial.requestAdAsync({
                servePersonalizedAds: true,
            });
            await AdMobInterstitial.showAdAsync();

            setIsAdsEnabled(true);
        }
    };

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
