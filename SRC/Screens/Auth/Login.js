import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Card from '../../Components/Molecules/Card/Card';
import Button from '../../Components/Atoms/Buttons/Button';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomTextInput from '../../Components/Atoms/Inputs/CustomTextInput';
import Typography from '../../Components/Atoms/Typography/Typography';
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
    const [Mobile, setMobile] = useState("");
    const [Password, setPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState(""); // State to store user's name
    const [isReturningUser, setIsReturningUser] = useState(false); // Flag for returning user
    const navigation = useNavigation();

    // Check AsyncStorage for stored user data on component mount
    useEffect(() => {
        const checkStoredUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("USER");
                const storedMobile = await AsyncStorage.getItem("MOBILE");
                if (storedUser && storedMobile) {
                    const userData = JSON.parse(storedUser);
                    setMobile(storedMobile); // Pre-fill mobile number
                    setUserName(userData.Name); // Set user's name
                    setIsReturningUser(true); // Mark as returning user
                }
            } catch (error) {
                console.log("Error retrieving stored user data", error);
            }
        };
        checkStoredUser();
    }, []);

    const Login = async () => {
        // Validation checks
        if (!Mobile || !Password) {
            Alert.alert("Validation Error", "All fields are required.");
            return;
        }

        if (Mobile.length !== 10 || isNaN(Mobile)) {
            Alert.alert("Validation Error", "Mobile number must be 10 digits.");
            return;
        }

        // Proceed with login
        setModalVisible(true);
        setLoading(true);

        try {
            // Firestore query
            const response = await firestore()
                .collection("users")
                .where("Mobile", "==", Mobile)
                .get();

            console.log("Complete data", response._docs);

            // Check if any documents were found
            if (response._docs.length === 0) {
                setTimeout(() => {
                    setLoading(false);
                    setModalVisible(false);
                    Alert.alert("No User Found", "No user found with this mobile number.");
                }, 1000);
            } else {
                const userData = response._docs.map((doc) => doc._data);
                console.log("Real user", userData);

                if (userData[0].Pin === Password) {
                    console.log("User found with correct password.");
                    // Store data in AsyncStorage
                    await AsyncStorage.setItem("USER", JSON.stringify(userData[0]));
                    await AsyncStorage.setItem("MOBILE", Mobile);
                    await AsyncStorage.setItem("USERID", userData[0].userId);
                    setTimeout(() => {
                        setLoading(false);
                        setIsAuthenticated(true);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        setLoading(false);
                        setModalVisible(false);
                        Alert.alert("Validation Error", "Incorrect PIN.");
                    }, 1000);
                }
            }
        } catch (error) {
            setLoading(false);
            setModalVisible(false);
            console.log("We got some error", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    const handleAnimationFinish = () => {
        setModalVisible(false);
        navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
        });
    };

    const navigateToSignup = () => {
        navigation.navigate("Signup");
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "black" }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: "black"
                }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ marginBottom: 20, flexDirection: "column", alignSelf: "flex-start", paddingHorizontal: 30 }}>
                    <View style={{ flexDirection: "row" }}>
                        <Typography color='white' fontSize={responsiveFontSize(2)} fontWeight='600' lineHeight={25}>Login</Typography>
                        <Text style={{ lineHeight: 25 }}> 🔏</Text>
                    </View>
                    <Typography color='#FFA500' fontSize={responsiveFontSize(2)} fontWeight='600' lineHeight={25}>
                        Welcome {isReturningUser && userName ? userName : "Login To Your Link Profile"}
                    </Typography>
                </View>
                <Card
                    backgroundColor="white"
                    borderRadius={15}
                    alignItems="center"
                    height={isReturningUser ? responsiveHeight(25) : responsiveHeight(30)} // Adjust height for fewer fields
                    width={responsiveWidth(90)}
                    style={{ marginBottom: 50 }}
                >
                    {!isReturningUser && (
                        <View style={{ marginTop: 20 }}>
                            <Typography color="grey" fontSize={responsiveFontSize(2)} fontWeight="700" lineHeight={26}>
                                Mobile
                            </Typography>
                            <CustomTextInput
                                inputMode='numeric'
                                placeholder="Enter Your Mobile"
                                width={responsiveWidth(80)}
                                onChangeText={(event) => setMobile(event)}
                                value={Mobile} // Pre-fill mobile
                            />
                        </View>
                    )}
                    <View style={{ marginTop: isReturningUser ? 20 : 0 }}>
                        <Typography color="grey" fontSize={responsiveFontSize(2)} fontWeight="700" lineHeight={26}>
                            PIN
                        </Typography>
                        <CustomTextInput
                            placeholder="Enter Your PIN"
                            width={responsiveWidth(80)}
                            onChangeText={(event) => setPassword(event)}
                            secureTextEntry
                            inputMode='numeric'
                        />
                    </View>
                </Card>

                <Button
                    text={"Submit"}
                    backgroundColor="#FFA500"
                    height={responsiveHeight(6)}
                    width={responsiveWidth(50)}
                    onPress={Login}
                />

                {/* Navigation to Signup */}
                <Typography
                    color='#FFA500'
                    fontSize={responsiveFontSize(2)}
                    fontWeight='600'
                    onPress={navigateToSignup}
                    style={{ marginTop: responsiveHeight(2), textDecorationLine: 'underline' }}
                >
                    Don't have an account? Signup
                </Typography>

                {/* Success Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }}>
                        {loading ? (
                            <ActivityIndicator color={"#FFA500"} size={"large"} />
                        ) : isAuthenticated ? (
                            <LottieView
                                source={require('../../Assests/Lottie/Tick.json')}
                                autoPlay
                                loop={false}
                                onAnimationFinish={handleAnimationFinish}
                                style={{ width: 150, height: 150 }}
                            />
                        ) : null}
                    </View>
                </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;