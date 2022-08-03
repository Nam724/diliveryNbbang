import { Platform, View } from "react-native";

const adBannerUnitId =
    Platform.OS === "android"
        ? "ca-app-pub-1145139773627965/8701930912"
        : "sampleID"; // 샘플 광고 ID

const isAdsEnabled = Platform.OS === "android";

export function RestaurantBannerAds() {
    return <View />;
}
