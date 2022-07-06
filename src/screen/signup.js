import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
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
    const [password, setPassword] = useState('');
    const [verification_code, setVerification_code] = useState('');
    const [verification_code_sended, setVerification_code_sended] = useState(false);

    const [sendVerificationCodeBtn, setSendVerificationCodeBtn] = useState(false);

    useEffect(() => {
        console.log('email', email);
        console.log('password', password);
        console.log('verification_code_sended', verification_code_sended);
        if(!verification_code_sended && (password && email)){
            console.log('버튼을 누를 수 있습니다.');
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
                }
            });
            console.log(user);
            setVerification_code_sended(true);
        } catch (error) {
            console.log('error signing up:', error);
            if(error.code === 'UsernameExistsException'){
                alert('User already exists');
                return(false);
            }
            else if(error.code === 'InvalidParameterException'){
                alert('Invalid parameter');
                return(false);
            }
            else if (error.code === 'NetworkError'){
                alert('Network error');
                return(false);
            }
        }
    }

    const confirmSignUp = async() => {
        try {
          await Auth.confirmSignUp(email, verification_code);
          alert('회원가입이 완료되었습니다.');
          navigation.navigate('SignIn');
          return(true);
        } catch (error) {
            console.log('error confirming sign up', error);
            if (error === 'NetworkError'){
                alert('Network error');
                return(false);
            }
            else if (error === 'CodeMismatchException'){
                alert('잘못된 코드입니다.');
                return(false);
            }
        }
    }
    



    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {'My Application 회원가입'}
                </Text>            
            </View>
            <View style={{marginTop:height*50/2000, height:height*179/2000}}>
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
            <View style={{marginTop:height*50/2000, height:height*179/2000}}>
                <Text style={styles.highlightText}>
                전화번호
                </Text>
                <TextInput 
                    keyboardType='numeric'
                    style={[styles.textInputBox, styles.normalText]}
                    onChangeText={(num) => {
                        setPhoneNumber(num)
                    }}
                    placeholderTextColor={colorPack.deactivated}
                    placeholder={'01012345678'}
                />
            </View>
            <View style={{marginTop: height*50/2000,height:height*179/2000}}>
                <Text style={styles.highlightText}>
                비밀번호
                </Text>
                <TextInput 
                    secureTextEntry={true}
                    keyboardType='default'
                    style={[styles.textInputBox, styles.normalText]}
                    maxLength={20}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
                
            <View>
               
                <TouchableOpacity
                onPressOut={() => sendVerificationCode()}
                disabled={!sendVerificationCodeBtn}
                style={[styles.goToSignUpInButton, {marginTop:height*100/2000}]}
                >
                <Text style={sendVerificationCodeBtn?styles.highlightText:styles.deactivatedText}>
                {!verification_code_sended?'인증코드 보내기(문자)':'인증코드를 입력하세요'}
                </Text>
                </TouchableOpacity>
            </View>
            <View>
                <TextInput 
                    autoComplete='password'
                    keyboardType='number-pad'
                    style={[styles.textInputBox, styles.normalText]}
                    maxLength={6}
                    onChangeText={(verification_code) => {setVerification_code(verification_code)
                    if (verification_code.length === 6){
                        confirmSignUp();
                        }
                    }
                }   
                />
            </View>
                
            <TouchableOpacity
                onPressOut={() => confirmSignUp()
                }
                disabled={!verification_code}
                style={[styles.goToSignUpInButton, {marginTop:height*100/2000}]}
            >
                <Text style={styles.highlightText}>
                {'회원가입'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}