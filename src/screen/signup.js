import { Auth } from "@aws-amplify/auth";

import { useEffect, useState } from "react";
import {
    TextInput,
    TouchableOpacity,
    View,
    Text,
    Alert,
    ScrollView,
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import {
    styles,
    height,
    width,
    colorPack,
    iconSize,
} from "../style/style";
import { BankList } from "../setting/banks";

function emailTest(setEmail, email) {
    const reg =
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === true) {
        setEmail(email);
        return true;
    } else {
        return false;
    }
}

export default function SignUp_page({ navigation }) {
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password1, setPassword1] = useState("");
    const [password, setPassword] = useState("");
    const [account, setAccount] = useState("");
    const [verification_code, setVerification_code] =
        useState("");
    const [
        verification_code_sended,
        setVerification_code_sended,
    ] = useState(false);

    const [
        sendVerificationCodeBtn,
        setSendVerificationCodeBtn,
    ] = useState(false);

    useEffect(() => {
        // console.log('email', email);
        // console.log('password', password);
        // console.log('verification_code_sended', verification_code_sended);
        if (
            !verification_code_sended &&
            password &&
            email
        ) {
            // console.log('버튼을 누를 수 있습니다.');
            setSendVerificationCodeBtn(true);
        } else {
            setSendVerificationCodeBtn(false);
        }
    }, [verification_code_sended, password, email]);

    const sendVerificationCode = async () => {
        if (email && password && phoneNumber) {
            try {
                const _address = `${bank} ${account}`;

                const { user } = await Auth.signUp({
                    username: email.replace(" ", ""),
                    password: password.replace(" ", ""),
                    attributes: {
                        email: email.replace(" ", ""), // optional
                        phone_number:
                            "+82" +
                            phoneNumber.substring(1), // optional - E.164 number convention
                        // other custom attributes
                        address: account ? _address : null,
                    },
                });
                // console.log(user);
                setVerification_code_sended(true);
            } catch (error) {
                console.log("error signing up:", error);
                if (
                    error.code === "UsernameExistsException"
                ) {
                    Alert.alert(
                        "배달앤빵",
                        "이미 존재하는 이메일입니다.",
                        [{ text: "확인" }]
                    );
                    return false;
                } else if (
                    error.code ===
                    "InvalidParameterException"
                ) {
                    Alert.alert(
                        "배달앤빵",
                        "잘못된 이메일입니다.",
                        [{ text: "확인" }]
                    );
                    return false;
                } else if (error.code === "NetworkError") {
                    Alert.alert(
                        "배달앤빵",
                        "네트워크 오류입니다.",
                        [{ text: "확인" }]
                    );
                    return false;
                }
            }
        } else {
            Alert.alert(
                "배달앤빵",
                "정보를 전부 입력해주세요.",
                [{ text: "확인" }]
            );
        }
    };

    const confirmSignUp = async () => {
        try {
            await Auth.confirmSignUp(
                email,
                verification_code
            );
            Alert.alert(
                "배달앤빵",
                "회원가입이 완료되었습니다.",
                [{ text: "확인" }]
            );
            navigation.navigate("SignIn");
            return true;
        } catch (error) {
            // console.log('error confirming sign up', error);
            if (error == "NetworkError") {
                Alert.alert(
                    "배달앤빵",
                    "네트워크 오류입니다.",
                    [{ text: "확인" }]
                );
                return false;
            } else if (
                error ==
                "CodeMismatchException: Invalid verification code provided, please try again."
            ) {
                Alert.alert(
                    "배달앤빵",
                    "코드가 일치하지 않습니다.",
                    [{ text: "확인" }]
                );
                return false;
            } else {
                Alert.alert(
                    "배달앤빵",
                    `오류가 발생했습니다.\n${error}`,
                    [{ text: "확인" }]
                );
                return false;
            }
        }
    };

    const [bank, setBank] = useState("");

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {"회원가입"}
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior="padding"
                style={{
                    marginBottom: (height * 150) / 2000,
                    justifyContent: "center",
                }}
            >
                <SafeAreaView>
                    <ScrollView>
                        <View>
                            <View
                                style={{
                                    marginTop:
                                        (height * 50) /
                                        2000,
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={
                                        styles.highlightText
                                    }
                                >
                                    {"아이디(이메일)"}
                                </Text>
                                <TextInput
                                    keyboardType="email-address"
                                    style={[
                                        styles.textInputBox,
                                        styles.normalText,
                                    ]}
                                    onChangeText={(
                                        email
                                    ) => {
                                        setIsEmailValid(
                                            emailTest(
                                                setEmail,
                                                email
                                            )
                                        );
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    marginTop:
                                        (height * 50) /
                                        2000,
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={
                                        styles.highlightText
                                    }
                                >
                                    {"전화번호"}
                                </Text>
                                <TextInput
                                    keyboardType="phone-pad"
                                    style={[
                                        styles.textInputBox,
                                        styles.normalText,
                                    ]}
                                    onChangeText={(num) => {
                                        setPhoneNumber(num);
                                    }}
                                    placeholderTextColor={
                                        colorPack.deactivated
                                    }
                                    placeholder={
                                        "01012345678"
                                    }
                                    maxLength={11}
                                />
                            </View>
                            <View
                                style={{
                                    marginTop:
                                        (height * 50) /
                                        2000,
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={
                                        styles.highlightText
                                    }
                                >
                                    비밀번호
                                </Text>
                                <TextInput
                                    secureTextEntry={true}
                                    keyboardType="default"
                                    style={[
                                        styles.textInputBox,
                                        styles.normalText,
                                    ]}
                                    maxLength={20}
                                    onChangeText={(pw) => {
                                        const reg =
                                            /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/;
                                        if (reg.test(pw)) {
                                            setPassword1(
                                                pw
                                            );
                                        } else {
                                            setPassword1(
                                                ""
                                            );
                                        }
                                    }}
                                    placeholderTextColor={
                                        colorPack.deactivated
                                    }
                                    placeholder={
                                        "영문 숫자 포함 6~20자리"
                                    }
                                />
                            </View>
                            {password1 ? (
                                <View
                                    style={{
                                        marginTop:
                                            (height * 50) /
                                            2000,
                                        flex: 1,
                                    }}
                                >
                                    <Text
                                        style={
                                            styles.highlightText
                                        }
                                    >
                                        {"비밀번호 확인"}
                                    </Text>
                                    <TextInput
                                        secureTextEntry={
                                            true
                                        }
                                        keyboardType="default"
                                        style={[
                                            styles.textInputBox,
                                            styles.normalText,
                                            {
                                                borderColor:
                                                    password ===
                                                    password1
                                                        ? colorPack.highlight_light
                                                        : colorPack.warning,
                                            },
                                        ]}
                                        maxLength={20}
                                        onChangeText={(
                                            pw
                                        ) => {
                                            if (
                                                pw ===
                                                password1
                                            ) {
                                                setPassword(
                                                    pw
                                                );
                                            } else {
                                                setPassword(
                                                    ""
                                                );
                                            }
                                        }}
                                        editable={
                                            password1
                                                ? true
                                                : false
                                        }
                                        placeholderTextColor={
                                            colorPack.deactivated
                                        }
                                        placeholder={
                                            "비밀번호를 다시 입력해주세요"
                                        }
                                    />
                                </View>
                            ) : (
                                <View />
                            )}
                            <View
                                style={{
                                    marginTop:
                                        (height * 50) /
                                        2000,
                                    flex: 1,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        Alert.alert(
                                            "배달앤빵",
                                            "카카오톡 프로필 상단 우측의 QR코드 버튼을 누른 뒤 QR코드 밑에 있는 링크 아이콘을 클릭하세요."
                                        );
                                    }}
                                >
                                    <Text
                                        style={
                                            styles.highlightText
                                        }
                                    >
                                        {
                                            "입금받을 계좌번호(선택)"
                                        }
                                    </Text>
                                    <Text
                                        style={
                                            styles.normalText_small
                                        }
                                    >
                                        {
                                            "배달앤빵에서는 호스트가 게스트에게 송금을 받고 직접 주문을 하게 됩니다.\n이때 호스트로서 입금받을 계좌를 입력해주세요."
                                        }
                                    </Text>
                                </TouchableOpacity>
                                <View
                                    style={{
                                        flexDirection:
                                            "row",
                                        width: width * 0.8,
                                        marginHorizontal:
                                            width * 0.1,
                                        justifyContent:
                                            "space-around",
                                    }}
                                >
                                    <SelectDropdown
                                        data={BankList}
                                        onSelect={(
                                            selectedItem,
                                            index
                                        ) => {
                                            setBank(
                                                selectedItem
                                            );
                                        }}
                                        defaultButtonText={
                                            "은행선택"
                                        }
                                        buttonStyle={
                                            styles.dropdownButton
                                        }
                                        buttonTextStyle={
                                            styles.normalText_small
                                        }
                                        dropdownStyle={
                                            styles.dropdown
                                        }
                                        rowTextStyle={
                                            styles.deactivatedText
                                        }
                                        buttonTextAfterSelection={(
                                            selectedItem,
                                            index
                                        ) => {
                                            // text represented after item is selected
                                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                                            return selectedItem;
                                        }}
                                        rowTextForSelection={(
                                            item,
                                            index
                                        ) => {
                                            // text represented for each item in dropdown
                                            // if data array is an array of objects then return item.property to represent item in dropdown
                                            return item;
                                        }}
                                    />
                                    <TextInput
                                        keyboardType="number-pad"
                                        style={[
                                            styles.textInputBox,
                                            styles.normalText,
                                            {
                                                width:
                                                    width *
                                                    0.5,
                                            },
                                        ]}
                                        onChangeText={(
                                            text
                                        ) => {
                                            setAccount(
                                                text
                                            );
                                        }}
                                        numberOfLines={1}
                                        editable={true}
                                        placeholderTextColor={
                                            colorPack.deactivated
                                        }
                                        placeholder={
                                            "계좌번호를 입력해주세요"
                                        }
                                    />
                                </View>
                            </View>

                            {password === password1 &&
                            password1 !== "" ? (
                                <View>
                                    <TouchableOpacity
                                        onPressOut={() =>
                                            sendVerificationCode()
                                        }
                                        disabled={
                                            !sendVerificationCodeBtn
                                        }
                                        style={[
                                            styles.goToSignUpInButton,
                                            {
                                                marginTop:
                                                    (height *
                                                        50) /
                                                    2000,
                                                flex: 1,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={
                                                sendVerificationCodeBtn
                                                    ? styles.highlightText
                                                    : styles.deactivatedText
                                            }
                                        >
                                            {!verification_code_sended
                                                ? "인증코드 보내기(이메일)"
                                                : "인증코드가 이메일로 전송됐습니다."}
                                        </Text>
                                    </TouchableOpacity>
                                    <TextInput
                                        autoComplete="off"
                                        keyboardType="number-pad"
                                        style={[
                                            styles.textInputBox,
                                            styles.normalText,
                                        ]}
                                        placeholderTextColor={
                                            colorPack.deactivated
                                        }
                                        placeholder={
                                            "인증코드를 6자리를 입력해주세요"
                                        }
                                        maxLength={6}
                                        onChangeText={(
                                            verification_code
                                        ) => {
                                            setVerification_code(
                                                verification_code
                                            );
                                            if (
                                                verification_code.length ===
                                                6
                                            ) {
                                                Keyboard.dismiss();
                                            }
                                        }}
                                        editable={
                                            verification_code_sended
                                        }
                                    />
                                </View>
                            ) : (
                                <View></View>
                            )}
                            <View
                                style={{
                                    marginTop:
                                        (height * 50) /
                                        2000,
                                    flex: 1,
                                }}
                            >
                                <TouchableOpacity
                                    onPressOut={() =>
                                        confirmSignUp()
                                    }
                                    disabled={
                                        !verification_code
                                    }
                                    style={[
                                        styles.goToSignUpInButton,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.highlightText
                                        }
                                    >
                                        {"회원가입"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </View>
    );
}
