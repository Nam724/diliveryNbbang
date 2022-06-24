import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, AsyncStorage } from 'react-native';
import { styles, width, height } from '../style/style';



async function signIn(_setEmail, _setIsLogin, email, password, navigation) {
    try {
        const user = await Auth.signIn(email, password);
        console.log('user', user);
        _setEmail(email);
        _setIsLogin(true);
        saveLoginInfo(email, password);
        navigation.navigate('Main');
    } catch (error) {
        console.log('error signing in', error);
        if(error === 'UserNotConfirmedException'){
            alert('User not confirmed');
            return(false);
        }
        else if(error === 'UserNotFoundException'){
            alert('User not found');
            return(false);
        }
        else if(error === 'NotAuthorizedException'){
            alert('Wrong password');
            return(false);
        }
        else if (error === 'NetworkError'){
            alert('Network error');
            return(false);
        }
        else if (error === 'InvalidParameterException'){
            alert('Invalid parameter');
            return(false);
        }
    }
}

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
    await AsyncStorage.setItem('@loginInfoToken', JSON.stringify({email: email, password: password}));
}



async function getStoredUserInfo(){
    await AsyncStorage.getItem('@loginInfoToken').then(_value => {
        const value = JSON.parse(_value);
        return value ? value : null;
    }
    ).catch(err => {
        console.log(err);
        return null
    });
}


export default function SignIn_page({route, navigation}){
    // console.log('route', route);
    const _setEmail = route.params.setEmail;
    const _setIsLogin = route.params.setIsLogin;
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [password, setPassword] = useState('');
    // loginFirst(_setEmail, _setIsLogin, navigation);

    useEffect(() => {
        const value = getStoredUserInfo();
        if(value.email && value.password){
            console.log('value값이 있어서 바로 로그인합니다.', value);
            setEmail(value.email);
            setPassword(value.password);
            signIn(_setEmail, _setIsLogin, email, password, navigation)
        }
        else{
            console.log('value값이 없어서 로그인을 진행합니다.');
        }
    }, []);


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
                onPressOut={() => signIn(_setEmail, _setIsLogin, email, password, navigation)}
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