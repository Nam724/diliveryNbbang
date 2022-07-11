import Restaurant_page_auth from './restaurant_auth';
import Restaurant_page_guest from './restaurant_guest';
import Restaurant_page_finished from './restaurant_finished';

export default function Restaurant_page({route, navigation}){
    // console.log('makerID', route.params.restaurant.makerID)
    // console.log('username', route.params.user.username)
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
        else{
            return (
                <Restaurant_page_guest route={route} navigation={navigation}/>
                );        
        }
    }
    
}
