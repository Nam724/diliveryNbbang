import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { styles, width, height } from '../style/style';


async function signIn(email, password, navigation) {
    try {
        const user = await Auth.signIn(email, password);
        console.log('user', user);
        navigation.navigate('Main');
    } catch (error) {
        console.log('error signing in', error);
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

export default function SignIn_page({navigation}){
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [password, setPassword] = useState('');
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titleText}>
                    {'My Application Login'}
                </Text>            
            </View>
            <View style={{marginTop:height*249/2000, height:height*179/2000}}>
                <Text style={styles.titleText}>
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
                <Text style={styles.titleText}>
                Password
                </Text>
                <TextInput 
                    autoComplete='password'
                    keyboardType='default'
                    style={[styles.textInputBox, styles.normalText]}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
                
            <TouchableOpacity
                onPressOut={() => signIn(email, password, navigation)}
                style={[styles.goToSignUpInButton, {marginTop:height*100/2000}]}
            >
                <Text style={styles.titleText}>
                Sign In
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPressOut={() => navigation.navigate('SignUp')}
                style={[styles.goToSignUpInButton,{marginTop:height*231/2000}]}
            >
                <Text style={styles.titleText}>
                Sign Up
                </Text>
            </TouchableOpacity>
        </View>
    )
}