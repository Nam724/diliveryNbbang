import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, AsyncStorage } from 'react-native';
import { styles, width, height } from '../style/style';



function emailTest(email){
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === true){
        return(true)
    }
    else{
        return(false)
    }
}

async function saveLoginInfo(email='', password=''){
    const loginInfo = {
        email: email,
        password: password
    }
    await AsyncStorage.setItem('@loginInfoToken', JSON.stringify(loginInfo));
}



export default function SignIn_page({route, navigation}){
    
    // 자동로그인 토글
    const [autoLogin, setAutoLogin] = useState(true);
    
    // console.log('route', route);
    const user = route.params.user;
    const setUser = route.params.setUser;
    const setIsLogin = route.params.setIsLogin;
    
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
        //이거 주석 달면 자동로그인 안됨
        if(autoLogin){
            console.log('자동로그인 실행')
            loginFirst()
        }
        else{
            console.log('자동로그인 안실행')
        }
    }, []);

    const loginFirst = async () => {
        await AsyncStorage.getItem('@loginInfoToken').then(_value => {
            const value = JSON.parse(_value);
            console.log(value);
            if(value.email && value.password){
                console.log('value값이 있어서 바로 로그인합니다.', value);
                setEmail(value.email);
                setPassword(value.password);
                signIn(value.email, value.password);
            }
            else{
                console.log('value값이 없어서 로그인을 진행합니다.');
            }
        }
        ).catch(err => {
            console.log(err);
            const value = null
            console.log('value값이 없어서 로그인을 진행합니다.');
        });

    }


    const signIn = async(email = email, password = password) => {
        try {
            const user = await Auth.signIn(email, password);
            console.log('user', user);
            setUser(user);
            setIsLogin(true);
            saveLoginInfo(email, password);
        } catch (error) {
            console.log('error signing in', error);
            if(error === 'UserNotConfirmedException'){
                alert('User not confirmed');
                return(false);
            }
            else if(error == 'UserNotFoundException: User does not exist.'){
                alert('해당 이메일의 사용자를 찾을 수 없습니다.');
                return(false);
            }
            else if(error == 'NotAuthorizedException: Incorrect username or password.'){
                alert('잘못된 비밀번호입니다.');
                return(false);
            }
            else if (error == 'NetworkError'){
                alert('Network error');
                return(false);
            }
            else if (error == 'InvalidParameterException: Custom auth lambda trigger is not configured for the user pool.'){
                alert('Invalid parameter');
                return(false);
            }
            else if (error == 'signing in Error: Pending sign-in attempt already in progress'
            ){
                alert('이미 로그인이 진행중입니다.');
                return(false);
            }
            else{
                alert('알수 없는 에러, 다시 시도하세요.');
                return(false);
            }
        }
    }
    
    

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.highlightText}>
                    {'My Application Login'}
                </Text>            
            </View>
            <View style={{marginTop:height*249/2000, height:height*179/2000}}>
                <Text style={styles.highlightText}>
                Email
                </Text>
                <TextInput 
                    autoComplete='email'
                    keyboardType='email-address'
                    style={[styles.textInputBox, styles.normalText]}
                    onChangeText={(email) => {
                        setEmail(email);
                        setIsEmailValid(emailTest(email))
                    }}
                />
            </View>
            <View style={{marginTop: height*100/2000,height:height*179/2000}}>
                <Text style={styles.highlightText}>
                Password
                </Text>
                <TextInput 
                    secureTextEntry={true}
                    autoComplete='password'
                    keyboardType='default'
                    style={[styles.textInputBox, styles.normalText]}
                    maxLength={20}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
                
            <TouchableOpacity
                onPressOut={() => signIn(email, password)}
                style={[styles.goToSignUpInButton, {marginTop:height*100/2000}]}
                disabled={!isEmailValid&&password.length<=0}
            >
                <Text style={styles.highlightText}>
                {'로그인'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPressOut={() => navigation.navigate('SignUp')}
                style={[styles.goToSignUpInButton,{marginTop:height*231/2000}]}
            >
                <Text style={styles.highlightText}>
                {'회원가입'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}