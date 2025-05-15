import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Card from '../../Components/Molecules/Card/Card';
import Button from '../../Components/Atoms/Buttons/Button';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomTextInput from '../../Components/Atoms/Inputs/CustomTextInput';
import Typography from '../../Components/Atoms/Typography/Typography';
import uuid from 'react-native-uuid';
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const Login = () => {
    const [Mobile, setMobile] = useState("");
    const [Password, setPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        console.log("Component mounted");
    }, []);

    const Login = () => {
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

        firestore()
            .collection("users")
            .where("Mobile", "==", Mobile)
            .get()
            .then((response) => {
                console.log("Complete data", response._docs);

                // Check if any documents were found
                if (response._docs.length === 0) {
                    setTimeout(() => {
                        setLoading(false);
                        setModalVisible(false);
                        Alert.alert("No User Found", "No user found with this mobile number.");
                    }, 1000);
                } else {
                    const userData = response._docs.map(doc => doc._data);
                    console.log("Real user", userData);

                    if (userData[0].Pin === Password) {
                        console.log("User found with correct password.");
                        setTimeout(() => {
                            setLoading(false);
                            setIsAuthenticated(true);
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            setLoading(false);
                            setModalVisible(false);
                            Alert.alert("Validation Error", "Incorrect password.");
                        }, 1000);
                    }
                }
            })
            .catch((error) => {
                setLoading(false);
                setModalVisible(false);
                console.log("We got some error", error);
                Alert.alert("Error", "Something went wrong. Please try again.");
            });
    };

    const handleAnimationFinish = () => {
        setModalVisible(false);
        navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
        });
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
                        Welcome Login To Your Link Profile
                    </Typography>
                </View>
                <Card
                    backgroundColor="white"
                    borderRadius={15}
                    alignItems="center"
                    height={responsiveHeight(30)}
                    width={responsiveWidth(90)}
                    style={{ marginBottom: 50 }}
                >
                    <View style={{ marginTop: 20 }}>
                        <Typography color="grey" fontSize={responsiveFontSize(2)} fontWeight="700" lineHeight={26}>
                            Mobile
                        </Typography>
                        <CustomTextInput
                            inputMode='numeric'
                            placeholder="Enter Your Mobile"
                            width={responsiveWidth(80)}
                            onChangeText={(event) => setMobile(event)}
                        />
                    </View>
                    <View style={{ marginTop: 0 }}>
                        <Typography color="grey" fontSize={responsiveFontSize(2)} fontWeight="700" lineHeight={26}>
                            Password
                        </Typography>
                        <CustomTextInput
                            placeholder="Enter Your Password"
                            width={responsiveWidth(80)}
                            onChangeText={(event) => setPassword(event)}
                            secureTextEntry
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
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly darker overlay
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