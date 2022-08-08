import { DataStore } from "aws-amplify";
import { useEffect } from "react";
import { View } from "react-native";
import { Chat } from "../models";
import { styles } from "../style/style";

export default function Chat_page({ navigation, route }) {
    const restaurant = route.params.restaurant;
    useEffect(() => {
        realTime_Chat();
    }, []);

    const realTime_Chat = DataStore.observeQuery(
        Chat,
        (q) => {
            q.restaurantID("eq", restaurant.id);
        }
    ).subscribe(({ items, isSynced }) => {
        console.log(
            `[Snapshot] item count: ${items.length}, isSynced: ${isSynced}`
        );
    });

    return <View style={styles.container}></View>;
}
