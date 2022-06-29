import Main_page from './src/screen/main';
import SignUp_page from './src/screen/signup';
import SignIn_page from './src/screen/signin';
import Restaurant_page from './src/screen/restaurant';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';






Amplify.configure(awsconfig);

const Stack = createStackNavigator();

export default function App(){ 
  const [Email, setEmail] = useState('');
  const [Username, setUsername] = useState('username');
  const [IsLogin, setIsLogin] = useState(false);
  console.log('Email:', Email, 'Username:', Username, 'IsLogin:', IsLogin);
  return (
    IsLogin?
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Main"}>
        <Stack.Screen name="Main" component={Main_page} 
        options={{
          headerShown: false,
        }}
        initialParams={{Email:Email, Username:Username}}
        />
        <Stack.Screen name="Restaurant" component={Restaurant_page} 
        options={{
          headerShown: false,
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>:<NavigationContainer>
    <Stack.Navigator initialRouteName={"SignIn"}>
      <Stack.Screen name="SignIn" component={SignIn_page} 
      options={{
        headerShown: false,
      }}
      initialParams={{Email: Email, setEmail: setEmail, setUsername: setUsername, setIsLogin: setIsLogin}}
      />
      <Stack.Screen name="SignUp" component={SignUp_page}
      options={{
        headerShown: false,
      }}
      />
    </Stack.Navigator>
  </NavigationContainer>
      
  );
}