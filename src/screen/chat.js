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
import { ChatBannerAds } from "../../utils/Ads";
export default function Chat_page({ navigation, route }) {
    const restaurant = route.params.restaurant;
    const user = route.params.user;
    console.log("user", user);
    console.log("restaurant", restaurant);
    let observeChat = null;
    useEffect(() => {
        observeChat = DataStore.observeQuery(Chat, (c) =>
            c.restaurantID("eq", restaurant.id)
        ).subscribe((snapshot) => {
            const { items, isSync } = snapshot;
            console.log("items", items);
            let prevChat = [];
            items.forEach((item) => {
                const newChat = Message({
                    chat: item,
                    user: user,
                });
                prevChat.push(newChat);
            });
            setMessages(prevChat);
            console.log("messages", messages);
        });
        return () => {
            observeChat.unsubscribe();
        };
    }, []);

    const [inputMessage, setInputMessage] = useState("");

    const sendMessage = async () => {
        await DataStore.save(
            new Chat({
                message: inputMessage,
                creatorID: user.email,
                creatorUsername: user.username,
                restaurantID: restaurant.id,
            })
        );
        setInputMessage("");
    };
    const restaurantID = restaurant.id;
    const getMessages = async () => {
        const _messages = await DataStore.query(
            Chat,
            (c) => {
                c.restaurantID("eq", restaurantID);
            }
        );
        console.log("_messages", _messages);
        let newMessages = [];
        _messages.forEach((m) => {
            newMessages.push(Message(m, user));
        });
        setMessages(newMessages);
        console.log("newMessages", newMessages);
    };

    const [messages, setMessages] = useState([]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text
                    style={styles.highlightText}
                >{`${restaurant.name} 주문자들의 채팅방입니다.`}</Text>
            </View>
            <ChatBannerAds />
            <ScrollView
                ref={(ref) => {
                    this.scrollView = ref;
                }}
                onContentSizeChange={() => {
                    this.scrollView.scrollToEnd({
                        animated: true,
                    });
                }}
            >
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
                        onChangeText={(text) =>
                            setInputMessage(text)
                        }
                        value={inputMessage}
                    />

                    <TouchableOpacity
                        style={styles.chatSendButton}
                        onPress={sendMessage}
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

function Message({ chat, user }) {
    // console.log("chat", chat);
    const creator = chat.creatorUsername;
    const creatorEmail = chat.creatorID.split("@")[0];
    const text = chat.message;
    const id = chat.id;
    return creator === user.username ? (
        <View style={styles.myMessageContainer} key={id}>
            <View style={styles.creator}>
                <Text style={styles.deactivatedText}></Text>
            </View>

            <View style={styles.myMessage}>
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
    ) : (
        <View style={styles.messageContainer} key={id}>
            <View style={styles.creator}>
                <Text style={styles.deactivatedText}>
                    {creatorEmail}
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
