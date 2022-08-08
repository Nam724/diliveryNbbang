import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    SafeAreaView,
} from "react-native";
import { Chat } from "../models";
import {
    styles,
    colorPack,
    iconSize,
    height,
    width,
} from "../style/style";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export default function Chat_page({ navigation, route }) {
    // const restaurant = route.params.restaurant;
    useEffect(() => {
        // realTime_Chat();
    }, []);

    // const realTime_Chat = DataStore.observeQuery(
    //     Chat,
    //     (q) => {
    //         q.restaurantID("eq", restaurant.id);
    //     }
    // ).subscribe(({ items, isSynced }) => {
    //     console.log(
    //         `[Snapshot] item count: ${items.length}, isSynced: ${isSynced}`
    //     );
    // });

    const [messages, setMessages] = useState([
        Message({
            text: "123123asdfgasdgqkjhewf ;asdfh ;aowifh;oaisdhflakiuhfqwiuehrf;asdoigfhao;sdigh",
            creator: "데모",
            id: "1",
        }),
        Message({
            text: "123123",
            creator: "데모",
            id: "2",
        }),
        Message({
            text: "123123",
            creator: "데모",
            id: "3",
        }),
        MyMessage({
            text: "123123",
            creator: "데모",
            id: "4",
        }),
        Message({
            text: "123123",
            creator: "데모",
            id: "5",
        }),
        Message({
            text: "123123",
            creator: "데모",
            id: "3",
        }),
        MyMessage({
            text: "123123",
            creator: "데모",
            id: "4",
        }),
        Message({
            text: "123123",
            creator: "데모",
            id: "5",
        }),
        Message({
            text: "123123",
            creator: "데모",
            id: "3",
        }),
        MyMessage({
            text: "123123",
            creator: "데모",
            id: "4",
        }),
        Message({
            text: "123123",
            creator: "데모",
            id: "5",
        }),
        Message({
            text: "123123",
            creator: "데모",
            id: "3",
        }),
        MyMessage({
            text: "123123",
            creator: "데모",
            id: "4",
        }),
        Message({
            text: "123123",
            creator: "데모",
            id: "5",
        }),
    ]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text
                    style={styles.highlightText}
                >{`음식점 주문자들의 채팅방입니다.`}</Text>
            </View>
            <ScrollView>
                <View style={styles.chatContainer}>
                    {messages}
                </View>
            </ScrollView>
            <KeyboardAvoidingView
                behavior="padding"
                style={{
                    justifyContent: "center",
                    marginBottom: height * 0.05,
                }}
            >
                <View style={styles.chatInputContainer}>
                    <TextInput
                        style={styles.chatInput}
                        placeholder="메세지를 입력하세요"
                        placeholderTextColor={
                            colorPack.deactivated
                        }
                    />

                    <TouchableOpacity
                        style={styles.chatSendButton}
                    >
                        <MaterialCommunityIcons
                            name="send"
                            size={iconSize * 1.5}
                            color={colorPack.text_dark}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

function Message({ text, creator, id }) {
    return (
        <View style={styles.messageContainer} key={id}>
            <View style={styles.creator}>
                <Text style={styles.deactivatedText}>
                    {creator}
                </Text>
            </View>

            <View style={styles.message}>
                <Text
                    style={[
                        styles.normalText,
                        {
                            textAlignVertical: "center",
                            textAlign: "left",
                        },
                    ]}
                >
                    {text}
                </Text>
            </View>
        </View>
    );
}

function MyMessage({ text, creator, id }) {
    return (
        <View style={styles.myMessageContainer} key={id}>
            <View style={styles.creator}>
                <Text style={styles.deactivatedText}>
                    {creator}
                </Text>
            </View>

            <View style={styles.message}>
                <Text
                    style={[
                        styles.normalText,
                        {
                            textAlignVertical: "center",
                            textAlign: "right",
                        },
                    ]}
                >
                    {text}
                </Text>
            </View>
        </View>
    );
}
