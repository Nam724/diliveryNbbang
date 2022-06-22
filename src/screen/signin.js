import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { styles } from '../style/style';


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
        <View style={[styles.container,{
            paddingTop:100,
        }]}>
            <View style={styles.header}>
            <View>
                <Text style={styles.titleText}>
                Email
                </Text>
                <TextInput 
                    autoComplete='email'
                    keyboardType='email-address'
                    style={{
                        borderColor:'red',
                        borderWidth:isEmailValid?0:1,
                        height:40,
                    }}
                    onChangeText={(email) => {
                        setEmail(email);
                        setIsEmailValid(emailTest(email))
                    }}
                />
            </View>
            <View>
               <Text style={styles.titleText}>
                Password
                </Text>
                <TextInput 
                    autoComplete='password'
                    keyboardType='default'
                    style={{
                        borderColor:'red',
                        borderWidth: 1,
                        height:40,
                    }}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
                
            <TouchableOpacity
                onPressOut={() => signIn(email, password, navigation)}
            >
                <Text style={styles.titleText}>
                Sign In
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPressOut={() => {console.log(navigation)}}
            >
                <Text style={styles.titleText}>
                Sign Up
                </Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}