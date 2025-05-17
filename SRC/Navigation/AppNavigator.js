import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Splash from '../Screens/Splash';
import Signup from '../Screens/Auth/Signup';
import Login from '../Screens/Auth/Login';
import Dashboard from '../Screens/Dashboard/Dashboard';
import Chat from '../Screens/Chat/Chat';
import { View, Text } from 'react-native';
import HomeIcon from '../Assests/Icon/HomeIcon'; // Ensure the path is correct
import SettingsIcon from '../Assests/Icon/SettingIcon'; // Import the new SettingsIcon


const SettingsTab = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Tab</Text>
    </View>
  );
};

// Bottom Tab Navigator for Dashboard
const Tab = createBottomTabNavigator();

const DashboardTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            // Use HomeIcon SVG for Home tab
            return <HomeIcon color={color} width={size} height={size} />;
          }else if (route.name === 'Settings') {
            // Use SettingsIcon SVG for Settings tab
            return <SettingsIcon color={color} width={size} height={size} />;
          }
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Settings" component={SettingsTab} />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SplashScreen" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;