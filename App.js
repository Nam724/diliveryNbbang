import Main_page from './src/screen/main';
import SignUp_page from './src/screen/signup';
import SignIn_page from './src/screen/signin';
import Restaurant_page from './src/screen/restaurant';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import 'react-native-gesture-handler';




Amplify.configure(awsconfig);

const Stack = createStackNavigator();

export default function App(){ 
  const [IsLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  console.log('App.js user', user);
  return (
    IsLogin?
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Main"}>
        <Stack.Screen name="Main" component={Main_page} 
        options={{
          headerShown: false,
        }}
        initialParams={{user:user}}
        />
        <Stack.Screen name="Restaurant" component={Restaurant_page} 
        options={{
          headerShown: false,
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    :
    <NavigationContainer>
    <Stack.Navigator initialRouteName={"SignIn"}>
      <Stack.Screen name="SignIn" component={SignIn_page} 
      options={{
        headerShown: false,
      }}
      initialParams={{user:user, setUser:setUser, setIsLogin:setIsLogin}}
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