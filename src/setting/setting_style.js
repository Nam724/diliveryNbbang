import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkMode, lightMode } from "../style/colorPack";
import {
    map_darkStyle,
    map_lightStyle,
} from "../style/mapStyle";

const stylePack_dark = {
    colorPack: darkMode,
    mapStyle: map_darkStyle,
};

const stylePack_light = {
    colorPack: lightMode,
    mapStyle: map_lightStyle,
};

export function getStyle() {
    // const style_1 = await new Promise(
    //     async (resolve, reject) => {
    //         try {
    //             const style = await AsyncStorage.getItem(
    //                 "@style"
    //             );
    //             resolve(style);
    //         } catch (error) {
    //             reject(error);
    //             return "light1";
    //         }
    //     }
    // );
    // if (style_1 === "dark1") {
    //     return stylePack_dark1;
    // } else if (style_1 === "light1") {
    //     return stylePack_light1;
    // }
    return stylePack_dark;
}

export async function setStyle(style) {
    await AsyncStorage.setItem("@style", style);
}
