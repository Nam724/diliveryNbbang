import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { styles } from '../style/style';

async function signUp(email, password, setVerification_code_sended) {
    
    try {
        const { user } = await Auth.signUp({
            username: email,
            password: password,
            attributes: {
                email:email,          // optional
                phone_number:'',   // optional - E.164 number convention
                // other custom attributes 
            }
        });
        console.log(user);
        setVerification_code_sended(true);
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

async function confirmSignUp(username, code) {
    try {
      await Auth.confirmSignUp(username, code);
      return(true);
    } catch (error) {
        console.log('error confirming sign up', error);
    }
}

export default function SignUp_page(){
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [password, setPassword] = useState('');
    const [verification_code, setVerification_code] = useState('');
    const [verification_code_sended, setVerification_code_sended] = useState(false);

    return(
        <View style={[styles.container,{
            paddingTop:200,
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
                    maxLength={20}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            <View>
               
                <TouchableOpacity
                onPressOut={() => signUp(email, password, setVerification_code_sended)}
                disabled={!email}
                >
                <Text style={styles.titleText}>
                {'send verification code(email)'}
                </Text>
            </TouchableOpacity>
            </View>
            <View style>
               <Text style={styles.titleText}>
                {!verification_code_sended?'send verification code first':'verification code'}
                </Text>
                <TextInput 
                    autoComplete='password'
                    keyboardType='default'
                    style={{
                        borderColor:'red',
                        borderWidth: 1,
                        height:40,
                    }}
                    maxLength={6}
                    onChangeText={(verification_code) => setVerification_code(verification_code)}
                />
            </View>
                
            <TouchableOpacity
                onPressOut={() => confirmSignUp(email, verification_code)
                }
                disabled={!verification_code}
            >
                <Text style={styles.titleText}>
                Sign Up
                </Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}