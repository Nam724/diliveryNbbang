import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import Constants from "expo-constants";

import { getStyle } from "../setting/setting_style";

export const height =
    Dimensions.get("screen").height -
    Constants.statusBarHeight; // 2000
export const width = Dimensions.get("screen").width; // 1000

const stylePack = getStyle();

export const colorPack = stylePack.colorPack;

export const mapStyle = stylePack.mapStyle;

export const iconSize = width * 0.05;

export const styles = StyleSheet.create({
    // TEXT STYLES
    normalText: {
        fontFamily: "happy_sans_bold",
        fontSize: width * 0.035, // 40
        color: colorPack.text_light,
        textAlign: "center",
    },
    normalText_small: {
        fontFamily: "happy_sans_bold",
        fontSize: width * 0.025, // 40
        color: colorPack.text_light,
        textAlign: "center",
    },
    highlightText: {
        fontFamily: "happy_sans_title",
        fontSize: width * 0.045, // 50
        color: colorPack.text_dark,
        textAlign: "center",
        fontWeight: "bold",
    },
    deactivatedText: {
        fontFamily: "happy_sans_regular",
        fontSize: width * 0.025, // 30
        color: colorPack.deactivated,
        textAlign: "center",
    },

    // CONTAINER STYLES
    container: {
        width: width,
        height: Dimensions.get("screen").height,
        backgroundColor: colorPack.representative,
        flexDirection: "column",
        paddingTop: Constants.statusBarHeight,
    },
    header: {
        height: (height * 150) / 2000,
        width: width,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    mapContainer: {
        height: (height * 900) / 2000,
        width: width,
        marginBottom: (height * 10) / 2000,
    },
    map: {
        height: (height * 900) / 2000,
        width: width,
    },
    restaurantContainer: {
        height: (height * 710) / 2000,
        width: width,
    },
    locationInfoContainer: {
        height: (height * 106) / 2000,
        paddingLeft: (width * 30) / 1000,
        paddingRight: (width * 30) / 1000,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    locationInfoButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    restaurantListContainer: {
        height: "100%",
    },
    restaurantList: {
        height: (height * 150) / 2000,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: (width * 15) / 1000,
        paddingHorizontal: (width * 30) / 1000,
        borderColor: colorPack.representative,
        borderWidth: 3,
        borderRadius: (width * 50) / 1000,
    },
    restaurantName: {
        width: (width * 450) / 1000,
        textAlign: "left",
    },
    restaurantFee: {
        width: (width * 300) / 1000,
        textAlign: "left",
    },
    restaurantMembers: {},

    // modal
    restaurantInfoModal: {
        flex: 1,
        paddingVertical: Constants.statusBarHeight,
        backgroundColor: colorPack.representative,
    },
    restaurantInfoContainerModal: {
        backgroundColor: colorPack.representative,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingBottom: (height * 100) / 2000,
    },

    restaurantPageContainerModal: {
        backgroundColor: colorPack.representative,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingBottom: 0,
    },

    buttonContainerModal: {
        height: (height * 60) / 2000,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        marginVertical: (width * 30) / 1000,
    },

    modalButton: {
        width: (width * 400) / 1000,
        height: (height * 100) / 2000,
        backgroundColor: colorPack.highlight_light,
        borderRadius: (height * 50) / 2000,
        justifyContent: "center",
        marginHorizontal: (width * 20) / 1000,
        alignItems: "center",
    },

    getRestaurantInfoModal: {
        height: (height * 250) / 2000,
        width: width,
        alignItems: "center",
    },

    // restaurantPage

    restaurantButtonContainer: {
        flexDirection: "row",
        height: "100%",
    },
    restaurantButton_1: {
        width: width * 0.23,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colorPack.highlight_dark,

        height: (height * 150) / 2000,
        borderRadius: (height * 50) / 2000,
        borderColor: colorPack.representative,
        borderWidth: 3,
        marginBottom: (height * 20) / 2000,
    },
    restaurantButton_2: {
        width: width * 0.23,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colorPack.highlight_light,

        height: (height * 150) / 2000,
        borderRadius: (height * 50) / 2000,
        borderColor: colorPack.representative,
        borderWidth: 3,
        marginBottom: (height * 20) / 2000,
    },
    restaurantButtonIconContainer: {
        alignItems: "center",
    },
    restaurantButtonIcon: {},

    // sign in page
    goToSignUpInButton: {
        width: (width * 700) / 1000,
        height: (height * 100) / 2000,
        backgroundColor: colorPack.highlight_light,
        borderRadius: (height * 50) / 2000,
        justifyContent: "center",
        marginHorizontal: (width * 150) / 1000,
    },
    textInputBox: {
        width: (width * 700) / 1000,
        height: (height * 100) / 2000,
        borderRadius: (height * 30) / 2000,
        borderColor: colorPack.highlight_light,
        borderWidth: (width * 10) / 2000,
        marginVertical: (height * 35) / 2000,
        marginHorizontal: (width * 150) / 1000,
        textAlign: "center",
        textAlignVertical: "center",
        color: colorPack.text_light,
        paddingHorizontal: (width * 20) / 1000,
    },
    dropdownButton: {
        width: (width * 200) / 1000,
        height: (height * 100) / 2000,
        borderRadius: (height * 30) / 2000,
        borderColor: colorPack.highlight_light,
        borderWidth: (width * 10) / 2000,
        marginVertical: (height * 35) / 2000,
        marginHorizontal: (width * 150) / 1000,
        backgroundColor: colorPack.representative,
        paddingHorizontal: (width * 20) / 1000,
    },
    dropdown: {
        borderRadius: (height * 15) / 2000,
        borderColor: colorPack.highlight_light,
        borderWidth: (width * 5) / 2000,
        backgroundColor: colorPack.representative,
    },

    textInputBox_restaurant_menu: {
        width: (width * 600) / 1000,
        borderRadius: (height * 30) / 2000,
        borderColor: colorPack.highlight_light,
        borderWidth: (width * 10) / 2000,
        marginVertical: (height * 35) / 2000,
        marginHorizontal: (width * 50) / 1000,
        textAlign: "center",
        textAlignVertical: "center",
        padding: (width * 20) / 1000,
    },
    textInputBox_restaurant_price: {
        width: (width * 250) / 1000,
        height: (height * 100) / 2000,
        borderRadius: (height * 30) / 2000,
        borderColor: colorPack.highlight_light,
        borderWidth: (width * 10) / 2000,
        marginVertical: (height * 35) / 2000,
        marginHorizontal: (width * 50) / 1000,
        textAlign: "center",
        textAlignVertical: "center",
        padding: (width * 20) / 1000,
    },
    autoLoginCheckBox: {
        margin: (width * 50) / 1000,
    },
    //광고
    adsContainer: {
        height: (height * 130) / 2000,
        width: width,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colorPack.highlight_dark,
    },
});
