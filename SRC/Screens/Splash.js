import { View} from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { useNavigation } from '@react-navigation/native'

const Splash = () => {
   const navigation = useNavigation();
    const onComplete=()=>{
      navigation.navigate("Signup");
    }
  return (
    <View style={{flex:1, backgroundColor: "black", justifyContent: "center", alignItems: "center"}}>
      <LottieView 
        style={{flex:1, width: 300, height: 300}} 
        source={require('../Assests/Lottie/Splash.json')} 
        autoPlay
        loop={false}
        onAnimationFinish={onComplete}
      />
    </View>
  )
}

export default Splash
