import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, Alert, ScrollView, Keyboard, Linking, KeyboardAvoidingView } from 'react-native';
import { styles, height, width, colorPack } from '../style/style';

// async function sendVerificationCode(email, password, setVerification_code_sended) {
    
//     try {
//         const { user } = await Auth.signUp({
//             username: email,
//             password: password,
//             attributes: {
//                 email:email,          // optional
//                 phone_number:'',   // optional - E.164 number convention
//                 // other custom attributes 
//             }
//         });
//         console.log(user);
//         setVerification_code_sended(true);
//     } catch (error) {
//         console.log('error signing up:', error);
//         if(error.code === 'UsernameExistsException'){
//             alert('User already exists');
//             return(false);
//         }
//         else if(error.code === 'InvalidParameterException'){
//             alert('Invalid parameter');
//             return(false);
//         }
//         else if (error.code === 'NetworkError'){
//             alert('Network error');
//             return(false);
//         }
//     }
// }

function emailTest(setEmail, email){
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === true){
        setEmail(email);
        return(true)
    }
    else{
        return(false)
    }
}


export default function SignUp_page({navigation}){
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [phoneNumber , setPhoneNumber] = useState('');
    const [password1, setPassword1] = useState('');
    const [password, setPassword] = useState('');
    const [account, setAccount] = useState('');
    const [verification_code, setVerification_code] = useState('');
    const [verification_code_sended, setVerification_code_sended] = useState(false);

    const [sendVerificationCodeBtn, setSendVerificationCodeBtn] = useState(false);

    useEffect(() => {
        // console.log('email', email);
        // console.log('password', password);
        // console.log('verification_code_sended', verification_code_sended);
        if(!verification_code_sended && (password && email)){
            // console.log('버튼을 누를 수 있습니다.');
            setSendVerificationCodeBtn(true);
        }
        else{
            setSendVerificationCodeBtn(false);
        }
    },[verification_code_sended, password, email]);


    const sendVerificationCode= async() =>{
    
        try {
            const { user } = await Auth.signUp({
                username: email,
                password: password,
                attributes: {
                    email:email,          // optional
                    phone_number:'+82'+phoneNumber.substring(1),   // optional - E.164 number convention
                    // other custom attributes 
                    address:account,
                }
            });
            // console.log(user);
            setVerification_code_sended(true);
        } catch (error) {
            // console.log('error signing up:', error);
            if(error.code === 'UsernameExistsException'){
                Alert.alert('배달앤빵','이미 존재하는 이메일입니다.',[{text:'확인'}]);
                return(false);
            }
            else if(error.code === 'InvalidParameterException'){
                Alert.alert('배달앤빵','잘못된 이메일입니다.',[{text:'확인'}]);
                return(false);
            }
            else if (error.code === 'NetworkError'){
                Alert.alert('배달앤빵','네트워크 오류입니다.',[{text:'확인'}]);
                return(false);
            }
        }
    }

    const confirmSignUp = async() => {
        try {
          await Auth.confirmSignUp(email, verification_code);
          Alert.alert('배달앤빵','회원가입이 완료되었습니다.',[{text:'확인'}]);
          navigation.navigate('SignIn');
          return(true);
        } catch (error) {
            // console.log('error confirming sign up', error);
            if (error === 'NetworkError'){
                Alert.alert('배달앤빵','네트워크 오류입니다.',[{text:'확인'}]);
                return(false);
            }
            else if (error === 'CodeMismatchException'){
                Alert.alert('배달앤빵','코드가 일치하지 않습니다.',[{text:'확인'}]);
                return(false);
            }
        }
    }
    



    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {'배달앤빵 회원가입'}
                </Text>            
            </View>

            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={height*50/2000}
            style={{flex:1}}
            >
            <ScrollView>
            <View>

            
            <View style={{marginTop:height*50/2000, height:height*180/2000}}>
                <Text style={styles.highlightText}>
                {'아이디(이메일)'}
                </Text>
                <TextInput 
                    keyboardType='email-address'
                    style={[styles.textInputBox, styles.normalText]}
                    onChangeText={(email) => {
                        setIsEmailValid(emailTest(setEmail, email))
                    }}
                />
            </View>
            <View style={{marginTop:height*50/2000, height:height*180/2000}}>
                <Text style={styles.highlightText}>
                {'전화번호'}
                </Text>
                <TextInput 
                    keyboardType='phone-pad'
                    style={[styles.textInputBox, styles.normalText]}
                    onChangeText={(num) => {
                        setPhoneNumber(num)
                    }}
                    placeholderTextColor={colorPack.deactivated}
                    placeholder={'01012345678'}
                />
            </View>

            <View style={{marginTop: height*50/2000,height:height*180/2000}}>
                <Text style={styles.highlightText}>
                비밀번호
                </Text>
                <TextInput 
                    secureTextEntry={true}
                    keyboardType='default'
                    style={[styles.textInputBox, styles.normalText]}
                    maxLength={20}
                    onChangeText={(pw) => {
                            const reg = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/;
                            if(reg.test(pw)){
                                setPassword1(pw)
                            }
                            else{
                                setPassword1('')
                            }
                        }
                    }
                />
            </View>

            <View style={{marginTop: height*50/2000,height:(password1)?height*180/2000:0}}>
                <Text style={(password===password1)?styles.highlightText:styles.deactivatedText}>
                {(password===password1)?'비밀번호 일치':'비밀번호 불일치'}
                </Text>
                <TextInput 
                    secureTextEntry={true}
                    keyboardType='default'
                    style={(password1)?[styles.textInputBox, styles.normalText]:{height:0}}
                    maxLength={20}
                    onChangeText={(pw) => {
                        if(pw === password1){
                            setPassword(pw)
                        }
                        else{
                            setPassword('')
                        }
                    }}
                    editable={(password1)?true:false}
                />
            </View>

            <View style={{marginTop:height*50/2000, height:height*260/2000}}>
            <TouchableOpacity
                    onPress={()=>{
                        Alert.alert('배달앤빵','카카오톡 프로필 상단 우측의 QR코드 버튼을 누른 뒤 QR코드 밑에 있는 링크 아이콘을 클릭하세요.');
                    }}
            >
                <Text style={styles.highlightText}>
                {!account?'계좌번호 또는 카카오페이 송금코드\n클릭해서 카카오페이 송금코드 확인':'계좌번호'}
                </Text>           
            </TouchableOpacity>

            <TextInput
                keyboardType='default'
                style={[styles.textInputBox, styles.normalText]}
                onChangeText={(account) => {
                    setAccount(account)
                }}
                numberOfLines={(account)?1:2}
                editable={true}
                placeholderTextColor={colorPack.deactivated}
                placeholder={'카카오뱅크 3333047718018\n또는 카카오페이 송금코드'}
            />
            </View>

            
                
            <View>
               
                <TouchableOpacity
                onPressOut={() => sendVerificationCode()}
                disabled={!sendVerificationCodeBtn}
                style={[styles.goToSignUpInButton, {marginTop:height*100/2000}]}
                >
                <Text style={sendVerificationCodeBtn?styles.highlightText:styles.deactivatedText}>
                {!verification_code_sended?'인증코드 보내기(이메일)':'인증코드를 입력하세요'}
                </Text>
                </TouchableOpacity>
                <TextInput
                    autoComplete='off'
                    keyboardType='number-pad'
                    style={[styles.textInputBox, styles.normalText]}
                    maxLength={6}
                    onChangeText={(verification_code) => {setVerification_code(verification_code)
                            if (verification_code.length === 6){
                                Keyboard.dismiss();
                            }
                        }
                    }
                    editable={verification_code_sended}
                />
            </View>
            <TouchableOpacity
            onPressOut={() => confirmSignUp()
            }
            disabled={!verification_code}
            style={[styles.goToSignUpInButton]}
            >
            <Text style={styles.highlightText}>
            {'회원가입'}
            </Text>
            </TouchableOpacity>
            </View>
            </ScrollView>
            </KeyboardAvoidingView>

        </View>
    )
}