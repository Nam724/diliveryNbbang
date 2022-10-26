import {
    AdMobBanner,
    requestPermissionsAsync,
    getPermissionsAsync,
} from "expo-ads-admob";
import { useEffect, useState } from "react";
import {
    Alert,
    Linking,
    Platform,
    View,
} from "react-native";
import { styles } from "../src/style/style";

let servePersonalizedAds = true;
let _isAdsEnabled =
    Platform.OS === "android" || Platform.OS === "ios";
export function MainBannerAds() {
    const adBannerUnitId = Platform.select({
        ios: "ca-app-pub-1145139773627965/9125452802",
        android: "ca-app-pub-1145139773627965/8701930912",
    });
    const [isAdsEnabled, setIsAdsEnabled] =
        useState(_isAdsEnabled);

    return isAdsEnabled ? (
        <View style={styles.adsContainer}>
            <AdMobBanner
                bannerSize="banner"
                adUnitID={adBannerUnitId} // Test ID, Replace with your-admob-unit-id
                servePersonalizedAds={servePersonalizedAds} // true or false
                onDidFailToReceiveAdWithError={(err) => {
                    setIsAdsEnabled(false);
                    // alert(err);
                }}
            />
        </View>
    ) : (
        <View></View>
    );
}

export function RestaurantAuthBannerAds() {
    const adBannerUnitId = Platform.select({
        ios: "ca-app-pub-1145139773627965/5219336115",
        android: "ca-app-pub-1145139773627965/9836140498",
    });
    const [isAdsEnabled, setIsAdsEnabled] =
        useState(_isAdsEnabled);

    return isAdsEnabled ? (
        <View style={styles.adsContainer}>
            <AdMobBanner
                bannerSize="banner"
                adUnitID={adBannerUnitId} // Test ID, Replace with your-admob-unit-id
                servePersonalizedAds={servePersonalizedAds} // true or false
                onDidFailToReceiveAdWithError={(err) => {
                    setIsAdsEnabled(false);
                    // alert(err);
                }}
            />
        </View>
    ) : (
        <View></View>
    );
}

export function RestaurantGuestBannerAds() {
    const adBannerUnitId = Platform.select({
        ios: "ca-app-pub-1145139773627965/9825080947",
        android: "ca-app-pub-1145139773627965/1391771748",
    });
    const [isAdsEnabled, setIsAdsEnabled] =
        useState(_isAdsEnabled);

    return isAdsEnabled ? (
        <View style={styles.adsContainer}>
            <AdMobBanner
                bannerSize="banner"
                adUnitID={adBannerUnitId} // Test ID, Replace with your-admob-unit-id
                servePersonalizedAds={servePersonalizedAds} // true or false
                onDidFailToReceiveAdWithError={(err) => {
                    setIsAdsEnabled(false);
                    // alert(err);
                }}
            />
        </View>
    ) : (
        <View></View>
    );
}

export function RestaurantFinishedBannerAds() {
    const adBannerUnitId = Platform.select({
        ios: "ca-app-pub-1145139773627965/7462356079",
        android: "ca-app-pub-1145139773627965/9078690071",
    });
    const [isAdsEnabled, setIsAdsEnabled] =
        useState(_isAdsEnabled);

    return isAdsEnabled ? (
        <View style={styles.adsContainer}>
            <AdMobBanner
                bannerSize="banner"
                adUnitID={adBannerUnitId} // Test ID, Replace with your-admob-unit-id
                servePersonalizedAds={servePersonalizedAds} // true or false
                onDidFailToReceiveAdWithError={(err) => {
                    setIsAdsEnabled(false);
                    // alert(err);
                }}
            />
        </View>
    ) : (
        <View></View>
    );
}

export function ChatBannerAds() {
    const adBannerUnitId = Platform.select({
        ios: "ca-app-pub-1145139773627965/7665821460",
        android: "ca-app-pub-1145139773627965/1471662793",
    });
    const [isAdsEnabled, setIsAdsEnabled] =
        useState(_isAdsEnabled);

    return isAdsEnabled ? (
        <View style={styles.adsContainer}>
            <AdMobBanner
                bannerSize="banner"
                adUnitID={adBannerUnitId} // Test ID, Replace with your-admob-unit-id
                servePersonalizedAds={servePersonalizedAds} // true or false
                onDidFailToReceiveAdWithError={(err) => {
                    setIsAdsEnabled(false);
                    // alert(err);
                }}
            />
        </View>
    ) : (
        <View></View>
    );
}
