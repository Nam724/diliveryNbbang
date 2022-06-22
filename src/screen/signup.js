import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { styles } from '../style/style';

async function signUp(email, password) {
    const username = email;
    const phone_number = '';
    try {
        const { user } = await Auth.signUp({
            username: username,
            password: password,
            attributes: {
                email:email,          // optional
                phone_number,   // optional - E.164 number convention
                // other custom attributes 
            }
        });
        console.log(user);
    } catch (error) {
        console.log('error signing up:', error);
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

export default function Signup_page(){
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
                onPressOut={() => signUp(email, password)}
            >
                <Text style={styles.titleText}>
                Sign Up
                </Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}