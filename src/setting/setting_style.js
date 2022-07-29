import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkMode1, lightMode1 } from "../style/colorpack";
import {
    map_darkStyle1,
    map_lightStyle1,
} from "../style/mapStyle";

const stylePack_dark1 = {
    colorPack: darkMode1,
    mapStyle: map_darkStyle1,
};

const stylePack_light1 = {
    colorPack: lightMode1,
    mapStyle: map_lightStyle1,
};

export async function getStyle() {
    const style_1 = await new Promise(
        async (resolve, reject) => {
            try {
                const style = await AsyncStorage.getItem(
                    "@style"
                );
                resolve(style);
            } catch (error) {
                reject(error);
                return "light1";
            }
        }
    );
    if (style_1 === "dark1") {
        return stylePack_dark1;
    } else if (style_1 === "light1") {
        return stylePack_light1;
    }
}

export async function setStyle(style) {
    await AsyncStorage.setItem("@style", style);
}
