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
import {useFonts} from 'expo-font'
import Loading_page from './src/screen/loading_page';




Amplify.configure(awsconfig);

const Stack = createStackNavigator();

export default function App(){ 
  const [IsLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [autoLogin, setAutoLogin] = useState(false);
  // let [fontLoaded] = useFonts({
  //   'happy_sans_bold': require('./assets/font/Happiness-Sans-Bold.ttf'),
  //   'happy_sans_regular': require('./assets/font/Happiness-Sans-Regular.ttf'),
  //   'happy_sans_title': require('./assets/font/Happiness-Sans-Title.ttf'),
  // });

  // const [fontLoaded, setFontLoaded] = useState(false);
  // async function loadFonts() {
  //   await Font.loadAsync({
  //     'happy_sans_bold': require('./assets/font/Happiness-Sans-Bold.ttf'),
  //     'happy_sans_regular': require('./assets/font/Happiness-Sans-Regular.ttf'),
  //     'happy_sans_title': require('./assets/font/Happiness-Sans-Title.ttf'),    
  //   });
  //   setFontLoaded(true);
  // }
  // useEffect(() => {
  //   loadFonts();
  // }
  // , []);


  // console.log('App.js user', user);
  if(false){
    return(
      <Loading_page></Loading_page>
    )
  }
  else{
    return (
      (IsLogin)?
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Main"}>
          <Stack.Screen name="Main" component={Main_page} 
          options={{
            headerShown: false,
          }}
          initialParams={{user:user, setUser:setUser, setIsLogin:setIsLogin, autoLogin:autoLogin, setAutoLogin:setAutoLogin}}
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
        initialParams={{user:user, setUser:setUser, setIsLogin:setIsLogin, autoLogin:autoLogin, setAutoLogin:setAutoLogin}}
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
}