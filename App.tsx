
import React from 'react'
import AppNavigator from './SRC/Navigation/AppNavigator'
import "react-native-devsettings";
// OR if you are using AsyncStorage
import "react-native-devsettings/withAsyncStorage";
const App = () => {
  return <AppNavigator />
}

export default App