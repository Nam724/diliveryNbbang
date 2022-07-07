import {View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Pressable} from 'react-native';
import {useState, useEffect} from 'react';
import  {DataStore} from '@aws-amplify/datastore';
import {Restaurant, Place} from '../models';
import { styles, colorPack } from '../style/style';
import MapView, { Marker } from 'react-native-maps';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard'
import Restaurant_page_auth from './restaurant_auth';
import Restaurant_page_guest from './restaurant_guest';
import Restaurant_page_finished from './restaurant_finished';

export default function Restaurant_page({route, navigation}){
    console.log('makerID', route.params.restaurant.makerID)
    console.log('username', route.params.user.username)
    if(route.params.restaurant.makerID === route.params.user.username){
        return (
            <Restaurant_page_auth route={route} navigation={navigation}/>
            );
    }
    else{
        if(route.params.restaurant.isFinishRecruiting){
            return (
                <Restaurant_page_finished route={route} navigation={navigation}/>
                );
        }
        return (
            <Restaurant_page_guest route={route} navigation={navigation}/>
            );
    }
    
}
